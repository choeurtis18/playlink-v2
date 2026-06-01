'use client';

import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { RotateCcw } from 'lucide-react';
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

const STACK = [
  { scale: 0.93, y: 14, rotate: 2.5, opacity: 0.5 },
  { scale: 0.86, y: 26, rotate: -1.5, opacity: 0.3 },
];

function CardFace({ game, category, card }: { game: ExportGame; category: ExportCategory; card: ExportCard | undefined }) {
  return (
    <div
      className="rounded-3xl overflow-hidden shadow-2xl min-h-[280px] flex flex-col w-full h-full"
      style={{
        background: game.colorMain,
        border: `1px solid ${game.colorSecondary}`,
        boxShadow: `rgba(0,0,0,0.6) 0px 20px 40px`,
      }}
    >
      <div className="h-1.5" style={{ background: game.colorSecondary }} />
      <div className="flex-1 px-6 py-6 flex flex-col justify-between">
        <div
          className="inline-flex items-center gap-2 rounded-full px-4 py-2 w-fit"
          style={{ background: game.colorMain, border: `1px solid ${game.colorSecondary}` }}
        >
          <span className="text-xs">{category.icon ?? '🎮'}</span>
          <span className="text-xs text-white uppercase tracking-widest">{category.name}</span>
        </div>
        <p className="text-2xl font-black text-white leading-snug flex items-center justify-center flex-1 text-center">
          {card?.text}
        </p>
        <div className="flex items-center justify-center gap-2">
          <span className="text-sm">👈</span>
          <span className="text-sm text-white">Swipe pour changer</span>
          <span className="text-sm">👉</span>
        </div>
      </div>
    </div>
  );
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
  deck,
}: PlayCardProps & { deck: ExportCard[] }) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-300, 0, 300], [-18, 0, 18]);

  const nextCard = deck[currentIndex + 1];
  const prevCard = currentIndex > 0 ? deck[currentIndex - 1] : undefined;

  // Which peek card to show depends on drag direction
  const dragX = x.get();
  const peekCard = dragX > 20 ? prevCard : dragX < -20 ? nextCard : undefined;

  return (
    <div className="relative flex flex-col h-full">
      <div className="relative flex-1 flex flex-col items-center justify-center px-4 pb-8">
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
          <div className="relative w-full max-w-md" style={{ minHeight: 300 }}>
            {/* Stack cards behind */}
            {STACK.map((s, i) => (
              <div
                key={i}
                className="absolute inset-0 rounded-3xl"
                style={{
                  background: game.colorMain,
                  border: `1px solid ${game.colorSecondary}`,
                  transform: `translateY(${s.y}px) scale(${s.scale}) rotate(${s.rotate}deg)`,
                  opacity: s.opacity,
                  zIndex: STACK.length - i,
                  transformOrigin: 'bottom center',
                }}
              />
            ))}

            {/* Peek card (next or prev) — visible behind during drag */}
            <AnimatePresence>
              {peekCard && (
                <motion.div
                  key={peekCard.id}
                  initial={{ opacity: 0, scale: 0.93 }}
                  animate={{ opacity: 0.85, scale: 0.96 }}
                  exit={{ opacity: 0, scale: 0.93 }}
                  transition={{ duration: 0.1 }}
                  className="absolute inset-0"
                  style={{ zIndex: STACK.length + 1 }}
                >
                  <CardFace game={game} category={category} card={peekCard} />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Active card */}
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={card?.id ?? 'empty'}
                custom={direction}
                variants={{
                  enter: (dir: number) => ({
                    x: dir > 0 ? 380 : -380,
                    rotate: dir > 0 ? 18 : -18,
                    opacity: 0,
                    scale: 0.88,
                  }),
                  center: { x: 0, rotate: 0, opacity: 1, scale: 1 },
                  exit: (dir: number) => ({
                    x: dir > 0 ? -380 : 380,
                    rotate: dir > 0 ? -18 : 18,
                    opacity: 0,
                    scale: 0.88,
                  }),
                }}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: 'tween', duration: 0.2, ease: 'easeInOut' }}
                style={{
                  position: 'relative',
                  zIndex: STACK.length + 2,
                  touchAction: 'pan-y',
                  transformOrigin: 'bottom center',
                  x,
                  rotate,
                }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={(_, info) => {
                  if (info.offset.x > 80) onNext();
                  else if (info.offset.x < -80) onPrev();
                }}
                whileDrag={{ cursor: 'grabbing' }}
              >
                <CardFace game={game} category={category} card={card} />
              </motion.div>
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
