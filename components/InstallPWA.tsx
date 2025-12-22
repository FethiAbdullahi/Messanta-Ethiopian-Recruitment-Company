'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, ExternalLink } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [showTip, setShowTip] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem('pwa-dismissed')) {
      setDismissed(true);
      return;
    }

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js', { scope: '/' })
        .then((reg) => console.log('✅ SW registered:', reg.scope))
        .catch((err) => console.log('❌ SW failed:', err));
    }

    const handlePrompt = (e: Event) => {
      console.log('✅ Install prompt ready!');
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsReady(true);
    };

    const handleInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handlePrompt);
    window.addEventListener('appinstalled', handleInstalled);

    // Show after delay
    setTimeout(() => setIsReady(true), 2000);

    return () => {
      window.removeEventListener('beforeinstallprompt', handlePrompt);
      window.removeEventListener('appinstalled', handleInstalled);
    };
  }, []);

  const handleInstall = useCallback(async () => {
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') setIsInstalled(true);
      } catch (e) {
        console.error('Install error:', e);
      }
      setDeferredPrompt(null);
    } else {
      // Show tip instead of alert
      setShowTip(true);
      setTimeout(() => setShowTip(false), 5000);
    }
  }, [deferredPrompt]);

  const dismiss = () => {
    setDismissed(true);
    sessionStorage.setItem('pwa-dismissed', 'true');
  };

  if (isInstalled || dismissed || !isReady) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 20 }}
        className="fixed bottom-6 right-6 z-50"
      >
        {/* Tip tooltip */}
        <AnimatePresence>
          {showTip && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute bottom-full right-0 mb-2 w-64 p-3 bg-dark text-white text-xs rounded-lg shadow-xl"
            >
              <div className="flex items-start gap-2">
                <ExternalLink size={14} className="text-accent mt-0.5 flex-shrink-0" />
                <span>Use browser menu (⋮) → &quot;Install Skills for Life&quot; or look for ⊕ in address bar</span>
              </div>
              <div className="absolute bottom-0 right-4 translate-y-1/2 rotate-45 w-2 h-2 bg-dark" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pulsing ring */}
        <span className="absolute inset-0 rounded-full bg-accent/40 animate-ping" />
        
        <div className="relative flex items-center gap-2 bg-gradient-to-r from-primary to-accent rounded-full pl-4 pr-2 py-2.5 shadow-xl border border-white/20">
          <button
            onClick={handleInstall}
            className="flex items-center gap-2 text-white"
          >
            <Download size={18} className="animate-bounce" />
            <span className="text-sm font-semibold">Install</span>
          </button>
          <button
            onClick={dismiss}
            className="p-1.5 rounded-full hover:bg-white/20 text-white/80 hover:text-white transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
