import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface ProductCardProps {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  onClick: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ name, price, image, category, onClick }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const isLittleDog = category === "Little Dog";

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (cardRef.current && isHovered) {
        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setMousePosition({ x, y });
      }
    };

    if (isHovered) {
      document.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isHovered]);

  return (
    <motion.div
      ref={cardRef}
      whileHover={{ 
        scale: isLittleDog ? 1.05 : 1.02, 
        boxShadow: isLittleDog 
          ? '0 20px 60px 0 rgba(251,191,36,0.3), 0 0 40px rgba(251,191,36,0.2)' 
          : '0 8px 32px 0 rgba(251,191,36,0.15)' 
      }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: 'easeInOut' }}
      className={`relative rounded-2xl overflow-hidden cursor-pointer flex flex-col items-center p-6 transition-all duration-300 ${
        isLittleDog 
          ? 'bg-white/80 backdrop-blur-lg border border-gold/30 shadow-xl' 
          : 'bg-white shadow-sm border border-gray-100 hover:border-gold'
      }`}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: isLittleDog 
          ? 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(251,191,36,0.1) 100%)' 
          : undefined
      }}
    >
      {/* Golden Badge for Little Dog */}
      {isLittleDog && (
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, duration: 0.6, ease: 'easeOut' }}
          className="absolute top-3 right-3 z-10"
        >
          <div className="bg-gradient-to-r from-gold via-yellow-400 to-gold text-black text-xs font-bold px-3 py-1 rounded-full shadow-lg border border-yellow-300">
            LIMITED
          </div>
        </motion.div>
      )}

      {/* Mouse-follow glare effect for Little Dog */}
      {isLittleDog && isHovered && (
        <motion.div
          className="absolute inset-0 pointer-events-none z-5"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(251,191,36,0.3) 0%, transparent 50%)`,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        />
      )}

      <div className={`w-36 h-36 mb-4 flex items-center justify-center overflow-hidden rounded-xl ${
        isLittleDog ? 'bg-gradient-to-br from-gold/10 to-yellow-400/10' : 'bg-offwhite'
      }`}>
        <motion.img
          src={image}
          alt={name}
          className={`object-cover w-full h-full ${
            isLittleDog ? 'filter drop-shadow-lg' : ''
          }`}
          whileHover={{ scale: isLittleDog ? 1.08 : 1.05 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          style={{
            filter: isLittleDog ? 'drop-shadow(0 4px 8px rgba(251,191,36,0.3))' : undefined
          }}
        />
      </div>
      
      <div className="text-base font-medium text-black mb-1">{name}</div>
      <div className={`text-sm ${
        isLittleDog ? 'text-gold font-semibold' : 'text-darkgray opacity-70'
      }`}>
        ${price}
      </div>

      {/* Additional luxury indicator for Little Dog */}
      {isLittleDog && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-2 text-xs text-gold/80 font-medium"
        >
          ✨ Premium Collection
        </motion.div>
      )}
    </motion.div>
  );
};

export default ProductCard; 