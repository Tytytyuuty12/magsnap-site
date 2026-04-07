import React, { useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';

const Dot = ({ mouseX, mouseY, x, y }: { mouseX: any, mouseY: any, x: number, y: number }) => {
  const dotRef = useRef<HTMLDivElement>(null);
  
  const distanceX = useTransform(mouseX, (val: number) => {
    if (!dotRef.current) return 0;
    const rect = dotRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    return val - centerX;
  });

  const distanceY = useTransform(mouseY, (val: number) => {
    if (!dotRef.current) return 0;
    const rect = dotRef.current.getBoundingClientRect();
    const centerY = rect.top + rect.height / 2;
    return val - centerY;
  });

  const distance = useTransform([distanceX, distanceY], ([dx, dy]) => {
    return Math.sqrt((dx as number) ** 2 + (dy as number) ** 2);
  });

  const scale = useTransform(distance, [0, 200], [2, 1]);
  const opacity = useTransform(distance, [0, 200], [0.8, 0.2]);
  
  const springConfig = { damping: 20, stiffness: 200 };
  const springScale = useSpring(scale, springConfig);
  const springOpacity = useSpring(opacity, springConfig);

  return (
    <motion.div
      ref={dotRef}
      style={{
        scale: springScale,
        opacity: springOpacity,
      }}
      className="w-1 h-1 bg-magsnap-teal rounded-full"
    />
  );
};

export const MagneticField = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  const rows = 12;
  const cols = 20;

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
      <div 
        className="grid gap-12"
        style={{ 
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gridTemplateRows: `repeat(${rows}, 1fr)` 
        }}
      >
        {Array.from({ length: rows * cols }).map((_, i) => (
          <Dot 
            key={i} 
            mouseX={mouseX} 
            mouseY={mouseY} 
            x={i % cols} 
            y={Math.floor(i / cols)} 
          />
        ))}
      </div>
    </div>
  );
};
