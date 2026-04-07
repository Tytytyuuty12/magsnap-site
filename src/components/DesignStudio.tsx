import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Sparkles, Download, RefreshCw, Image as ImageIcon, Wand2 } from 'lucide-react';
import { generateImage } from '@/src/lib/gemini';

const prompts = [
  {
    id: 1,
    title: "Instant Connection",
    prompt: "Minimalist logo for a tech brand called 'MagSnap'. The icon shows two sleek geometric semi-circles snapping together. High-end tech aesthetic, Apple style, vector design, flat, matte black and silver, white background."
  },
  {
    id: 2,
    title: "MagSafe Ring",
    prompt: "Modern logo icon for 'MagSnap'. A stylized, elegant MagSafe magnetic ring made of clean lines and dots. Premium tech accessory branding, minimalist, luxury, silver and space gray, vector art."
  },
  {
    id: 3,
    title: "Magnetic M",
    prompt: "A professional lettermark logo 'M' for a brand named 'MagSnap'. The 'M' is constructed from thick, magnetic-looking geometric shapes. Strong, powerful, industrial tech feel, minimalist, black and white, high contrast, vector."
  }
];

export const DesignStudio = () => {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (customPrompt?: string) => {
    const finalPrompt = customPrompt || prompt;
    if (!finalPrompt) return;

    setIsGenerating(true);
    setError(null);
    try {
      const imageUrl = await generateImage(finalPrompt);
      setGeneratedImage(imageUrl);
    } catch (err) {
      setError("Failed to generate image. Please try again.");
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <section className="py-24 bg-magsnap-black text-white overflow-hidden">
      <div className="container max-w-6xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-16">
          {/* Left Side: Controls */}
          <div className="flex-1 space-y-12">
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-magsnap-teal text-magsnap-black text-[10px] font-bold uppercase tracking-widest"
              >
                <Wand2 className="w-3 h-3" />
                <span>AI Design Studio</span>
              </motion.div>
              
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-5xl md:text-6xl font-heading font-extrabold tracking-tight uppercase leading-none"
              >
                Visualize <br />
                <span className="text-magsnap-teal">The Future</span>
              </motion.h2>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-lg text-magsnap-silver font-light max-w-md leading-relaxed"
              >
                Use our integrated AI engine to generate logo concepts and product 
                visuals. Powered by Gemini 3.1 Flash Image.
              </motion.p>
            </div>

            <div className="space-y-8">
              <div className="space-y-4">
                <label className="text-xs font-bold uppercase tracking-widest text-magsnap-silver">Select a Direction</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {prompts.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => {
                        setPrompt(p.prompt);
                        handleGenerate(p.prompt);
                      }}
                      className="p-4 border border-white/10 rounded-2xl bg-white/5 hover:bg-white/10 hover:border-magsnap-teal/50 transition-all text-left group"
                    >
                      <div className="text-xs font-bold uppercase tracking-wider mb-1 group-hover:text-magsnap-teal transition-colors">{p.title}</div>
                      <div className="text-[10px] text-magsnap-silver line-clamp-2 font-light leading-tight">{p.prompt}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-xs font-bold uppercase tracking-widest text-magsnap-silver">Custom Prompt</label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Describe your vision..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="bg-white/5 border-white/10 h-14 rounded-2xl text-white placeholder:text-white/20 focus-visible:ring-magsnap-teal"
                  />
                  <Button 
                    onClick={() => handleGenerate()}
                    disabled={isGenerating || !prompt}
                    className="h-14 w-14 rounded-2xl bg-magsnap-teal text-magsnap-black hover:bg-magsnap-teal/90 shrink-0"
                  >
                    {isGenerating ? <Loader2 className="w-6 h-6 animate-spin" /> : <Sparkles className="w-6 h-6" />}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Preview */}
          <div className="flex-1 flex items-center justify-center">
            <div className="relative w-full aspect-square max-w-[500px]">
              {/* Decorative Frame */}
              <div className="absolute -inset-4 border border-white/5 rounded-[40px] pointer-events-none" />
              <div className="absolute -inset-8 border border-white/5 rounded-[48px] pointer-events-none opacity-50" />
              
              <Card className="w-full h-full border-none bg-white/5 rounded-[32px] overflow-hidden relative group">
                <CardContent className="p-0 h-full flex items-center justify-center relative">
                  <AnimatePresence mode="wait">
                    {isGenerating ? (
                      <motion.div 
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col items-center gap-4"
                      >
                        <Loader2 className="w-12 h-12 text-magsnap-teal animate-spin" />
                        <div className="text-xs font-bold uppercase tracking-widest text-magsnap-teal animate-pulse">Generating Vision...</div>
                      </motion.div>
                    ) : generatedImage ? (
                      <motion.div
                        key="image"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-full h-full relative"
                      >
                        <img 
                          src={generatedImage} 
                          alt="Generated Concept" 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                          <Button size="icon" variant="secondary" className="rounded-full">
                            <Download className="w-5 h-5" />
                          </Button>
                          <Button size="icon" variant="secondary" className="rounded-full" onClick={() => handleGenerate()}>
                            <RefreshCw className="w-5 h-5" />
                          </Button>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div 
                        key="placeholder"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center gap-4 text-center px-12"
                      >
                        <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center mb-4">
                          <ImageIcon className="w-10 h-10 text-white/20" />
                        </div>
                        <div className="text-sm font-medium text-magsnap-silver">Select a direction or enter a prompt to begin visualizing.</div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {error && (
                    <div className="absolute bottom-6 left-6 right-6 p-4 bg-destructive/20 border border-destructive/50 rounded-xl text-destructive text-xs font-medium text-center">
                      {error}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
