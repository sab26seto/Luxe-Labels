import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface ItemBreakdown extends CartItem {
  totalPrice: number;
  discounted: boolean;
  discountDetails?: {
    regularCount: number;
    discountedCount: number;
    regularPrice: number;
    discountedPrice: number;
  } | null;
}

interface CheckoutProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: number, quantity: number) => void;
  onRemoveItem: (id: number) => void;
  onClearCart: () => void;
}

const Checkout: React.FC<CheckoutProps> = ({ isOpen, onClose, items, onUpdateQuantity, onRemoveItem, onClearCart }) => {
  const [promoApplied, setPromoApplied] = useState(false);
  const [step, setStep] = useState<'receipt' | 'payment' | 'loading' | 'success'>('receipt');
  const [formData, setFormData] = useState({
    email: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    name: ''
  });
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});
  const [loadingTimeout, setLoadingTimeout] = useState<NodeJS.Timeout | null>(null);

  // Reset step to 'receipt' whenever the modal is opened
  useEffect(() => {
    if (isOpen) {
      setStep('receipt');
      setPromoApplied(false);
      setFormData({
        email: '',
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        name: ''
      });
      setFormErrors({});
    }
  }, [isOpen]);

  // Calculate total items and check if promo is eligible
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const isPromoEligible = totalItems >= 4;

  // Calculate discount logic
  const { subtotal, discount, finalTotal, discountDetails, itemBreakdown } = useMemo(() => {
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    if (!isPromoEligible || !promoApplied) {
      return { 
        subtotal, 
        discount: 0, 
        finalTotal: subtotal, 
        discountDetails: null,
        itemBreakdown: items.map(item => ({
          ...item,
          totalPrice: item.price * item.quantity,
          discounted: false
        }))
      };
    }

    // Create a flat list of all items with their individual prices
    const allItems: Array<{ id: number; name: string; price: number; originalIndex: number }> = [];
    items.forEach((item, index) => {
      for (let i = 0; i < item.quantity; i++) {
        allItems.push({
          id: item.id,
          name: item.name,
          price: item.price,
          originalIndex: index
        });
      }
    });

    // Sort by price (highest to lowest)
    const sortedItems = [...allItems].sort((a, b) => b.price - a.price);
    
    // Take the 4 most expensive and 1 cheapest for discount
    const mostExpensive4 = sortedItems.slice(0, 4);
    const cheapest5th = sortedItems.slice(4, 5)[0];
    
    if (!cheapest5th) {
      return { 
        subtotal, 
        discount: 0, 
        finalTotal: subtotal, 
        discountDetails: null,
        itemBreakdown: items.map(item => ({
          ...item,
          totalPrice: item.price * item.quantity,
          discounted: false
        }))
      };
    }

    const discount = cheapest5th.price * 0.03; // 3% off
    const finalTotal = subtotal - discount;

    // Create item breakdown with discount info
    const itemBreakdown: ItemBreakdown[] = items.map(item => {
      const itemInstances = allItems.filter(instance => instance.id === item.id);
      const discountedInstances = itemInstances.filter(instance => 
        instance.name === cheapest5th.name && 
        sortedItems.indexOf(instance) >= 4
      );
      
      const regularInstances = itemInstances.length - discountedInstances.length;
      const discountedPrice = item.price * 0.97;
      
      return {
        ...item,
        totalPrice: (item.price * regularInstances) + (discountedPrice * discountedInstances.length),
        discounted: discountedInstances.length > 0,
        discountDetails: discountedInstances.length > 0 ? {
          regularCount: regularInstances,
          discountedCount: discountedInstances.length,
          regularPrice: item.price,
          discountedPrice: discountedPrice
        } : null
      };
    });

    return {
      subtotal,
      discount,
      finalTotal,
      discountDetails: {
        discountedItem: cheapest5th.name,
        originalPrice: cheapest5th.price,
        discountedPrice: cheapest5th.price * 0.97
      },
      itemBreakdown
    };
  }, [items, isPromoEligible, promoApplied]);

  const handleProceedToPayment = () => {
    setStep('payment');
  };

  const handleBackToReceipt = () => {
    setStep('receipt');
  };

  const validateForm = () => {
    const errors: {[key: string]: string} = {};
    
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!formData.cardNumber || !/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ''))) {
      errors.cardNumber = 'Please enter a valid 16-digit card number';
    }
    
    if (!formData.expiryDate || !/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
      errors.expiryDate = 'Please enter expiry date (MM/YY)';
    }
    
    if (!formData.cvv || !/^\d{3,4}$/.test(formData.cvv)) {
      errors.cvv = 'Please enter a valid CVV';
    }
    
    if (!formData.name.trim()) {
      errors.name = 'Please enter your name';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Wrap onClose to clear cart only if on success page
  const handleClose = () => {
    if (step === 'success') {
      onClearCart();
    }
    onClose();
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setStep('loading');
      // Randomize loading duration between 1.5s and 2.8s
      const delay = 1500 + Math.random() * 1300;
      const timeout = setTimeout(() => {
        setStep('success');
      }, delay);
      setLoadingTimeout(timeout);
    }
  };

  // Clean up timeout if modal closes early
  useEffect(() => {
    return () => {
      if (loadingTimeout) clearTimeout(loadingTimeout);
    };
  }, [loadingTimeout]);

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

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
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-md z-40"
            onClick={handleClose}
          />
          
          {/* Checkout Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="fixed inset-4 z-50 flex items-center justify-center"
            onClick={handleClose}
          >
            <div 
              className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden relative flex"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Main Content (left) */}
              <div className="flex-1 flex flex-col">
                {/* Header */}
                <motion.div 
                  className="flex items-center justify-between p-8 border-b border-offwhite bg-gradient-to-r from-gold/5 to-yellow-400/5"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.4, ease: 'easeInOut' }}
                >
                  <div className="flex items-center gap-4">
                    <motion.button
                      onClick={step === 'payment' ? handleBackToReceipt : handleClose}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="w-10 h-10 rounded-full bg-black bg-opacity-10 hover:bg-opacity-20 flex items-center justify-center transition-all duration-300"
                    >
                      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-black">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </motion.button>
                    <div>
                      <h2 className="text-2xl font-medium text-black tracking-tight">
                        {step === 'receipt' && 'Order Receipt'}
                        {step === 'payment' && 'Payment Information'}
                        {step === 'success' && 'Order Confirmed'}
                      </h2>
                      <p className="text-sm text-darkgray opacity-70">
                        {step === 'receipt' && `${totalItems} items in your order`}
                        {step === 'payment' && 'Secure payment processing'}
                        {step === 'success' && 'Thank you for your purchase'}
                      </p>
                    </div>
                  </div>
                  <motion.button
                    onClick={handleClose}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-10 h-10 rounded-full bg-black bg-opacity-10 hover:bg-opacity-20 flex items-center justify-center transition-all duration-300"
                  >
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-black">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </motion.button>
                </motion.div>

                {/* Content */}
                <div className="flex-1 flex flex-col lg:flex-row h-[calc(90vh-120px)]">
                  {/* Receipt Section */}
                  {step === 'receipt' && (
                    <motion.div 
                      className="lg:w-2/3 p-8 overflow-y-auto"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2, duration: 0.5, ease: 'easeInOut' }}
                    >
                      {items.length === 0 ? (
                        <motion.div 
                          className="flex flex-col items-center justify-center h-full text-center"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.3, duration: 0.4, ease: 'easeInOut' }}
                        >
                          <div className="w-20 h-20 rounded-full bg-offwhite flex items-center justify-center mb-6">
                            <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-darkgray">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m13-9l2 9m-5-9V6a2 2 0 10-4 0v7" />
                            </svg>
                          </div>
                          <p className="text-xl font-medium text-darkgray mb-2">Your cart is empty</p>
                          <p className="text-sm text-darkgray opacity-60">Add some luxury to your collection</p>
                        </motion.div>
                      ) : (
                        <div className="space-y-4">
                          <div className="text-center mb-8">
                            <h3 className="text-2xl font-bold text-black mb-2">LUXE LABELS</h3>
                            <p className="text-sm text-darkgray">Order Receipt</p>
                            <p className="text-xs text-darkgray mt-1">{new Date().toLocaleDateString()}</p>
                          </div>
                          
                          {itemBreakdown.map((item, index) => (
                            <motion.div
                              key={item.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.1 * index, duration: 0.4, ease: 'easeInOut' }}
                              className="flex items-center justify-between p-4 border-b border-offwhite"
                            >
                              <div className="flex items-center gap-4 flex-1">
                                <div className="w-12 h-12 rounded-lg overflow-hidden bg-white flex-shrink-0">
                                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                </div>
                                <div>
                                  <h4 className="font-medium text-black">{item.name}</h4>
                                  <p className="text-sm text-darkgray">Qty: {item.quantity}</p>
                                  {item.discounted && 'discountDetails' in item && item.discountDetails && (
                                    <p className="text-xs text-green-600 font-medium">
                                      {item.discountDetails.discountedCount} item(s) discounted
                                    </p>
                                  )}
                                </div>
                              </div>
                              <div className="text-right">
                                {item.discounted && 'discountDetails' in item && item.discountDetails ? (
                                  <div>
                                    <div className="text-sm text-gray-400 line-through">
                                      ${(item.discountDetails.regularPrice * item.quantity).toFixed(2)}
                                    </div>
                                    <div className="text-lg font-medium text-black">
                                      ${item.totalPrice.toFixed(2)}
                                    </div>
                                    <div className="text-xs text-green-600">
                                      Save ${((item.discountDetails.regularPrice * item.discountDetails.discountedCount) - (item.discountDetails.discountedPrice * item.discountDetails.discountedCount)).toFixed(2)}
                                    </div>
                                  </div>
                                ) : (
                                  <div className="text-lg font-medium text-black">
                                    ${item.totalPrice.toFixed(2)}
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  )}
                  {/* Payment Section */}
                  {step === 'payment' && (
                    <motion.div 
                      className="lg:w-2/3 p-8 overflow-y-auto"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2, duration: 0.5, ease: 'easeInOut' }}
                    >
                      <form onSubmit={handlePaymentSubmit} className="space-y-6">
                        <div>
                          <label className="block text-sm font-medium text-black mb-2">Email Address</label>
                          <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            className={`w-full px-4 py-3 rounded-xl border transition-all duration-300 ${
                              formErrors.email ? 'border-red-500' : 'border-offwhite focus:border-gold'
                            }`}
                            placeholder="your@email.com"
                          />
                          {formErrors.email && <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-black mb-2">Card Number</label>
                          <input
                            type="text"
                            value={formData.cardNumber}
                            onChange={(e) => setFormData({...formData, cardNumber: formatCardNumber(e.target.value)})}
                            className={`w-full px-4 py-3 rounded-xl border transition-all duration-300 ${
                              formErrors.cardNumber ? 'border-red-500' : 'border-offwhite focus:border-gold'
                            }`}
                            placeholder="1234 5678 9012 3456"
                            maxLength={19}
                          />
                          {formErrors.cardNumber && <p className="text-red-500 text-sm mt-1">{formErrors.cardNumber}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-black mb-2">Expiry Date</label>
                            <input
                              type="text"
                              value={formData.expiryDate}
                              onChange={(e) => setFormData({...formData, expiryDate: formatExpiryDate(e.target.value)})}
                              className={`w-full px-4 py-3 rounded-xl border transition-all duration-300 ${
                                formErrors.expiryDate ? 'border-red-500' : 'border-offwhite focus:border-gold'
                              }`}
                              placeholder="MM/YY"
                              maxLength={5}
                            />
                            {formErrors.expiryDate && <p className="text-red-500 text-sm mt-1">{formErrors.expiryDate}</p>}
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-black mb-2">CVV</label>
                            <input
                              type="text"
                              value={formData.cvv}
                              onChange={(e) => setFormData({...formData, cvv: e.target.value.replace(/\D/g, '')})}
                              className={`w-full px-4 py-3 rounded-xl border transition-all duration-300 ${
                                formErrors.cvv ? 'border-red-500' : 'border-offwhite focus:border-gold'
                              }`}
                              placeholder="123"
                              maxLength={4}
                            />
                            {formErrors.cvv && <p className="text-red-500 text-sm mt-1">{formErrors.cvv}</p>}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-black mb-2">Cardholder Name</label>
                          <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            className={`w-full px-4 py-3 rounded-xl border transition-all duration-300 ${
                              formErrors.name ? 'border-red-500' : 'border-offwhite focus:border-gold'
                            }`}
                            placeholder="John Doe"
                          />
                          {formErrors.name && <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>}
                        </div>
                      </form>
                    </motion.div>
                  )}
                  {/* Loading Section */}
                  {step === 'loading' && (
                    <motion.div
                      className="flex-1 p-8 flex flex-col items-center justify-center text-center bg-offwhite"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2, duration: 0.5, ease: 'easeInOut' }}
                    >
                      <div className="mb-8 flex flex-col items-center">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 1.1, ease: 'linear' }}
                          className="w-16 h-16 rounded-full border-4 border-gold border-t-transparent border-b-transparent mb-6"
                          style={{ borderLeftColor: '#fbbf24', borderRightColor: '#fbbf24' }}
                        />
                        <h3 className="text-xl font-semibold text-black mb-2">Processing payment…</h3>
                        <p className="text-darkgray text-sm">Please wait while we confirm your order.</p>
                      </div>
                    </motion.div>
                  )}
                  {/* Success Section */}
                  {step === 'success' && (
                    <motion.div 
                      className="flex-1 p-8 flex flex-col items-center justify-center text-center bg-offwhite"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2, duration: 0.5, ease: 'easeInOut' }}
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.4, duration: 0.6, ease: 'easeOut' }}
                        className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center mb-6"
                      >
                        <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-white">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </motion.div>
                      <h3 className="text-2xl font-bold text-black mb-4">Payment Successful!</h3>
                      <p className="text-darkgray mb-6">
                        Thank you for your purchase. Please check your inbox for a copy of your order and tracking information.<br />
                        <span className="block mt-2">Next steps: Follow the link in your email to enter your shipping information and complete your order.</span>
                      </p>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleClose}
                        className="px-8 py-3 bg-gold text-black font-medium rounded-xl hover:bg-yellow-400 transition-all duration-300"
                      >
                        Continue Shopping
                      </motion.button>
                    </motion.div>
                  )}
                </div>
              </div>
              {/* Sidebar (right) - Only show if not success */}
              {step !== 'success' && (
                <motion.div 
                  className="lg:w-1/3 p-8 bg-gradient-to-br from-gold/5 to-yellow-400/5 border-l border-offwhite"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.5, ease: 'easeInOut' }}
                >
                  {/* Promotional Offer Toggle */}
                  {isPromoEligible && step === 'receipt' && (
                    <motion.div 
                      className="mb-8 p-6 bg-gradient-to-r from-gold/20 to-yellow-400/20 rounded-2xl border border-gold/30"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4, duration: 0.4, ease: 'easeInOut' }}
                    >
                      <div className="text-center">
                        <h3 className="text-lg font-medium text-black mb-2">Exclusive Offer</h3>
                        <p className="text-sm text-darkgray mb-4">Get 3% off your 5th sticker!</p>
                        <div className="flex items-center justify-center">
                          <button
                            onClick={() => setPromoApplied(!promoApplied)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
                              promoApplied ? 'bg-gold' : 'bg-gray-300'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                                promoApplied ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                          <span className="ml-3 text-sm font-medium text-black">
                            {promoApplied ? 'Applied' : 'Apply'}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Order Summary */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-medium text-black mb-4">Order Summary</h3>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-darkgray">Subtotal</span>
                        <span className="text-sm text-black">${subtotal.toFixed(2)}</span>
                      </div>
                      
                      {promoApplied && discount > 0 && (
                        <>
                          <div className="flex justify-between items-center text-green-600">
                            <span className="text-sm font-medium">Promo Discount</span>
                            <span className="text-sm font-medium">-${discount.toFixed(2)}</span>
                          </div>
                          {discountDetails && (
                            <div className="text-xs text-darkgray bg-green-50 p-3 rounded-lg">
                              <span className="font-medium">Discounted:</span> {discountDetails.discountedItem} 
                              <br />
                              <span className="text-green-600">
                                ${discountDetails.originalPrice.toFixed(2)} → ${discountDetails.discountedPrice.toFixed(2)}
                              </span>
                            </div>
                          )}
                        </>
                      )}
                      
                      <div className="border-t border-offwhite pt-3">
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-medium text-black">Total</span>
                          <span className="text-2xl font-bold text-black">${finalTotal.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    {items.length > 0 && step === 'receipt' && (
                      <motion.button
                        whileHover={{ scale: 1.02, backgroundColor: '#fbbf24', color: '#000' }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleProceedToPayment}
                        className="w-full py-4 bg-black text-white font-medium text-base tracking-wide rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl mt-6"
                      >
                        Proceed to Payment
                      </motion.button>
                    )}

                    {step === 'payment' && (
                      <motion.button
                        whileHover={{ scale: 1.02, backgroundColor: '#fbbf24', color: '#000' }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handlePaymentSubmit}
                        className="w-full py-4 bg-black text-white font-medium text-base tracking-wide rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl mt-6"
                      >
                        Complete Payment
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Checkout; 