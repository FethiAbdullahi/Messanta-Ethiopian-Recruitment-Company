'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // Show button when page is scrolled down 300px
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          transition={{ duration: 0.3 }}
          onClick={scrollToTop}
          className="group fixed bottom-24 end-6 z-40 flex h-14 w-14 items-center justify-center rounded-full gradient-accent shadow-strong transition-all duration-300 hover:scale-110 hover:shadow-xl active:scale-95 md:bottom-28 md:end-8"
          aria-label="Scroll to top"
        >
          <ArrowUp 
            className="text-white w-6 h-6 group-hover:-translate-y-1 transition-transform duration-300" 
            strokeWidth={2.5}
          />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

