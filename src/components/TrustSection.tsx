import React from 'react';
import { motion } from 'motion/react';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: "Alex Rivera",
    role: "Tech Reviewer",
    content: "The snap is incredibly satisfying. It's the only holder that doesn't drop my phone on bumpy roads.",
    rating: 5
  },
  {
    name: "Sarah Chen",
    role: "Digital Nomad",
    content: "I use the Desk Pro every day. It's sleek, heavy, and looks like it belongs in an Apple Store.",
    rating: 5
  },
  {
    name: "Marcus Thorne",
    role: "Professional Driver",
    content: "N52 magnets are no joke. This thing is industrial strength. Best investment for my car.",
    rating: 5
  }
];

const logos = ["TechRadar", "Wired", "The Verge", "CNET", "Forbes"];

export const TrustSection = () => {
  return (
    <section className="py-24 bg-magsnap-silver/5 border-y border-magsnap-silver/10">
      <div className="container max-w-6xl mx-auto px-6">
        {/* Logos */}
        <div className="mb-20">
          <p className="text-center text-[10px] font-bold uppercase tracking-[0.3em] text-magsnap-gray/50 mb-8">As Featured In</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-30 grayscale">
            {logos.map((logo) => (
              <span key={logo} className="text-xl md:text-2xl font-heading font-black tracking-tighter uppercase italic">{logo}</span>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="p-8 rounded-[32px] bg-white border border-magsnap-silver/10 space-y-6 relative overflow-hidden group"
            >
              <Quote className="absolute -top-4 -right-4 w-24 h-24 text-magsnap-teal/5 group-hover:text-magsnap-teal/10 transition-colors" />
              
              <div className="flex gap-1">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-magsnap-teal text-magsnap-teal" />
                ))}
              </div>

              <p className="text-magsnap-gray font-light leading-relaxed relative z-10">
                "{t.content}"
              </p>

              <div className="pt-4 border-t border-magsnap-silver/5">
                <div className="font-heading font-bold text-sm uppercase tracking-tight">{t.name}</div>
                <div className="text-[10px] font-medium text-magsnap-blue uppercase tracking-widest">{t.role}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust Badge */}
        <div className="mt-20 flex flex-col items-center text-center space-y-4">
          <div className="flex items-center gap-4 px-6 py-3 rounded-full bg-magsnap-black text-white">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-magsnap-black bg-magsnap-silver overflow-hidden">
                  <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="" />
                </div>
              ))}
            </div>
            <div className="text-xs font-bold uppercase tracking-widest">
              Joined by <span className="text-magsnap-teal">12,000+</span> Snap Users
            </div>
          </div>
          <p className="text-xs text-magsnap-gray font-medium uppercase tracking-widest">30-Day Money Back Guarantee • Free Worldwide Shipping</p>
        </div>
      </div>
    </section>
  );
};
