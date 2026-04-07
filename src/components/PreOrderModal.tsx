import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle2, CreditCard, Truck, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface PreOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName?: string;
  price?: number;
}

export const PreOrderModal: React.FC<PreOrderModalProps> = ({ isOpen, onClose, productName, price }) => {
  const [isSubmitted, setIsSubmitted] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
    }, 3000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center px-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-magsnap-black/80 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg bg-white rounded-[40px] overflow-hidden shadow-2xl"
          >
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-magsnap-silver/10 transition-colors"
            >
              <X className="w-6 h-6 text-magsnap-gray" />
            </button>

            <div className="p-10">
              {isSubmitted ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center text-center space-y-6 py-12"
                >
                  <div className="w-20 h-20 rounded-full bg-magsnap-teal/20 flex items-center justify-center">
                    <CheckCircle2 className="w-12 h-12 text-magsnap-teal" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-3xl font-heading font-extrabold uppercase tracking-tight">Order Received!</h3>
                    <p className="text-magsnap-gray font-light">We've sent a confirmation email to your inbox. Welcome to the Snap ecosystem.</p>
                  </div>
                </motion.div>
              ) : (
                <div className="space-y-8">
                  <div className="space-y-2">
                    <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-magsnap-blue">Secure Checkout</div>
                    <h3 className="text-4xl font-heading font-extrabold uppercase tracking-tight">
                      {productName ? `Pre-order ${productName}` : 'Complete Your Order'}
                    </h3>
                    <p className="text-magsnap-gray font-light">Enter your details below to secure your MagSnap Ultra.</p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Input placeholder="First Name" required className="h-14 rounded-2xl border-magsnap-silver/20" />
                      <Input placeholder="Last Name" required className="h-14 rounded-2xl border-magsnap-silver/20" />
                    </div>
                    <Input type="email" placeholder="Email Address" required className="h-14 rounded-2xl border-magsnap-silver/20" />
                    <Input placeholder="Shipping Address" required className="h-14 rounded-2xl border-magsnap-silver/20" />
                    
                    <div className="pt-4 space-y-4">
                      <div className="flex items-center justify-between text-sm font-bold uppercase tracking-widest">
                        <span>Total Amount</span>
                        <span className="text-magsnap-blue text-xl">${price || '45.00'}</span>
                      </div>
                      <Button type="submit" className="w-full h-16 bg-magsnap-black text-white hover:bg-magsnap-gray rounded-full text-lg font-bold">
                        Confirm Pre-order
                      </Button>
                    </div>
                  </form>

                  <div className="grid grid-cols-3 gap-4 pt-6 border-t border-magsnap-silver/10">
                    <div className="flex flex-col items-center text-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-magsnap-teal" />
                      <span className="text-[8px] font-bold uppercase tracking-widest text-magsnap-gray">Secure Payment</span>
                    </div>
                    <div className="flex flex-col items-center text-center gap-2">
                      <Truck className="w-5 h-5 text-magsnap-teal" />
                      <span className="text-[8px] font-bold uppercase tracking-widest text-magsnap-gray">Fast Shipping</span>
                    </div>
                    <div className="flex flex-col items-center text-center gap-2">
                      <CreditCard className="w-5 h-5 text-magsnap-teal" />
                      <span className="text-[8px] font-bold uppercase tracking-widest text-magsnap-gray">All Cards</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
