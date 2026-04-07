import React from 'react';
import { motion } from 'motion/react';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, Zap, Smartphone, Magnet, Sparkles, RefreshCcw } from 'lucide-react';

const features = [
  {
    icon: Magnet,
    title: "N52 Neodymium Core",
    description: "The strongest magnets available in consumer tech. 1.2kg of pull force that snaps with authority.",
    stat: "1.2kg Pull"
  },
  {
    icon: Shield,
    title: "Ecosystem Guard",
    description: "Shielded to prevent interference with NFC, GPS, or your phone's internal compass.",
    stat: "Zero Interference"
  },
  {
    icon: Smartphone,
    title: "MagSafe Native",
    description: "Perfectly aligned with Apple's magnetic ring. Works with all MagSafe-compatible iPhones.",
    stat: "100% Compatible"
  },
  {
    icon: Zap,
    title: "Thermal Snap",
    description: "Heat-dissipating materials ensure your phone stays cool even during high-speed charging.",
    stat: "Cool-Touch Tech"
  }
];

export const Features = () => {
  return (
    <section className="py-24 bg-white text-magsnap-black overflow-hidden">
      <div className="container max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-magsnap-black text-white text-[10px] font-bold uppercase tracking-widest"
            >
              <Sparkles className="w-3 h-3 text-magsnap-teal" />
              <span>Technical Specifications</span>
            </motion.div>
            
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-heading font-extrabold tracking-tight uppercase leading-none"
            >
              The Science of <br />
              <span className="text-magsnap-blue">Magnetic Grip</span>
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-lg text-magsnap-gray font-light max-w-md"
            >
              We've spent years perfecting the magnetic array. The result is 
              a holder that feels like an extension of your car or desk.
            </motion.p>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="p-6 border border-magsnap-silver/20 rounded-2xl bg-magsnap-silver/5">
                <div className="text-3xl font-heading font-bold text-magsnap-black">99.9%</div>
                <div className="text-xs font-medium text-magsnap-gray uppercase tracking-wider">Alignment Accuracy</div>
              </div>
              <div className="p-6 border border-magsnap-silver/20 rounded-2xl bg-magsnap-silver/5">
                <div className="text-3xl font-heading font-bold text-magsnap-black">0.8mm</div>
                <div className="text-xs font-medium text-magsnap-gray uppercase tracking-wider">Ultra-Thin Profile</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="h-full border-none shadow-none bg-magsnap-silver/5 hover:bg-magsnap-silver/10 transition-colors group cursor-default">
                  <CardContent className="p-8 space-y-4">
                    <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                      <feature.icon className="w-6 h-6 text-magsnap-black" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-heading font-bold text-lg uppercase tracking-tight">{feature.title}</h3>
                      <p className="text-sm text-magsnap-gray font-light leading-relaxed">{feature.description}</p>
                    </div>
                    <div className="pt-2">
                      <span className="text-[10px] font-mono font-medium text-magsnap-blue bg-magsnap-blue/10 px-2 py-1 rounded uppercase tracking-wider">
                        {feature.stat}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
