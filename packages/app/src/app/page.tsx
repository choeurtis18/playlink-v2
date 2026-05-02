'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import { Header } from '@/components/Header';
import { GameCard } from '@/components/GameCard';

export default function HomePage() {
  const { games, isLoading, isOffline, lastSyncAt, fetchGames } = useGameStore();

  useEffect(() => {
    const shouldRefresh = !lastSyncAt || Date.now() - new Date(lastSyncAt).getTime() > 5 * 60 * 1000;
    if (shouldRefresh) {
      fetchGames().catch(() => {});
    }

    const onVisible = () => {
      if (document.visibilityState === 'visible') fetchGames().catch(() => {});
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => document.removeEventListener('visibilitychange', onVisible);
  }, [fetchGames, lastSyncAt]);

  return (
    <div className="flex flex-col min-h-[100dvh] bg-gradient-to-b from-indigo-950 via-purple-900 to-indigo-950">
      <Header />

      <main className="flex-1 px-4 py-6 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <h1 className="text-3xl sm:text-3xl font-black text-white leading-tight">
            Quel jeu <span className="bg-pink-500 rounded-lg px-2">oseras-tu</span> tester ?
          </h1>
        </motion.div>

        {isLoading && games.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            >
              <RefreshCw size={32} className="text-white/40" />
            </motion.div>
            <p className="text-sm text-white/60">Chargement…</p>
          </div>
        ) : games.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
            <p className="text-4xl">📡</p>
            <p className="font-semibold text-white">Impossible de charger les jeux</p>
            <p className="text-sm text-white/60">
              Vérifiez votre connexion et réessayez
            </p>
            <button
              onClick={() => fetchGames().catch(() => {})}
              className="mt-2 px-5 py-2.5 rounded-full bg-pink-500 text-white text-sm font-semibold hover:bg-pink-600 transition-colors"
            >
              Réessayer
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {games.map((game, i) => (
              <GameCard key={game.id} game={game} index={i} />
            ))}
          </div>
        )}

        {isOffline && games.length > 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 text-xs text-center text-amber-400"
          >
            Mode hors-ligne — données du {lastSyncAt ? new Date(lastSyncAt).toLocaleDateString('fr-FR') : 'cache'}
          </motion.p>
        )}
      </main>
    </div>
  );
}
