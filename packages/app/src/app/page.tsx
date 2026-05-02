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
    fetchGames().catch(() => {});

    const onVisible = () => {
      if (document.visibilityState === 'visible') fetchGames().catch(() => {});
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => document.removeEventListener('visibilitychange', onVisible);
  }, [fetchGames]);

  return (
    <div className="flex flex-col min-h-[100dvh]">
      <Header />

      <main className="flex-1 px-4 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-6"
        >
          <h2 className="text-2xl font-bold">Choisissez un jeu</h2>
          <p className="text-sm text-black/50 dark:text-white/50 mt-1">
            {games.length > 0
              ? `${games.reduce((s, g) => s + g.categories.reduce((cs, c) => cs + c.cards.length, 0), 0)} cartes disponibles`
              : 'Chargement des jeux...'}
          </p>
        </motion.div>

        {isLoading && games.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            >
              <RefreshCw size={28} className="text-black/30 dark:text-white/30" />
            </motion.div>
            <p className="text-sm text-black/40 dark:text-white/40">Chargement…</p>
          </div>
        ) : games.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
            <p className="text-4xl">📡</p>
            <p className="font-semibold">Impossible de charger les jeux</p>
            <p className="text-sm text-black/50 dark:text-white/50">
              Vérifiez votre connexion et réessayez
            </p>
            <button
              onClick={() => fetchGames().catch(() => {})}
              className="mt-2 px-5 py-2.5 rounded-full bg-indigo-500 text-white text-sm font-semibold"
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
            className="mt-4 text-xs text-center text-amber-600 dark:text-amber-400"
          >
            Mode hors-ligne — données du {lastSyncAt ? new Date(lastSyncAt).toLocaleDateString('fr-FR') : 'cache'}
          </motion.p>
        )}
      </main>
    </div>
  );
}
