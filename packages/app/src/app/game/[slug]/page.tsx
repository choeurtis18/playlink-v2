'use client';

import { useRef } from 'react';
import { useGameStore } from '@/store/gameStore';
import { Header } from '@/components/Header';
import { CategoryPicker } from '@/components/CategoryPicker';
import { PlayCard } from '@/components/PlayCard';

interface PageProps {
  params: { slug: string };
}

export default function GamePage({ params }: PageProps) {
  const { games, activeCategoryId, deck, currentIndex, next, prev, resetDeck, startDeck } = useGameStore();
  const directionRef = useRef(1);

  const game = games.find((g) => g.slug === params.slug);

  if (!game) {
    return (
      <div className="flex flex-col min-h-[100dvh]">
        <Header showBack />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-black/40 dark:text-white/40">Jeu introuvable</p>
        </div>
      </div>
    );
  }

  if (!activeCategoryId) {
    return (
      <div className="flex flex-col min-h-[100dvh]">
        <Header title={game.name} showBack />
        <CategoryPicker game={game} onSelect={startDeck} />
      </div>
    );
  }

  const activeCategory = game.categories.find((c) => c.id === activeCategoryId);

  if (!activeCategory || deck.length === 0) {
    resetDeck();
    return null;
  }

  const finished = currentIndex >= deck.length;
  const card = finished ? undefined : deck[currentIndex];

  const handleNext = () => {
    directionRef.current = -1;
    next();
  };

  const handlePrev = () => {
    directionRef.current = 1;
    prev();
  };

  return (
    <div className="flex flex-col min-h-[100dvh]">
      <Header title={game.name} showBack onBack={resetDeck} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <PlayCard
          game={game}
          categoryName={activeCategory?.name ?? ''}
          card={card}
          currentIndex={currentIndex}
          total={deck.length}
          direction={directionRef.current}
          onNext={handleNext}
          onPrev={handlePrev}
          onReset={resetDeck}
          finished={finished}
        />
      </div>
    </div>
  );
}
