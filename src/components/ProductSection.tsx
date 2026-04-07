import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  Filter, 
  ArrowLeft, 
  ShoppingCart, 
  Sparkles, 
  Globe, 
  Loader2, 
  ExternalLink,
  ChevronRight,
  Maximize2,
  Heart,
  HeartOff
} from 'lucide-react';
import { generateImage, searchRealImages } from '@/src/lib/gemini';
import { db, auth, handleFirestoreError, OperationType } from '@/src/lib/firebase';
import { doc, setDoc, deleteDoc, onSnapshot, collection, serverTimestamp, getDocFromServer } from 'firebase/firestore';

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  features: string[];
  image: string;
}

const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'MagSnap Ultra - Stealth Black',
    category: 'Car Mount',
    price: 45,
    description: 'The flagship magnetic holder. Precision-machined aluminum with a matte black finish. Features our strongest N52 magnetic array.',
    features: ['N52 Neodymium Magnets', '360° Ball Joint', 'Dashboard & Vent Mount included'],
    image: 'https://images.unsplash.com/photo-1616348436168-de43ad0db179?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: '2',
    name: 'MagSnap Ultra - Arctic Silver',
    category: 'Car Mount',
    price: 45,
    description: 'Elegance meets strength. The Arctic Silver edition matches perfectly with modern car interiors and silver iPhones.',
    features: ['Aerospace-grade Aluminum', 'Anti-slip Silicone Face', 'Universal MagSafe fit'],
    image: 'https://images.unsplash.com/photo-1586105251261-72a756657711?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: '3',
    name: 'MagSnap Desk Pro',
    category: 'Desk Mount',
    price: 55,
    description: 'A heavy-duty magnetic holder for your workspace. Weighted base ensures your phone stays exactly where you want it.',
    features: ['Weighted Steel Base', 'Adjustable Height', 'Portrait & Landscape mode'],
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: '4',
    name: 'MagSnap Go - Travel Edition',
    category: 'Portable',
    price: 35,
    description: 'The compact magnetic holder that fits in your pocket. Perfect for planes, trains, and hotel nightstands.',
    features: ['Foldable Design', 'Ultra-lightweight', 'Strong magnetic snap'],
    image: 'https://images.unsplash.com/photo-1556656793-062ff9878258?q=80&w=800&auto=format&fit=crop'
  }
];

const CATEGORIES = ['All', 'Car Mount', 'Desk Mount', 'Portable'];

