'use client';

import { useRouter } from 'next/navigation';
import { Moon, Sun, ArrowLeft, WifiOff } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
}

export function Header({ title, showBack, onBack }: HeaderProps) {
  const { darkMode, toggleDark, isOffline } = useGameStore();
  const router = useRouter();

  const handleBack = onBack ?? (() => router.push('/'));

  return (
    <header className="flex items-center justify-between px-4 py-3 h-14">
      <div className="w-10">
        {showBack && (
          <button
            onClick={handleBack}
            className="p-2 -ml-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
            aria-label="Retour"
          >
            <ArrowLeft size={20} />
          </button>
        )}
      </div>

      <div className="flex items-center gap-2">
        {title ? (
          <h1 className="text-base font-semibold truncate max-w-[200px]">{title}</h1>
        ) : (
          <span className="text-xl font-black tracking-tight">
            Play<span className="text-indigo-500">link</span>
          </span>
        )}
        {isOffline && (
          <span title="Mode hors-ligne">
            <WifiOff size={14} className="text-amber-500" />
          </span>
        )}
      </div>

      <button
        onClick={toggleDark}
        className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
        aria-label={darkMode ? 'Mode clair' : 'Mode sombre'}
      >
        {darkMode ? <Sun size={18} /> : <Moon size={18} />}
      </button>
    </header>
  );
}
