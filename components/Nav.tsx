'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '@/hooks/useTranslation';
import LanguageSelector from '@/components/LanguageSelector';

export default function Nav() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/programs', label: t('navigation.programs') },
    { href: '/candidates', label: t('navigation.candidates') },
    { href: '/clients', label: t('navigation.forEmployers') },
    { href: '/about', label: t('navigation.about') },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-white/98 backdrop-blur-xl shadow-soft border-b border-gray-100'
          : 'bg-transparent'
      }`}
    >
      <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-16">
        <div className="flex items-center justify-between h-24 w-full">
          {/* Logo */}
          <Link href="/" className="flex items-center group flex-shrink-0">
            <span className={`text-2xl md:text-3xl font-serif font-bold transition-all duration-300 group-hover:scale-105 ${
              isScrolled ? 'text-primary' : 'text-white drop-shadow-lg'
            }`}>
              Skills for Life
            </span>
          </Link>

          {/* Desktop Navigation - Spread Out */}
          <div className="hidden md:flex items-center justify-end flex-1 gap-6 lg:gap-8 xl:gap-10 ms-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-4 py-2 text-sm font-semibold transition-all duration-300 rounded-lg group whitespace-nowrap ${
                  isScrolled 
                    ? 'text-dark hover:text-primary' 
                    : 'text-white/90 hover:text-white'
                }`}
              >
                <span className="relative z-10">{link.label}</span>
                <span className={`absolute inset-0 rounded-lg transition-all duration-300 ${
                  isScrolled 
                    ? 'bg-accent/10 opacity-0 group-hover:opacity-100' 
                    : 'bg-white/10 opacity-0 group-hover:opacity-100'
                }`}></span>
              </Link>
            ))}
            
            {/* Language Selector */}
            <LanguageSelector variant={isScrolled ? 'dark' : 'light'} />
            
            <Link
              href="/clients"
              className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all duration-300 hover:scale-105 hover:shadow-lg whitespace-nowrap ${
                isScrolled
                  ? 'gradient-primary text-white shadow-medium'
                  : 'gradient-accent text-dark shadow-strong'
              }`}
            >
              {t('navigation.forEmployers')}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden p-2.5 rounded-lg transition-all duration-300 ${
              isScrolled 
                ? 'text-dark hover:bg-gray-100' 
                : 'text-white hover:bg-white/10'
            }`}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white/98 backdrop-blur-xl border-t border-gray-100 shadow-soft"
          >
            <div className="px-4 py-6 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-3 text-dark font-semibold rounded-lg hover:bg-accent/10 hover:text-primary transition-all duration-200"
                >
                  {link.label}
                </Link>
              ))}
              
              {/* Mobile Language Selector */}
              <div className="px-4 py-3">
                <LanguageSelector variant="dark" />
              </div>
              
              <Link
                href="/clients"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-6 py-3 gradient-primary text-white rounded-full text-center font-bold shadow-medium mt-4"
              >
                {t('navigation.forEmployers')}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
