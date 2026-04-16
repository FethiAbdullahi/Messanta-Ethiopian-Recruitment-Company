'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Share, Plus, MoreVertical } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem('pwa-dismissed')) {
      setDismissed(true);
      return;
    }

    // Detect platform
    const ua = navigator.userAgent.toLowerCase();
    const iOS = /iphone|ipad|ipod/.test(ua);
    const android = /android/.test(ua);
    setIsIOS(iOS);
    setIsAndroid(android);

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Check iOS standalone mode
    if ((window.navigator as Navigator & { standalone?: boolean }).standalone === true) {
      setIsInstalled(true);
      return;
    }

    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js', { scope: '/' })
        .then((reg) => console.log('✅ SW registered:', reg.scope))
        .catch((err) => console.log('❌ SW failed:', err));
    }

    // Listen for install prompt (Chrome/Edge/Android)
    const handlePrompt = (e: Event) => {
      console.log('✅ Install prompt ready!');
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handlePrompt);
    window.addEventListener('appinstalled', handleInstalled);

    // Show button after delay
    setTimeout(() => setIsReady(true), 1500);

    return () => {
      window.removeEventListener('beforeinstallprompt', handlePrompt);
      window.removeEventListener('appinstalled', handleInstalled);
    };
  }, []);

  const handleInstall = useCallback(async () => {
    if (deferredPrompt) {
      // Chrome/Edge/Android - use native prompt
      try {
        await deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') setIsInstalled(true);
      } catch (e) {
        console.error('Install error:', e);
      }
      setDeferredPrompt(null);
    } else {
      // iOS or no prompt available - show instructions
      setShowInstructions(true);
    }
  }, [deferredPrompt]);

  const dismiss = () => {
    setDismissed(true);
    setShowInstructions(false);
    sessionStorage.setItem('pwa-dismissed', 'true');
  };

  if (isInstalled || dismissed || !isReady) return null;

  return (
    <>
      {/* Install Button */}
      <AnimatePresence>
        {!showInstructions && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="fixed bottom-6 start-6 z-40 max-w-[calc(100vw-3rem)]"
          >
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
        )}
      </AnimatePresence>

      {/* Instructions Modal */}
      <AnimatePresence>
        {showInstructions && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-end justify-center bg-black/50 p-4 backdrop-blur-sm sm:items-center"
            onClick={() => setShowInstructions(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-primary to-accent p-4 text-white">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold">Install App</h3>
                  <button
                    onClick={() => setShowInstructions(false)}
                    className="p-1 rounded-full hover:bg-white/20"
                  >
                    <X size={20} />
                  </button>
                </div>
                <p className="text-sm text-white/80 mt-1">
                  Add Skills for Life to your home screen
                </p>
              </div>

              {/* Instructions */}
              <div className="p-4 space-y-4">
                {isIOS ? (
                  // iOS Safari Instructions
                  <>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-primary font-bold text-sm">1</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-800 font-medium">
                          Tap the Share button
                        </p>
                        <div className="flex items-center gap-2 mt-1 text-gray-500 text-sm">
                          <Share size={18} className="text-primary" />
                          <span>at the bottom of Safari</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-primary font-bold text-sm">2</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-800 font-medium">
                          Scroll and tap &quot;Add to Home Screen&quot;
                        </p>
                        <div className="flex items-center gap-2 mt-1 text-gray-500 text-sm">
                          <Plus size={18} className="text-primary" />
                          <span>in the share menu</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-primary font-bold text-sm">3</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-800 font-medium">
                          Tap &quot;Add&quot; to install
                        </p>
                        <p className="text-gray-500 text-sm mt-1">
                          The app will appear on your home screen
                        </p>
                      </div>
                    </div>
                  </>
                ) : isAndroid ? (
                  // Android Chrome Instructions
                  <>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-primary font-bold text-sm">1</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-800 font-medium">
                          Tap the menu button
                        </p>
                        <div className="flex items-center gap-2 mt-1 text-gray-500 text-sm">
                          <MoreVertical size={18} className="text-primary" />
                          <span>three dots at top right</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-primary font-bold text-sm">2</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-800 font-medium">
                          Tap &quot;Install app&quot; or &quot;Add to Home screen&quot;
                        </p>
                        <div className="flex items-center gap-2 mt-1 text-gray-500 text-sm">
                          <Download size={18} className="text-primary" />
                          <span>in the menu</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-primary font-bold text-sm">3</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-800 font-medium">
                          Tap &quot;Install&quot; to confirm
                        </p>
                        <p className="text-gray-500 text-sm mt-1">
                          The app will be added to your home screen
                        </p>
                      </div>
                    </div>
                  </>
                ) : (
                  // Desktop Chrome/Edge Instructions
                  <>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-primary font-bold text-sm">1</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-800 font-medium">
                          Look for the install icon in the address bar
                        </p>
                        <div className="flex items-center gap-2 mt-1 text-gray-500 text-sm">
                          <Download size={18} className="text-primary" />
                          <span>or a ⊕ icon on the right</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-primary font-bold text-sm">2</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-800 font-medium">
                          Or use the browser menu
                        </p>
                        <div className="flex items-center gap-2 mt-1 text-gray-500 text-sm">
                          <MoreVertical size={18} className="text-primary" />
                          <span>→ &quot;Install Skills for Life...&quot;</span>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Footer */}
              <div className="p-4 bg-gray-50 border-t">
                <button
                  onClick={() => setShowInstructions(false)}
                  className="w-full py-2.5 text-gray-600 font-medium hover:text-gray-800 transition-colors"
                >
                  Got it
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
