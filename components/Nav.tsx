'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { User } from '@supabase/supabase-js';
import { createClient, hasBrowserSupabaseConfig } from '@/lib/supabase/client';
import { useTranslation } from '@/hooks/useTranslation';
import LanguageSelector from '@/components/LanguageSelector';

export default function Nav() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [showAdminLink, setShowAdminLink] = useState(false);
  const [showDeskLink, setShowDeskLink] = useState(false);
  const { t } = useTranslation();
  const supabaseAuthEnabled = hasBrowserSupabaseConfig();

  /** Home hero uses light text on imagery; other pages need readable nav from first paint */
  const isHomeHero = pathname === '/';
  const navSolid = !isHomeHero || isScrolled;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!supabaseAuthEnabled) return undefined;
    let subscription: { unsubscribe: () => void } | undefined;
    try {
      const supabase = createClient();
      supabase.auth.getUser().then(({ data }) => setUser(data.user ?? null));
      const sub = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null);
      });
      subscription = sub.data.subscription;
    } catch {
      /* misconfigured env — keep nav usable */
    }
    return () => subscription?.unsubscribe();
  }, [supabaseAuthEnabled]);

  useEffect(() => {
    if (!user) {
      setShowAdminLink(false);
      setShowDeskLink(false);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        await fetch('/api/auth/sync-profile', { method: 'POST', credentials: 'include', cache: 'no-store' });
        const r = await fetch('/api/admin/me', { credentials: 'include', cache: 'no-store' });
        const data = await r.json();
        if (!cancelled) {
          setShowAdminLink(Boolean(data?.canOpenAdminShell));
          setShowDeskLink(Boolean(data?.canOpenDesk));
        }
      } catch {
        if (!cancelled) {
          setShowAdminLink(false);
          setShowDeskLink(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user]);

  const handleSignOut = async () => {
    if (!supabaseAuthEnabled) return;
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      setUser(null);
    } catch {
      /* ignore */
    }
    setIsMobileMenuOpen(false);
  };

  const navLinks = [
    { href: '/programs', label: t('navigation.programs') },
    { href: '/candidates', label: t('navigation.candidates') },
    { href: '/about', label: t('navigation.about') },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        navSolid
          ? 'bg-white/98 backdrop-blur-xl shadow-soft border-b border-gray-100'
          : 'bg-transparent'
      }`}
    >
      <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-16">
        <div className="flex items-center justify-between h-24 w-full">
          {/* Logo */}
          <Link href="/" className="flex items-center group flex-shrink-0">
            <span className={`text-2xl md:text-3xl font-serif font-bold transition-all duration-300 group-hover:scale-105 ${
              navSolid ? 'text-primary' : 'text-white drop-shadow-lg'
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
                  navSolid 
                    ? 'text-dark hover:text-primary' 
                    : 'text-white/90 hover:text-white'
                }`}
              >
                <span className="relative z-10">{link.label}</span>
                <span className={`absolute inset-0 rounded-lg transition-all duration-300 ${
                  navSolid 
                    ? 'bg-accent/10 opacity-0 group-hover:opacity-100' 
                    : 'bg-white/10 opacity-0 group-hover:opacity-100'
                }`}></span>
              </Link>
            ))}
            
            {/* Language Selector */}
            <LanguageSelector variant={navSolid ? 'dark' : 'light'} />

            {supabaseAuthEnabled &&
              (user ? (
                <>
                  {showDeskLink && (
                    <Link
                      href="/desk"
                      className={`whitespace-nowrap rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                        navSolid ? 'text-primary hover:bg-primary/10' : 'text-white hover:bg-white/10'
                      }`}
                    >
                      {t('navigation.desk')}
                    </Link>
                  )}
                  {showAdminLink && (
                    <Link
                      href="/admin"
                      className={`whitespace-nowrap rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                        navSolid ? 'text-primary hover:bg-primary/10' : 'text-white hover:bg-white/10'
                      }`}
                    >
                      {t('navigation.admin')}
                    </Link>
                  )}
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className={`whitespace-nowrap rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                      navSolid ? 'text-dark hover:bg-gray-100' : 'text-white/90 hover:bg-white/10'
                    }`}
                  >
                    {t('navigation.signOut')}
                  </button>
                </>
              ) : (
                <Link
                  href="/login?next=/candidates"
                  className={`whitespace-nowrap rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                    navSolid ? 'text-dark hover:text-primary' : 'text-white/90 hover:text-white'
                  }`}
                >
                  {t('navigation.employerSignIn')}
                </Link>
              ))}

            <Link
              href="/clients"
              className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all duration-300 hover:scale-105 hover:shadow-lg whitespace-nowrap ${
                navSolid
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
              navSolid 
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

              {supabaseAuthEnabled &&
                (user ? (
                  <>
                    {showDeskLink && (
                      <Link
                        href="/desk"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="mx-4 block rounded-lg px-4 py-3 font-semibold text-primary hover:bg-accent/10"
                      >
                        {t('navigation.desk')}
                      </Link>
                    )}
                    {showAdminLink && (
                      <Link
                        href="/admin"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="mx-4 block rounded-lg px-4 py-3 font-semibold text-primary hover:bg-accent/10"
                      >
                        {t('navigation.admin')}
                      </Link>
                    )}
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="mx-4 block w-[calc(100%-2rem)] rounded-lg px-4 py-3 text-start font-semibold text-dark hover:bg-accent/10"
                    >
                      {t('navigation.signOut')}
                    </button>
                  </>
                ) : (
                  <Link
                    href="/login?next=/candidates"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="mx-4 block rounded-lg px-4 py-3 font-semibold text-dark hover:bg-accent/10"
                  >
                    {t('navigation.employerSignIn')}
                  </Link>
                ))}

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
