'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, WifiOff, Grid3X3, BookOpen } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  gameIcon?: string;
  colorMain?: string;
  colorSecondary?: string;
  subtitle?: string;
  counter?: string;
  onGridClick?: () => void;
  onRulesClick?: () => void;
}

export function Header({ title, showBack, onBack, colorMain, colorSecondary, subtitle, counter, onGridClick, onRulesClick }: HeaderProps) {
  const { isOffline } = useGameStore();
  const router = useRouter();

  const handleBack = onBack ?? (() => router.push('/'));

  return (
    <header className="p-4 py-6 border-white/10"
      style={
        counter ?
        { } :
        { background: `linear-gradient(130deg, ${colorMain}, ${colorSecondary})` }}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {showBack && (
            <button
              onClick={handleBack}
              className="p-2 -ml-2 rounded-full hover:bg-white/10 transition-colors"
              aria-label="Retour"
            >
              <ArrowLeft size={20} className="text-white" />
            </button>
          )}
          {!title && (
            <div className="flex items-center gap-2">
              <img src="/playlink-logo.svg" alt="Playlink" width={32} height={32} />
              <span className="text-lg font-black text-white">Playlink</span>
            </div>
          )}
        </div>

        {title && showBack && (
          <div className="flex flex-col items-center gap-1">
            <h1 className="text-lg font-semibold text-white uppercase">{title}</h1>
            {counter ? (
              <>
                <p className="text-sm text-white/80">{subtitle}</p>
              </>
            ) : (
              <p className="text-xs text-white/80">{subtitle}</p>
            )}
          </div>
        )}

        <div className="flex items-center gap-1 justify-end">
          {onRulesClick && (
            <motion.button
              onClick={onRulesClick}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-full text-white hover:bg-white/10 transition-colors"
              title="Règles du jeu"
            >
              <BookOpen size={20} />
            </motion.button>
          )}
          {onGridClick && counter && (
            <motion.button
              onClick={onGridClick}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-full text-white hover:bg-white/10 transition-colors"
              title="Voir toutes les cartes"
            >
              <Grid3X3 size={20} />
            </motion.button>
          )}
          {isOffline && (
            <span title="Mode hors-ligne">
              <WifiOff size={16} className="text-amber-400" />
            </span>
          )}
        </div>
      </div>

    </header>
  );
}
