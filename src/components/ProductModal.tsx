import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  description: string;
}

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ product, isOpen, onClose, onAddToCart }) => {
  if (!product) return null;

  const isLittleDog = product.category === "Little Dog";

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="fixed inset-4 z-50 flex items-center justify-center"
             onClick={onClose}
          >
            <div className={`rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden relative ${
              isLittleDog 
                ? 'bg-gradient-to-br from-gold/30 via-yellow-100/60 to-white/80 backdrop-blur-lg border border-gold/40 shadow-[0_0_80px_10px_rgba(251,191,36,0.35)]' 
                : 'bg-white shadow-2xl'
            }`}
            onClick={(e) => e.stopPropagation()}>
              {/* Fire LIMITED tag for Little Dog */}
              {isLittleDog && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 text-xs font-bold text-yellow-400 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)] select-none">
                  LIMITED
                </div>
              )}
              {/* Golden glow overlay for Little Dog */}
              {isLittleDog && (
                <div className="pointer-events-none absolute inset-0 z-0 rounded-2xl shadow-[0_0_120px_30px_rgba(251,191,36,0.25)]" />
              )}

              <div className="flex flex-col lg:flex-row relative z-10">
                {/* Image Section */}
                <motion.div 
                  className={`lg:w-1/2 p-8 flex items-center justify-center ${
                    isLittleDog 
                      ? 'bg-transparent' 
                      : 'bg-gradient-to-br from-offwhite to-cream'
                  }`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.6, ease: 'easeInOut' }}
                >
                  <div className={`w-72 h-72 rounded-xl overflow-hidden bg-white shadow-lg ${
                    isLittleDog ? 'shadow-[0_0_30px_rgba(251,191,36,0.4)]' : ''
                  }`}>
                    <motion.img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      initial={{ scale: 1.1 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.8, ease: 'easeInOut' }}
                      style={{
                        filter: isLittleDog ? 'drop-shadow(0 8px 16px rgba(251,191,36,0.3))' : undefined
                      }}
                    />
                  </div>
                </motion.div>

                {/* Content Section */}
                <motion.div 
                  className={`lg:w-1/2 p-8 flex flex-col justify-center ${isLittleDog ? 'bg-transparent' : ''}`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.6, ease: 'easeInOut' }}
                >
                  <motion.h2 
                    className={`text-2xl font-medium mb-4 ${
                      isLittleDog ? 'text-black' : 'text-black'
                    }`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.6, ease: 'easeInOut' }}
                  >
                    {product.name}
                  </motion.h2>
                  
                  <motion.p 
                    className={`text-base mb-6 leading-relaxed font-light ${
                      isLittleDog ? 'text-darkgray' : 'text-darkgray'
                    }`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.6, ease: 'easeInOut' }}
                  >
                    {product.description}
                  </motion.p>
                  
                  <motion.div 
                    className={`text-xl font-medium mb-8 ${
                      isLittleDog ? 'text-yellow-400 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]' : 'text-black'
                    }`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.6, ease: 'easeInOut' }}
                  >
                    ${product.price}
                  </motion.div>
                  
                  <motion.button
                    whileHover={{ 
                      scale: 1.02, 
                      backgroundColor: isLittleDog ? '#fbbf24' : '#fbbf24', 
                      color: '#000',
                      boxShadow: isLittleDog ? '0 0 30px rgba(251,191,36,0.5)' : undefined
                    }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onAddToCart(product)}
                    className={`w-full py-4 px-8 font-medium text-base tracking-wide rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl ${
                      isLittleDog 
                        ? 'bg-black text-white hover:bg-gold hover:text-black' 
                        : 'bg-black text-white'
                    }`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.6, ease: 'easeInOut' }}
                  >
                    Add to Cart
                  </motion.button>
                </motion.div>
              </div>

              {/* Close Button */}
              <motion.button
                onClick={onClose}
                className={`absolute top-4 right-4 z-50 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isLittleDog 
                    ? 'bg-black bg-opacity-10 hover:bg-opacity-20 hover:shadow-[0_0_20px_rgba(251,191,36,0.4)]' 
                    : 'bg-black bg-opacity-10 hover:bg-opacity-20'
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8, duration: 0.4, ease: 'easeInOut' }}
              >
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-black">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ProductModal; 