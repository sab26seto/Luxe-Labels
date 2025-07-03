import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Product {
  id: number;
  name: string;
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
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
              <div className="flex flex-col lg:flex-row">
                {/* Image Section */}
                <motion.div 
                  className="lg:w-1/2 p-8 flex items-center justify-center bg-gradient-to-br from-offwhite to-cream"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.6, ease: 'easeInOut' }}
                >
                  <div className="w-72 h-72 rounded-xl overflow-hidden bg-white shadow-lg">
                    <motion.img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      initial={{ scale: 1.1 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.8, ease: 'easeInOut' }}
                    />
                  </div>
                </motion.div>

                {/* Content Section */}
                <motion.div 
                  className="lg:w-1/2 p-8 flex flex-col justify-center"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.6, ease: 'easeInOut' }}
                >
                  <motion.h2 
                    className="text-2xl font-medium text-black mb-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.6, ease: 'easeInOut' }}
                  >
                    {product.name}
                  </motion.h2>
                  
                  <motion.p 
                    className="text-base text-darkgray mb-6 leading-relaxed font-light"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.6, ease: 'easeInOut' }}
                  >
                    {product.description}
                  </motion.p>
                  
                  <motion.div 
                    className="text-xl font-medium text-black mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.6, ease: 'easeInOut' }}
                  >
                    ${product.price}
                  </motion.div>
                  
                  <motion.button
                    whileHover={{ scale: 1.02, backgroundColor: '#fbbf24', color: '#000' }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onAddToCart(product)}
                    className="w-full py-4 px-8 bg-black text-white font-medium text-base tracking-wide rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, duration: 0.6, ease: 'easeInOut' }}
                  >
                    Add to Cart
                  </motion.button>
                </motion.div>
              </div>

              {/* Close Button */}
              <motion.button
                onClick={onClose}
                className="absolute top-6 right-6 w-10 h-10 rounded-full bg-black bg-opacity-10 hover:bg-opacity-20 flex items-center justify-center transition-all duration-300"
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