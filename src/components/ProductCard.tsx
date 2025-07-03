import React from 'react';
import { motion } from 'framer-motion';

interface ProductCardProps {
  id: number;
  name: string;
  price: number;
  image: string;
  onClick: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ name, price, image, onClick }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02, boxShadow: '0 8px 32px 0 rgba(251,191,36,0.15)' }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: 'easeInOut' }}
      className="bg-white rounded-2xl shadow-sm overflow-hidden cursor-pointer flex flex-col items-center p-6 transition-all duration-300 border border-gray-100 hover:border-gold"
      onClick={onClick}
    >
      <div className="w-36 h-36 mb-4 flex items-center justify-center overflow-hidden rounded-xl bg-offwhite">
        <motion.img
          src={image}
          alt={name}
          className="object-cover w-full h-full"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
        />
      </div>
      <div className="text-base font-medium text-black mb-1">{name}</div>
      <div className="text-sm text-darkgray opacity-70">${price}</div>
    </motion.div>
  );
};

export default ProductCard; 