import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const testimonials = [
  { name: "Alex", text: "The only stickers I'll ever put on my laptop. Luxe Labels is a vibe.", rating: 5 },
  { name: "Maya", text: "I bought the Golden Dog and it feels like art. The packaging alone is worth it.", rating: 5 },
  { name: "Eli", text: "Mysterious, rare, and so clean. I get compliments every day.", rating: 5 },
  { name: "Sabrina", text: "The creators are legends. These stickers are pure gold.", rating: 5 },
  { name: "Sam", text: "Never thought a sticker could feel this exclusive.", rating: 5 },
  { name: "Jules", text: "The story behind Luxe Labels? Gave me chills.", rating: 5 },
  { name: "Noah", text: "Minimal, mysterious, and the best quality I've seen.", rating: 5 },
];

const creators = [
  {
    name: "Chafic",
    role: "Co-Founder & Visionary",
    line: "Turning pain into beauty, and beauty into something you can hold."
  },
  {
    name: "Sabrina",
    role: "Co-Founder & Curator",
    line: "Every sticker is a story. Every story deserves a little gold."
  },
];

const Navbar: React.FC = () => (
  <motion.nav
    initial={{ y: -40, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ duration: 0.7, ease: 'easeInOut' }}
    className="fixed top-0 left-0 w-full z-30 flex items-center justify-between px-8 py-4 h-[72px] bg-white/80 backdrop-blur-lg shadow-sm"
  >
    <div className="flex items-center gap-2">
      <Link to="/" className="text-xl font-sans font-bold tracking-wide text-black rounded-lg px-4 py-2 hover:bg-gold hover:text-black transition-colors duration-200">Luxe Labels</Link>
      <Link to="/about" className="text-black text-base font-medium rounded-full px-6 py-2 hover:bg-gold hover:text-black transition-colors duration-200">About</Link>
    </div>
  </motion.nav>
);

const AboutPage: React.FC = () => {
  // Review form state
  const [name, setName] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const[hover, setHover] = useState(0);
  const [submitted, setSubmitted] = useState(false);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newReview = { name, rating, comment };
    setSubmitted(true);
    setName('');
    setRating(5);
    setComment('');
  };

  return (
    <div className="min-h-screen bg-offwhite flex flex-col items-center justify-start pt-32 px-4 overflow-x-hidden">
      <Navbar />

      {/* Backstory Section */}
      <motion.section
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: 'easeInOut' }}
        className="w-full max-w-3xl mx-auto mb-24 flex flex-col items-center"
      >
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8, ease: 'easeInOut' }}
          className="font-sans text-4xl font-bold text-black mb-8 tracking-tight"
          style={{ letterSpacing: '0.2em' }}
        >
          Luxe Labels
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1, ease: 'easeInOut' }}
          className="text-center text-lg text-black font-light leading-relaxed max-w-xl mx-auto mb-8"
        >
          <div className="mb-6">
            we have been lost before<br />
            and we will be found<br />
            again.
          </div>
          <div className="text-base text-darkgray mb-4">
            Our stickers are a product of despair, hope, and a little bit of gold. We are Luxe Labels, a brand born from the ashes of our past, where each sticker is a piece of our journey. 
            Every label is handcrafted using prime materials, designed to be more than just a sticker, but a symbol of our story and yours. Every year, one more collection is added to our legacy, each one a testament to our growth and resilience.
            <br /><br />
            Each sticker is a chapter in our story. Each one a mark of pain, hope, or rebellion. Every label is a piece of us, and maybe you. - Luxe Labels {"<"}3
          </div>
        </motion.div>
      </motion.section>

      {/* Infinite Marquee Testimonials */}
      <motion.section
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 1, ease: 'easeInOut' }}
        className="w-full mb-24 flex flex-col items-center"
      >
        <div className="relative w-full overflow-x-hidden py-6">
          <motion.div
            className="flex w-max animate-marquee gap-24"
            initial={{ x: 0 }}
            animate={{ x: [0, -1200, 0] }}
            transition={{ repeat: Infinity, duration: 40, ease: 'linear' }}
          >
            {testimonials.concat(testimonials).map((t, i) => (
              <motion.div
                key={i}
                className="flex items-center gap-4 px-8"
                whileHover={{ scale: 1.08 }}
              >
                <span className="text-gold text-xl">{'★'.repeat(t.rating)}</span>
                <span className="text-black text-lg font-medium">“{t.text}”</span>
                <span className="text-darkgray text-base font-light">{t.name}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
        <style>{`
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-marquee {
            animation: marquee 40s linear infinite;
          }
        `}</style>
      </motion.section>

      {/* Creators */}
      <motion.section
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 1, ease: 'easeInOut' }}
        className="w-full max-w-4xl mx-auto mb-20 flex flex-col md:flex-row gap-16 items-center justify-center"
      >
        {creators.map((c, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + i * 0.2, duration: 0.8, ease: 'easeInOut' }}
            className="flex flex-col items-center"
          >
            <span className="text-3xl font-bold text-gold mb-2 hover:text-black transition-colors duration-300 cursor-pointer">{c.name}</span>
            <span className="text-black text-base font-medium mb-1">{c.role}</span>
            <span className="text-darkgray text-base font-light italic max-w-xs text-center">{c.line}</span>
          </motion.div>
        ))}
      </motion.section>

      {/* Review Section */}
      <motion.section
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 1, ease: 'easeInOut' }}
        className="w-full max-w-3xl mx-auto mb-24 flex flex-col items-center"
      >
        <h2 className="text-2xl font-bold text-black mb-6">Share Your Thoughts</h2>
        {submitted ? (
  <div className="text-center text-lg text-gold font-medium">
    Your feedback is greatly appreciated! Thank you for your review.
  </div>
      ) : (
        <form onSubmit={handleSubmit} className="w-full max-w-md flex flex-col gap-4">
          <input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
            required
          />
          <div className="flex items-center space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
                className="focus:outline-none"
              >
                <span
                  className={`text-3xl ${
                    (hover || rating) >= star ? 'text-gold' : 'text-gray-300'
                  }`}
                >
                  ★
                </span>
              </button>
            ))}
          </div>
          <textarea
            placeholder="Your Review"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold h-32 resize-none"
            required
          />
          <button
            type="submit"
            className="bg-gold text-black font-medium py-3 rounded-lg hover:bg-yellow-400 transition-colors duration-200"
          >
            Submit Review
          </button>
        </form>
      )}

      </motion.section>
    </div>
  );
};

export default AboutPage;
