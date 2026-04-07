import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Magnet, Zap } from 'lucide-react';
import { Magnetic } from './Magnetic';
import { MagneticField } from './MagneticField';

export const Hero = ({ onPreOrder }: { onPreOrder: () => void }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const y2 = useTransform(scrollY, [0, 500], [0, -150]);
  const rotate = useTransform(scrollY, [0, 500], [0, 15]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  const springConfig = { damping: 20, stiffness: 100 };
  const springY1 = useSpring(y1, springConfig);
  const springY2 = useSpring(y2, springConfig);

  return (
    <section ref={containerRef} className="relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden bg-magsnap-black text-white px-6 py-24">
      {/* Magnetic Field Background */}
      <MagneticField />
      
      {/* Background Glow */}
      <motion.div 
        style={{ opacity }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-magsnap-teal/10 rounded-full blur-[120px] pointer-events-none" 
      />
      
      <div className="container max-w-6xl mx-auto relative z-10">
        <div className="flex flex-col items-center text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm text-xs font-medium tracking-widest uppercase text-magsnap-teal"
          >
            <Zap className="w-3 h-3 fill-current" />
            <span>N52 Industrial Strength</span>
          </motion.div>

          <motion.div
            style={{ y: springY1, rotateX: rotate }}
            className="perspective-1000"
          >
            <motion.h1
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-6xl md:text-8xl lg:text-9xl font-heading font-extrabold tracking-tighter leading-[0.85] uppercase drop-shadow-2xl"
            >
              The <span className="text-magsnap-teal">Ultra</span> <br />
              Holder <span className="italic font-light text-magsnap-silver">Elite</span>
            </motion.h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="max-w-2xl text-lg md:text-xl text-magsnap-silver font-light leading-relaxed"
          >
            MagSnap Ultra is the last phone holder you'll ever buy. 
            Precision-engineered N52 magnets that lock your device in place 
            with satisfying force. Zero vibration. Absolute security.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-6 pt-4 items-center"
          >
            <Magnetic strength={0.3}>
              <Button 
                onClick={onPreOrder}
                size="lg" 
                className="bg-magsnap-teal text-magsnap-black hover:bg-magsnap-teal/90 font-bold px-8 h-14 text-lg rounded-full group shadow-[0_0_20px_rgba(45,212,191,0.3)]"
              >
                Shop Collection
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Magnetic>
            
            <Magnetic strength={0.2}>
              <Button 
                onClick={onPreOrder}
                size="lg" 
                variant="outline" 
                className="border-white/20 text-white hover:bg-white/10 font-medium px-8 h-14 text-lg rounded-full"
              >
                Explore Tech
              </Button>
            </Magnetic>
          </motion.div>
        </div>
      </div>

      {/* Floating Magnetic Elements (Abstract) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          style={{ y: springY2 }}
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 5, 0]
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[20%] left-[10%] w-32 h-32 border border-white/5 rounded-3xl rotate-12 bg-gradient-to-br from-white/5 to-transparent backdrop-blur-sm"
        />
        <motion.div
          style={{ y: springY1 }}
          animate={{ 
            y: [0, 20, 0],
            rotate: [0, -5, 0]
          }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-[20%] right-[10%] w-48 h-48 border border-white/5 rounded-full -rotate-12 bg-gradient-to-tl from-white/5 to-transparent backdrop-blur-sm"
        />
        
        {/* Additional 3D Elements */}
        <motion.div
          style={{ y: springY2, rotate: -15 }}
          className="absolute top-[15%] right-[15%] w-16 h-16 border border-magsnap-teal/20 rounded-lg bg-magsnap-teal/5 blur-[1px]"
        />
        <motion.div
          style={{ y: springY1, rotate: 45 }}
          className="absolute bottom-[15%] left-[15%] w-24 h-24 border border-white/10 rounded-full bg-white/5 blur-[2px]"
        />
      </div>
    </section>
  );
};
