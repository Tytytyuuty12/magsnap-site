import React from 'react';
import { motion } from 'motion/react';

export const Logo = ({ className = "" }: { className?: string }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative w-10 h-10 flex items-center justify-center">
        {/* MagSafe Ring representation */}
        <motion.div 
          className="absolute inset-0 border-2 border-magsnap-silver/30 rounded-full"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        />
        
        {/* The "Snap" action - two semi-circles */}
      <div className="relative flex items-center justify-center gap-[2px]">
          <motion.div 
            className="w-3 h-6 border-l-4 border-t-4 border-b-4 border-white rounded-l-full shadow-[0_0_10px_rgba(255,255,255,0.2)]"
            initial={{ x: -5 }}
            animate={{ x: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
          />
          <motion.div 
            className="w-1.5 h-1.5 bg-magsnap-teal rounded-full shadow-[0_0_15px_rgba(0,242,255,0.8)]"
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.5, 1] }}
            transition={{ delay: 0.2, duration: 0.3 }}
          />
          <motion.div 
            className="w-3 h-6 border-r-4 border-t-4 border-b-4 border-white rounded-r-full shadow-[0_0_10px_rgba(255,255,255,0.2)]"
            initial={{ x: 5 }}
            animate={{ x: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
          />
        </div>
      </div>
      <div className="font-heading text-xl tracking-tight">
        <span className="font-medium text-magsnap-silver">Mag</span>
        <span className="font-bold text-white">Snap</span>
        <span className="ml-1 text-[10px] font-black uppercase tracking-tighter text-magsnap-teal drop-shadow-[0_0_8px_rgba(0,242,255,0.5)]">Ultra</span>
      </div>
    </div>
  );
};
