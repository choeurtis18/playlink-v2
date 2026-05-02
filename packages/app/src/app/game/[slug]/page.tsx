'use client';

import { useRef } from 'react';
import { useGameStore } from '@/store/gameStore';
import { Header } from '@/components/Header';
import { CategoryPicker } from '@/components/CategoryPicker';
import { PlayCard } from '@/components/PlayCard';
import { PlayFooter } from '@/components/PlayFooter';

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
        <Header title={game.name} showBack gameIcon={game.icon} colorMain={game.colorMain} colorSecondary={game.colorSecondary} />
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
    <div className="flex flex-col min-h-[100dvh]"
     style={{
      background: `linear-gradient(90deg, ${game.colorMain}, ${game.colorSecondary})`,          
     }}
    >
      <Header
        title={game.name}
        showBack
        onBack={resetDeck}
        gameIcon={game.icon}
        colorMain={game.colorMain}
        colorSecondary={game.colorSecondary}
        subtitle={activeCategory?.name}
        counter={`${currentIndex + 1} / ${deck.length}`}
      />
      <div className="flex-1 flex flex-col relative">
        <div className="absolute bottom-0 right-0 text-[200px] opacity-5 pointer-events-none leading-none">
          {game.icon}
        </div>
        <PlayCard
          game={game}
          category={activeCategory!}
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
      <PlayFooter
        game={game}
        currentIndex={currentIndex}
        total={deck.length}
        onNext={handleNext}
        onPrev={handlePrev}
        finished={finished}
      />
    </div>
  );
}
