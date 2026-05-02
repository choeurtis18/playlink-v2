'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import type { ExportCard, ExportGame, ExportCategory } from '@/store/gameStore';

interface PlayCardProps {
  game: ExportGame;
  category: ExportCategory;
  card: ExportCard | undefined;
  currentIndex: number;
  total: number;
  direction: number;
  onNext: () => void;
  onPrev: () => void;
  onReset: () => void;
  finished: boolean;
}

export function PlayCard({
  game,
  category,
  card,
  currentIndex,
  total,
  direction,
  onNext,
  onPrev,
  onReset,
  finished,
}: PlayCardProps) {
  return (
    <div className="relative flex flex-col h-full">
      {/* Card area */}
      <div className="relative flex-1 flex flex-col items-center justify-center px-4 py-8">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          {finished ? (
            <motion.div
              key="finished"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center gap-6 text-center"
            >
              <div className="text-6xl">🎉</div>
              <div>
                <p className="text-3xl font-black text-white">Partie terminée !</p>
                <p className="text-sm text-white/60 mt-2">{total} cartes jouées</p>
              </div>
              <button
                onClick={onReset}
                className="flex items-center gap-2 px-6 py-3 rounded-full text-white font-semibold text-sm shadow-md mt-4"
                style={{ background: `linear-gradient(135deg, ${game.colorMain}, ${game.colorSecondary})` }}
              >
                <RotateCcw size={16} />
                Changer de catégorie
              </button>
            </motion.div>
          ) : (
            <motion.div
              key={card?.id ?? 'empty'}
              custom={direction}
              variants={{
                enter: (dir: number) => ({
                  x: dir > 0 ? 400 : -400,
                  opacity: 0,
                }),
                center: {
                  x: 0,
                  opacity: 1,
                },
                exit: (dir: number) => ({
                  x: dir > 0 ? -400 : 400,
                  opacity: 0,
                }),
              }}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={(_, info) => {
                if (info.offset.x > 80) onPrev();
                else if (info.offset.x < -80) onNext();
              }}
              className="w-full max-w-md cursor-grab active:cursor-grabbing"
              style={{ touchAction: 'pan-y' }}
            >
              <div
                className="rounded-3xl overflow-hidden shadow-2xl backdrop-blur-sm min-h-[280px] flex flex-col"
                style={{
                  background: `${game.colorMain}`,
                  border: `1px solid ${game.colorSecondary}`,
                  boxShadow: `${game.colorMain}20 0px 0px 0px 1px, rgba(0, 0, 0, 0.6) 0px 20px 40px, ${game.colorMain}20 0px 0px 40px`,
                }}
              >
                {/* Gradient top bar */}
                <div
                  className="h-1.5"
                  style={{
                    background: `linear-gradient(90deg, ${game.colorSecondary}, ${game.colorSecondary})`,
                    boxShadow: `${game.colorMain}60 0px 2px 12px`,
                  }}
                />

                {/* Card content */}
                <div className="flex-1 px-6 py-6 flex flex-col justify-between">
                  {/* Category badge */}
                  <div
                    className="inline-flex items-center gap-2 rounded-full px-4 py-2 w-fit"
                    style={{
                      background: `${game.colorMain}`,
                      border: `1px solid ${game.colorSecondary}`,
                    }}
                  >
                    <span className="text-xs">{category.icon ?? '🎮'}</span>
                    <span
                      className="text-xs uppercase tracking-widest"
                      style={{ color: game.colorSecondary }}
                    >
                      {category.name}
                    </span>
                  </div>

                  {/* Card text */}
                  <p className="text-2xl font-black text-white leading-snug flex items-center justify-center flex-1">
                    {card?.text}
                  </p>

                  {/* Swipe hint */}
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-sm">👈</span>
                    <span className="text-sm text-white">Swipe pour changer</span>
                    <span className="text-sm">👉</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}
