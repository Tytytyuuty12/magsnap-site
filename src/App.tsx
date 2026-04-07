import React, { useState, useEffect } from 'react';
import { Logo } from '@/src/components/Logo';
import { Hero } from '@/src/components/Hero';
import { Features } from '@/src/components/Features';
import { TrustSection } from '@/src/components/TrustSection';
import { ProductSection } from '@/src/components/ProductSection';
import { ChatAssistant } from '@/src/components/ChatAssistant';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ShoppingBag, Menu, Github, Twitter, Instagram, Mic, LogIn, User as UserIcon } from 'lucide-react';
import { auth, signInWithGoogle } from '@/src/lib/firebase';
import { User } from 'firebase/auth';
import { Magnetic } from '@/src/components/Magnetic';
import { MagneticCursor } from '@/src/components/MagneticCursor';
import { PreOrderModal } from '@/src/components/PreOrderModal';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isPreOrderOpen, setIsPreOrderOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      setUser(u);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-magsnap-teal selection:text-magsnap-black cursor-none">
      <MagneticCursor />
      <PreOrderModal 
        isOpen={isPreOrderOpen} 
        onClose={() => setIsPreOrderOpen(false)} 
        productName="MagSnap Ultra"
        price={45}
      />
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
        <div className="container max-w-7xl mx-auto flex items-center justify-between px-6 py-3 rounded-full border border-white/10 bg-magsnap-black/80 backdrop-blur-md text-white">
          <Magnetic strength={0.2}>
            <Logo />
          </Magnetic>
          
          <div className="hidden md:flex items-center gap-8 text-xs font-bold uppercase tracking-widest text-magsnap-silver">
            <Magnetic strength={0.15}>
              <a href="#products" className="hover:text-magsnap-teal transition-colors px-2 py-1">Products</a>
            </Magnetic>
            <Magnetic strength={0.15}>
              <a href="#technology" className="hover:text-magsnap-teal transition-colors px-2 py-1">Technology</a>
            </Magnetic>
            <Magnetic strength={0.15}>
              <a href="#reviews" className="hover:text-magsnap-teal transition-colors px-2 py-1">Reviews</a>
            </Magnetic>
            <Magnetic strength={0.15}>
              <a href="#about" className="hover:text-magsnap-teal transition-colors px-2 py-1">About</a>
            </Magnetic>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <Magnetic strength={0.1}>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/10">
                  <img src={user.photoURL || ''} alt="" className="w-6 h-6 rounded-full" />
                  <span className="text-[10px] font-bold uppercase tracking-wider hidden sm:inline">{user.displayName?.split(' ')[0]}</span>
                </div>
              </Magnetic>
            ) : (
              <Magnetic strength={0.2}>
                <Button 
                  onClick={handleLogin}
                  variant="ghost" 
                  size="sm" 
                  className="rounded-full text-white hover:bg-white/10 gap-2 px-4"
                >
                  <LogIn className="w-4 h-4" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Sign In</span>
                </Button>
              </Magnetic>
            )}
            <Magnetic strength={0.2}>
              <Button size="icon" variant="ghost" className="rounded-full text-white hover:bg-white/10">
                <ShoppingBag className="w-5 h-5" />
              </Button>
            </Magnetic>
            <Button size="icon" variant="ghost" className="md:hidden rounded-full text-white hover:bg-white/10">
              <Menu className="w-5 h-5" />
            </Button>
            <Magnetic strength={0.3}>
              <Button 
                onClick={() => setIsPreOrderOpen(true)}
                className="hidden md:flex bg-magsnap-teal text-magsnap-black hover:bg-magsnap-teal/90 font-bold rounded-full px-6"
              >
                Pre-order Now
              </Button>
            </Magnetic>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow">
        <Hero onPreOrder={() => setIsPreOrderOpen(true)} />
        <div id="technology">
          <Features />
        </div>
        <div id="reviews">
          <TrustSection />
        </div>
        <ProductSection onPreOrder={() => setIsPreOrderOpen(true)} />
        
        {/* Call to Action Section */}
        <section className="py-24 bg-white text-magsnap-black text-center" id="about">
          <div className="container max-w-4xl mx-auto px-6 space-y-8">
            <h2 className="text-5xl md:text-7xl font-heading font-extrabold tracking-tight uppercase leading-none">
              Ready to <span className="text-magsnap-blue italic">Snap</span>?
            </h2>
            <p className="text-xl text-magsnap-gray font-light max-w-2xl mx-auto">
              Join the thousands of early adopters who have upgraded their 
              mobile experience with MagSnap Ultra.
            </p>
            <div className="pt-4">
              <Button 
                onClick={() => setIsPreOrderOpen(true)}
                size="lg" 
                className="bg-magsnap-black text-white hover:bg-magsnap-gray font-bold px-12 h-16 text-xl rounded-full"
              >
                Shop the Collection
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Floating Assistants */}
      <ChatAssistant />
      
      {/* Voice Assistant Trigger (Live API Placeholder) */}
      <div className="fixed bottom-6 left-6 z-[100]">
        <Button 
          className="w-16 h-16 rounded-full bg-magsnap-blue text-white shadow-xl hover:scale-110 transition-transform group"
          onClick={() => alert("Voice Conversation (Live API) is coming soon in the next update!")}
        >
          <Mic className="w-8 h-8 group-hover:scale-110 transition-transform" />
        </Button>
      </div>

      {/* Footer */}
      <footer className="bg-magsnap-black text-white py-16 border-t border-white/5">
        <div className="container max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="space-y-6">
              <Logo />
              <p className="text-sm text-magsnap-silver font-light leading-relaxed">
                Precision-engineered MagSafe accessories for the modern digital nomad. 
                Built to last, designed to snap.
              </p>
              <div className="flex gap-4">
                <Button size="icon" variant="ghost" className="rounded-full text-magsnap-silver hover:text-white hover:bg-white/5">
                  <Twitter className="w-5 h-5" />
                </Button>
                <Button size="icon" variant="ghost" className="rounded-full text-magsnap-silver hover:text-white hover:bg-white/5">
                  <Instagram className="w-5 h-5" />
                </Button>
                <Button size="icon" variant="ghost" className="rounded-full text-magsnap-silver hover:text-white hover:bg-white/5">
                  <Github className="w-5 h-5" />
                </Button>
              </div>
            </div>
            
            <div className="space-y-6">
              <h4 className="text-xs font-bold uppercase tracking-widest text-magsnap-teal">Products</h4>
              <ul className="space-y-3 text-sm text-magsnap-silver font-light">
                <li><a href="#" className="hover:text-white transition-colors">MagSnap Case</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Magnetic Wallet</a></li>
                <li><a href="#" className="hover:text-white transition-colors">SnapStand Pro</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Car Mount Ultra</a></li>
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="text-xs font-bold uppercase tracking-widest text-magsnap-teal">Company</h4>
              <ul className="space-y-3 text-sm text-magsnap-silver font-light">
                <li><a href="#" className="hover:text-white transition-colors">Our Story</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Technology</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Sustainability</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="text-xs font-bold uppercase tracking-widest text-magsnap-teal">Support</h4>
              <ul className="space-y-3 text-sm text-magsnap-silver font-light">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Shipping Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Returns & Refunds</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
              </ul>
            </div>
          </div>
          
          <Separator className="bg-white/5 mb-8" />
          
          <div className="flex flex-col md:row items-center justify-between gap-4 text-[10px] font-medium uppercase tracking-widest text-magsnap-silver/50">
            <div>© 2026 MagSnap Technologies Inc. All rights reserved.</div>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Cookie Settings</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