export const ProductSection = ({ onPreOrder }: { onPreOrder: () => void }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [isAuthReady, setIsAuthReady] = useState(false);

  // Test connection to Firestore
  useEffect(() => {
    async function testConnection() {
      try {
        await getDocFromServer(doc(db, 'test', 'connection'));
      } catch (error) {
        if(error instanceof Error && error.message.includes('the client is offline')) {
          console.error("Please check your Firebase configuration. The client is offline.");
        }
      }
    }
    testConnection();
  }, []);

  // Listen for auth state and wishlist
  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      setIsAuthReady(true);
      if (user) {
        const wishlistRef = collection(db, 'users', user.uid, 'wishlist');
        const unsubscribeWishlist = onSnapshot(wishlistRef, (snapshot) => {
          const items = snapshot.docs.map(doc => doc.data().productId);
          setWishlist(items);
        }, (error) => {
          handleFirestoreError(error, OperationType.GET, `users/${user.uid}/wishlist`);
        });
        return () => unsubscribeWishlist();
      } else {
        setWishlist([]);
      }
    });
    return () => unsubscribeAuth();
  }, []);

  const toggleWishlist = async (e: React.MouseEvent, productId: string) => {
    e.stopPropagation();
    if (!auth.currentUser) {
      alert("Please sign in to save items to your wishlist.");
      return;
    }

    const path = `users/${auth.currentUser.uid}/wishlist/${productId}`;
    try {
      if (wishlist.includes(productId)) {
        await deleteDoc(doc(db, 'users', auth.currentUser.uid, 'wishlist', productId));
      } else {
        await setDoc(doc(db, 'users', auth.currentUser.uid, 'wishlist', productId), {
          productId,
          userId: auth.currentUser.uid,
          addedAt: serverTimestamp()
        });
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  };

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter(p => {
      const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
      const matchesPrice = p.price >= priceRange[0] && p.price <= priceRange[1];
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesPrice && matchesSearch;
    });
  }, [selectedCategory, priceRange, searchQuery]);

  if (selectedProduct) {
    return <ProductDetails 
      product={selectedProduct} 
      onBack={() => setSelectedProduct(null)} 
      isWishlisted={wishlist.includes(selectedProduct.id)}
      onToggleWishlist={(e) => toggleWishlist(e, selectedProduct.id)}
      onPreOrder={onPreOrder}
    />;
  }

  return (
    <section className="py-24 bg-white" id="products">
      <div className="container max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-heading font-extrabold tracking-tight uppercase">
              The <span className="text-magsnap-blue">Collection</span>
            </h2>
            <p className="text-magsnap-gray font-light max-w-md">
              Explore our range of precision-engineered MagSafe accessories.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="relative flex-grow sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-magsnap-gray" />
              <Input 
                placeholder="Search products..." 
                className="pl-10 rounded-full border-magsnap-silver/20"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" className="rounded-full border-magsnap-silver/20">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Sidebar Filters */}
          <aside className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-magsnap-gray">Categories</h3>
              <div className="flex flex-wrap lg:flex-col gap-2">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`text-sm px-4 py-2 rounded-full text-left transition-colors ${
                      selectedCategory === cat 
                        ? 'bg-magsnap-black text-white font-bold' 
                        : 'bg-magsnap-silver/10 text-magsnap-gray hover:bg-magsnap-silver/20'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-widest text-magsnap-gray">Price Range</h3>
                <span className="text-xs font-mono font-bold">${priceRange[0]} - ${priceRange[1]}</span>
              </div>
              <Slider 
                defaultValue={[0, 100]} 
                max={100} 
                step={1} 
                onValueChange={(value) => setPriceRange(value as number[])}
                className="py-4"
              />
            </div>
          </aside>

          {/* Product Grid */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {filteredProducts.map((product) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card 
                      className="group border-none shadow-none bg-magsnap-silver/5 hover:bg-magsnap-silver/10 transition-all cursor-pointer overflow-hidden rounded-3xl"
                      onClick={() => setSelectedProduct(product)}
                    >
                      <div className="aspect-square relative overflow-hidden">
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-4 right-4 flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-md text-magsnap-black border-none hover:bg-white"
                            onClick={(e) => toggleWishlist(e, product.id)}
                          >
                            {wishlist.includes(product.id) ? (
                              <Heart className="w-5 h-5 text-red-500 fill-current" />
                            ) : (
                              <Heart className="w-5 h-5" />
                            )}
                          </Button>
                          <Badge className="bg-white/80 backdrop-blur-md text-magsnap-black border-none font-bold">
                            ${product.price}
                          </Badge>
                        </div>
                      </div>
                      <CardContent className="p-6 space-y-2">
                        <div className="text-[10px] font-bold uppercase tracking-widest text-magsnap-blue">{product.category}</div>
                        <h3 className="font-heading font-bold text-lg tracking-tight uppercase">{product.name}</h3>
                        <p className="text-xs text-magsnap-gray line-clamp-2 font-light">{product.description}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            
            {filteredProducts.length === 0 && (
              <div className="py-24 text-center space-y-4">
                <div className="text-4xl">🔍</div>
                <h3 className="text-xl font-bold uppercase">No products found</h3>
                <p className="text-magsnap-gray font-light">Try adjusting your filters or search query.</p>
                <Button variant="outline" onClick={() => {
                  setSelectedCategory('All');
                  setPriceRange([0, 100]);
                  setSearchQuery('');
                }} className="rounded-full">Reset All Filters</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

const ProductDetails = ({ product, onBack, isWishlisted, onToggleWishlist, onPreOrder }: { product: Product, onBack: () => void, isWishlisted: boolean, onToggleWishlist: (e: React.MouseEvent) => void, onPreOrder: () => void }) => {
  const [aiImage, setAiImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [imageSize, setImageSize] = useState<"1K" | "2K" | "4K">("1K");
  const [searchResult, setSearchResult] = useState<{ text: string, links: any[] } | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleGenerateAI = async () => {
    setIsGenerating(true);
    try {
      const img = await generateImage(`Hyper-realistic studio product photography of ${product.name}, ${product.description}, minimalist aesthetic, high-end tech lighting, 8k resolution`, imageSize);
      setAiImage(img);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSearchReal = async () => {
    setIsSearching(true);
    try {
      const result = await searchRealImages(product.name);
      setSearchResult({
        text: result.text || "",
        links: result.links || []
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white pt-32 pb-24">
      <div className="container max-w-7xl mx-auto px-6">
        <Button 
          variant="ghost" 
          onClick={onBack} 
          className="mb-8 rounded-full hover:bg-magsnap-silver/10 group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Collection
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Image Gallery */}
          <div className="space-y-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="aspect-square rounded-[40px] overflow-hidden bg-magsnap-silver/5 border border-magsnap-silver/10"
            >
              <img 
                src={aiImage || product.image} 
                alt={product.name} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </motion.div>
            
            <div className="grid grid-cols-4 gap-4">
              <button 
                onClick={() => setAiImage(null)}
                className={`aspect-square rounded-2xl overflow-hidden border-2 transition-all ${!aiImage ? 'border-magsnap-black' : 'border-transparent opacity-50'}`}
              >
                <img src={product.image} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </button>
              {aiImage && (
                <button 
                  className="aspect-square rounded-2xl overflow-hidden border-2 border-magsnap-black"
                >
                  <img src={aiImage} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </button>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-10">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Badge className="bg-magsnap-blue/10 text-magsnap-blue border-none uppercase tracking-widest font-bold text-[10px]">
                  {product.category}
                </Badge>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-12 h-12 rounded-full hover:bg-magsnap-silver/10"
                  onClick={onToggleWishlist}
                >
                  {isWishlisted ? (
                    <Heart className="w-6 h-6 text-red-500 fill-current" />
                  ) : (
                    <Heart className="w-6 h-6" />
                  )}
                </Button>
              </div>
              <h1 className="text-5xl md:text-6xl font-heading font-extrabold tracking-tighter uppercase leading-none">
                {product.name}
              </h1>
              <div className="text-3xl font-heading font-bold text-magsnap-black">${product.price}</div>
              <p className="text-lg text-magsnap-gray font-light leading-relaxed">
                {product.description}
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-magsnap-black">Key Features</h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {product.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-magsnap-gray font-light">
                    <div className="w-1.5 h-1.5 rounded-full bg-magsnap-teal" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={onPreOrder}
                size="lg" 
                className="flex-grow bg-magsnap-black text-white hover:bg-magsnap-gray h-16 rounded-full text-lg font-bold"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Add to Cart
              </Button>
              <Button size="lg" variant="outline" className="h-16 w-16 rounded-full border-magsnap-silver/20">
                <Maximize2 className="w-6 h-6" />
              </Button>
            </div>

            {/* AI & Search Tools */}
            <div className="pt-8 border-t border-magsnap-silver/20 space-y-8">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-magsnap-teal" />
                    <h3 className="text-xs font-bold uppercase tracking-widest">AI Visualization</h3>
                  </div>
                  <div className="flex gap-2">
                    {(["1K", "2K", "4K"] as const).map(size => (
                      <button 
                        key={size}
                        onClick={() => setImageSize(size)}
                        className={`text-[10px] font-bold px-2 py-1 rounded border transition-colors ${imageSize === size ? 'bg-magsnap-black text-white border-magsnap-black' : 'border-magsnap-silver/20 text-magsnap-gray'}`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
                <Button 
                  onClick={handleGenerateAI} 
                  disabled={isGenerating}
                  className="w-full bg-magsnap-teal/10 text-magsnap-black border border-magsnap-teal/20 hover:bg-magsnap-teal/20 h-12 rounded-xl font-bold"
                >
                  {isGenerating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
                  Generate High-Quality {imageSize} Concept
                </Button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-magsnap-blue" />
                  <h3 className="text-xs font-bold uppercase tracking-widest">Real-World Context</h3>
                </div>
                <Button 
                  onClick={handleSearchReal} 
                  disabled={isSearching}
                  className="w-full bg-magsnap-blue/10 text-magsnap-black border border-magsnap-blue/20 hover:bg-magsnap-blue/20 h-12 rounded-xl font-bold"
                >
                  {isSearching ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Globe className="w-4 h-4 mr-2" />}
                  Search for Real Images & Reviews
                </Button>

                {searchResult && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 rounded-2xl bg-magsnap-silver/5 border border-magsnap-silver/10 space-y-4"
                  >
                    <p className="text-sm text-magsnap-gray font-light leading-relaxed italic">
                      "{searchResult.text}"
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {searchResult.links.map((link, i) => (
                        <a 
                          key={i} 
                          href={link.uri} 
                          target="_blank" 
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-magsnap-silver/20 text-[10px] font-bold uppercase tracking-wider hover:bg-magsnap-silver/5 transition-colors"
                        >
                          {link.title}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
