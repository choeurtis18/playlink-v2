'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SPLASH_KEY = 'playlink-splash-seen';

export function SplashScreen() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof sessionStorage === 'undefined') return;
    if (sessionStorage.getItem(SPLASH_KEY)) return;
    setVisible(true);
    const timer = setTimeout(() => {
      sessionStorage.setItem(SPLASH_KEY, '1');
      setVisible(false);
    }, 1800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-indigo-950 via-purple-900 to-indigo-950"
        >
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.1 }}
            className="flex flex-col items-center gap-4"
          >
            <motion.img
              src="/playlink-logo.svg"
              alt="Playlink"
              width={80}
              height={80}
              animate={{ rotate: [0, -8, 8, -4, 4, 0] }}
              transition={{ duration: 0.7, delay: 0.3 }}
            />
            <motion.span
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className="text-4xl font-black text-white tracking-tight"
            >
              Playlink
            </motion.span>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-white/50 text-sm tracking-widest uppercase"
            >
              Jeux de soirée
            </motion.p>
          </motion.div>

          {/* Barre de progression */}
          <motion.div
            className="absolute bottom-12 w-24 h-1 rounded-full bg-white/20 overflow-hidden"
          >
            <motion.div
              className="h-full bg-pink-500 rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 1.6, ease: 'easeInOut' }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
