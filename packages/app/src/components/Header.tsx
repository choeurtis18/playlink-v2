'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, WifiOff } from 'lucide-react';
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
}

export function Header({ title, showBack, onBack, gameIcon, colorMain, colorSecondary, subtitle, counter }: HeaderProps) {
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
              <p className="text-xs text-white/80">{subtitle || '4 CATÉGORIES'}</p>
            )}
          </div>
        )}

        <div className="flex items-center gap-2 justify-end">
          {counter && (
            <p className="text-lg text-white">{counter}</p>
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
