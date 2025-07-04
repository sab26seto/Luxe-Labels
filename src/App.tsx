import React, { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import './index.css';
import ProductCard from './components/ProductCard';
import ProductModal from './components/ProductModal';
import Cart from './components/Cart';
import { products } from './products.js';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import AboutPage from './components/AboutPage';

const NAVBAR_HEIGHT = 72;

const Navbar: React.FC<{ onCartClick: () => void; cartItemCount: number; showPromo: boolean }> = ({ onCartClick, cartItemCount, showPromo }) => {
  const [scrolled, setScrolled] = React.useState(false);
  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <motion.nav
      initial={{ backgroundColor: 'rgba(255,255,255,0.8)' }}
      animate={{  top: showPromo ? '3rem' : '0rem', backgroundColor: scrolled ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.8)' }}
      transition={{ duration: 0.4, ease: 'easeInOut' }}
      className={`fixed ${showPromo ? 'top-12' : 'top-0'} left-0 w-full z-30 flex items-center justify-between px-8 py-4 h-[${NAVBAR_HEIGHT}px]`}
      style={{ backdropFilter: scrolled ? 'blur(12px)' : 'blur(8px)' }}
    >
      <div className="flex items-center gap-2">
        <Link to="/" className="text-xl font-sans font-bold tracking-wide text-black rounded-lg px-4 py-2 hover:bg-gold hover:text-black transition-colors duration-200">Luxe Labels</Link>
        <Link to="/about" className="text-black text-base font-medium rounded-full px-6 py-2 hover:bg-gold hover:text-black transition-colors duration-200">About</Link>
      </div>
      <div className="flex items-center gap-4">
        <button
          aria-label="Cart"
          onClick={onCartClick}
          className="relative flex items-center justify-center"
        >
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-black">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m13-9l2 9m-5-9V6a2 2 0 10-4 0v7" />
          </svg>
          {cartItemCount > 0 && (
            <span className="absolute -top-2 -right-2 z-10 w-5 h-5 bg-gold text-black rounded-full flex items-center justify-center text-xs font-semibold shadow-md border-2 border-white">
              {cartItemCount}
            </span>
          )}
        </button>
      </div>
    </motion.nav>
  );
};


const Hero: React.FC<{ onShopClick: () => void }> = ({ onShopClick }) => {
  return (
    <section className="relative min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-white via-cream to-offwhite overflow-hidden">
      <motion.div
        initial={{ scale: 1 }}
        animate={{ scale: 1.02 }}
        transition={{ duration: 15, ease: 'easeInOut', repeat: Infinity, repeatType: 'reverse' }}
        className="absolute inset-0 z-0"
        style={{ background: 'radial-gradient(ellipse at 50% 50%, #fde68a 0%, #f8f6f0 40%, #ffffff 100%)' }}
      />
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
          className="font-medium text-4xl md:text-6xl text-black mb-6 tracking-tight"
        >
          Art You Can Stick To
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 1, ease: 'easeInOut' }}
          className="text-base md:text-xl text-darkgray mb-12 font-light"
        >
          Handcrafted. Limited. Iconic.
        </motion.p>
        <div className="flex flex-col items-center gap-3 mt-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onShopClick}
            className="px-8 py-4 rounded-2xl bg-gold text-black font-medium text-base tracking-wide shadow-lg transition-all duration-300 hover:bg-black hover:text-gold hover:shadow-xl"
          >
            Shop Collection
          </motion.button>
          <motion.div
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: 1, y: 6 }}
            transition={{ delay: 1.2, duration: 1.2, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
          >
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-black">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
            </svg>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const App: React.FC = () => {
  const marketplaceRef = useRef<HTMLDivElement>(null);
  
  const [showPromo, setShowPromo] = useState(true);

  const [activeCategory, setActiveCategory] = useState<string>("All");

const filteredStickers = activeCategory === "All"
  ? products
  : products.filter(products => products.category === activeCategory);

  // State management
  const [selectedProduct, setSelectedProduct] = React.useState<number | null>(null);
  const [isCartOpen, setIsCartOpen] = React.useState(false);
  const [cartItems, setCartItems] = React.useState<Array<{
    id: number;
    name: string;
    price: number;
    image: string;
    quantity: number;
  }>>([]);

  const handleShopClick = () => {
    marketplaceRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleCartClick = () => {
    setIsCartOpen(true);
  };

  const handleAddToCart = (product: any) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setSelectedProduct(null); // Close modal after adding
  };

  const handleUpdateQuantity = (id: number, quantity: number) => {
    if (quantity === 0) {
      setCartItems(prev => prev.filter(item => item.id !== id));
    } else {
      setCartItems(prev => prev.map(item => 
        item.id === id ? { ...item, quantity } : item
      ));
    }
  };

  const handleRemoveItem = (id: number) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };
  return (
    <Router>
      <Routes>
        <Route path="/about" element={<AboutPage />} />
        <Route path="/" element={
          <div className="min-h-screen bg-offwhite font-sans">
            
            <AnimatePresence>
              {showPromo && (
                <motion.div
                  initial={{ y: -100, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -100, opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="fixed top-0 left-0 w-full z-50 bg-gold text-black text-sm md:text-base font-medium py-4 px-6 flex items-center justify-between shadow-md"
                >
                  <span>Exclusive Offer: Get <strong>3% </strong>off the 5th sticker with the purchase of 4 stickers!</span>
                  <button
                    onClick={() => setShowPromo(false)}
                    className="ml-4 text-black hover:text-gray-800 focus:outline-none"
                    aria-label="Close promotion banner"  
                  >
                      ✕
                    </button>
                </motion.div>
              )}
            </AnimatePresence>
            

            <Navbar onCartClick={handleCartClick} cartItemCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)} showPromo={showPromo} />
            <main className="pt-[120px]">
              <Hero onShopClick={handleShopClick} />
              <div ref={marketplaceRef} className="min-h-[80vh] flex flex-col items-center justify-center w-full px-4 py-20">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: 'easeInOut' }}
                  className="text-center mb-16"
                >
                  <h2 className="text-3xl md:text-4xl font-medium text-black mb-4 tracking-tight">Our Collection</h2>
                  <p className="text-base text-darkgray opacity-70 font-light">Exclusive handcrafted luxury collections for the modern collector</p>
                </motion.div>
                <div className="flex gap-4 mb-6">
                  {["All", "Little Dog", "Minecraft", "Pepe"].map((category) => (
                    <button
                      key={category}
                      onClick={() => setActiveCategory(category)}
                      className={`px-4 py-2 rounded-full border transition-all duration-300 relative ${
                        activeCategory === category
                          ? category === "Little Dog"
                            ? "bg-gradient-to-r from-gold via-yellow-400 to-gold text-black border-gold shadow-lg shadow-gold/30 font-medium"
                            : "bg-black text-white"
                          : category === "Little Dog"
                            ? "bg-gradient-to-r from-gold/20 via-yellow-400/20 to-gold/20 text-black border-gold/50 hover:from-gold/30 hover:via-yellow-400/30 hover:to-gold/30"
                            : "bg-white text-black border-gray-300"
                      }`}
                    >
                      {category}
                      {category === "Little Dog" && (
                        <motion.div
                          animate={{ scale: [1, 1.18, 1], rotate: [-12, 12, -12] }}
                          transition={{ duration: 999, repeat: Infinity, ease: 'easeInOut' }}
                          className={`absolute -top-1 -right-1 text-xs font-bold ${activeCategory === "Little Dog" ? 'text-black' : 'text-gold'}`}
                          style={{ display: 'inline-block' }}
                        >
                          LIMITED
                        </motion.div>
                      )}
                    </button>
                  ))}
                </div>


                <motion.div
                  className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 w-full max-w-6xl"
                  initial="hidden"
                  animate="visible"
                  variants={{
                    visible: { transition: { staggerChildren: 0.13 } },
                    hidden: {},
                  }}
                >
                  {filteredStickers.map((product) => (
                    <ProductCard
                      key={product.id}
                      {...product}
                      onClick={() => setSelectedProduct(product.id)}
                    />
                  ))}
                </motion.div>
              </div>
            </main>
            
            {/* Product Modal */}
            <ProductModal
              product={selectedProduct ? products.find(p => p.id === selectedProduct) || null : null}
              isOpen={!!selectedProduct}
              onClose={() => setSelectedProduct(null)}
              onAddToCart={handleAddToCart}
            />
            
            {/* Cart Sidebar */}
            <Cart
              isOpen={isCartOpen}
              onClose={() => setIsCartOpen(false)}
              items={cartItems}
              onUpdateQuantity={handleUpdateQuantity}
              onRemoveItem={handleRemoveItem}
            />
          </div>
        } />
      </Routes>
    </Router>
  );
};

export default App;
