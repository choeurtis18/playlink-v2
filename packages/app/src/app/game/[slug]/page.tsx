'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { useSessionStore } from '@/store/sessionStore';
import { Header } from '@/components/Header';
import { CategoryPicker } from '@/components/CategoryPicker';
import { PlayCard } from '@/components/PlayCard';
import { PlayFooter } from '@/components/PlayFooter';
import { VoteScreen } from '@/components/VoteScreen';
import { GameResults } from '@/components/GameResults';
import { CardGridModal } from '@/components/CardGridModal';
import { RulesModal, type RuleSlide } from '@/components/RulesModal';
import { useTracking } from '@/hooks/useTracking';
import { useAuthStore } from '@/store/authStore';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? '';

interface PageProps {
  params: { slug: string };
}

export default function GamePage({ params }: PageProps) {
  const router = useRouter();
  const { games, activeCategoryId, deck, currentIndex, next, resetDeck, startDeck } = useGameStore();
  const {
    players, currentPlayerIndex, scores, scoresBeforeSession,
    phase, assignPoint, skipCard, nextPlayer, endSession, resetSession,
    startSession,
    _hasHydrated,
  } = useSessionStore();

  const directionRef = useRef(1);
  const [showGrid, setShowGrid] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [ruleSlides, setRuleSlides] = useState<RuleSlide[]>([]);
  const [showVote, setShowVote] = useState(false);
  const { track } = useTracking();
  const { appUser, token } = useAuthStore();
  const trackedStartRef = useRef(false);
  const sessionSavedRef = useRef(false);

  // Guard: no players in session → back to setup
  useEffect(() => {
    if (_hasHydrated && players.length === 0) {
      resetDeck();
      router.replace('/setup');
    }
  }, [_hasHydrated, players.length, resetDeck, router]);

  useEffect(() => {
    fetch(`${API_URL}/api/games/${params.slug}/rule-slides`)
      .then((res) => res.json())
      .then((json) => setRuleSlides(json?.data ?? []))
      .catch(() => {});
  }, [params.slug]);

  const game = games.find((g) => g.slug === params.slug);
  const currentPlayer = players[currentPlayerIndex] ?? players[0];

  const handleStartDeck = useCallback((categoryId: string) => {
    const g = games.find((g) => g.slug === params.slug);
    if (g) track('game_started', { gameId: g.id, categoryId });
    trackedStartRef.current = false;
    sessionSavedRef.current = false;
    startSession();
    startDeck(categoryId);
  }, [games, params.slug, track, startDeck, startSession]);

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
        <Header
          title={game.name}
          showBack
          gameIcon={game.icon}
          colorMain={game.colorMain}
          colorSecondary={game.colorSecondary}
          subtitle={`${game.categories.length} CATÉGORIE${game.categories.length > 1 ? 'S' : ''}`}
          onRulesClick={ruleSlides.length > 0 ? () => setShowRules(true) : undefined}
        />
        <CategoryPicker game={game} onSelect={handleStartDeck} />
        {showRules && ruleSlides.length > 0 && (
          <RulesModal
            slides={ruleSlides}
            gameColors={{ colorMain: game.colorMain, colorSecondary: game.colorSecondary }}
            onClose={() => setShowRules(false)}
          />
        )}
      </div>
    );
  }

  const activeCategory = game.categories.find((c) => c.id === activeCategoryId);
  if (!activeCategory || deck.length === 0) { resetDeck(); return null; }

  const finished = currentIndex >= deck.length;
  const card = finished ? undefined : deck[currentIndex];

  // Phase résultats : deck terminé
  if (finished || phase === 'results') {
    return (
      <div
        className="flex flex-col min-h-[100dvh] overflow-y-auto"
        style={{ background: `linear-gradient(90deg, ${game.colorMain}, ${game.colorSecondary})` }}
      >
        <Header
          title={game.name}
          showBack
          onBack={() => { resetDeck(); resetSession(); }}
          colorMain={game.colorMain}
          colorSecondary={game.colorSecondary}
          subtitle={activeCategory.name}
        />
        <div className="flex-1 flex flex-col justify-center">
          <GameResults
            players={players}
            scores={scores}
            scoresBeforeSession={scoresBeforeSession}
            gameColors={{ colorMain: game.colorMain, colorSecondary: game.colorSecondary }}
            onReset={() => { resetDeck(); resetSession(); }}
          />
        </div>
      </div>
    );
  }

  const handleReveal = () => {
    track('card_viewed', { gameId: game.id, categoryId: activeCategoryId });
    setShowVote(true);
  };

  const handlePoint = () => {
    assignPoint(currentPlayer.id, card?.tags ?? []);
    setShowVote(false);
    advanceCard();
  };

  const handleSkip = () => {
    skipCard(currentPlayer.id, card?.tags ?? []);
    setShowVote(false);
    advanceCard();
  };

  const saveSession = (finalScores: Record<string, number>, finalTagScores: Record<string, Record<string, number>>) => {
    if (!appUser || !token || sessionSavedRef.current) return;
    sessionSavedRef.current = true;
    const { scoresBeforeSession: snapshot } = useSessionStore.getState();
    fetch(`${API_URL}/api/sessions`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        gameId: game.id,
        categoryId: activeCategoryId,
        players: players.map((p) => ({
          playerId: p.id,
          score: (finalScores[p.id] ?? 0) - (snapshot[p.id] ?? 0),
          tagScoresGained: finalTagScores[p.id] ?? {},
        })),
      }),
    }).catch(() => {});
  };

  const advanceCard = () => {
    directionRef.current = -1;
    const isLast = currentIndex + 1 >= deck.length;
    if (isLast) {
      if (!trackedStartRef.current) {
        trackedStartRef.current = true;
        track('game_finished', { gameId: game.id, categoryId: activeCategoryId, metadata: { cardsViewed: deck.length } });
      }
      const { scores: finalScores, tagScoresGained: finalTagScores } = useSessionStore.getState();
      saveSession(finalScores, finalTagScores);
      endSession();
    } else {
      nextPlayer();
      next();
    }
  };

  return (
    <div
      className="flex flex-col min-h-[100dvh]"
      style={{ background: `linear-gradient(90deg, ${game.colorMain}, ${game.colorSecondary})` }}
    >
      <Header
        title={game.name}
        showBack
        onBack={resetDeck}
        colorMain={game.colorMain}
        colorSecondary={game.colorSecondary}
        subtitle={activeCategory.name}
        counter={`${currentIndex + 1} / ${deck.length}`}
        onRulesClick={ruleSlides.length > 0 ? () => setShowRules(true) : undefined}
      />

      {players.length > 1 && currentPlayer && (
        <div className="text-center py-2">
          <p className="text-white font-bold text-lg">🎯 C'est au tour de {currentPlayer.name}</p>
        </div>
      )}

      <div className="flex-1 flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute bottom-0 right-0 text-[200px] opacity-5 pointer-events-none leading-none">
          {game.icon}
        </div>
        <PlayCard
          game={game}
          category={activeCategory}
          card={card}
          currentIndex={currentIndex}
          total={deck.length}
          direction={directionRef.current}
          onReveal={handleReveal}
          finished={finished}
          deck={deck}
        />
      </div>

      <AnimatePresence>
        {showVote && currentPlayer && (
          <div className="sticky bottom-0">
            <VoteScreen
              playerName={currentPlayer.name}
              onPoint={handlePoint}
              onSkip={handleSkip}
              gameColors={{ colorMain: game.colorMain, colorSecondary: game.colorSecondary }}
            />
          </div>
        )}
      </AnimatePresence>

      {!showVote && (
        <PlayFooter
          game={game}
          onReveal={handleReveal}
          disabled={showVote}
        />
      )}

      {showGrid && (
        <CardGridModal
          cards={deck}
          currentIndex={currentIndex}
          onSelectCard={() => {}}
          onClose={() => setShowGrid(false)}
          gameColors={{ colorMain: game.colorMain, colorSecondary: game.colorSecondary }}
          readOnly
        />
      )}

      {showRules && ruleSlides.length > 0 && (
        <RulesModal
          slides={ruleSlides}
          gameColors={{ colorMain: game.colorMain, colorSecondary: game.colorSecondary }}
          onClose={() => setShowRules(false)}
        />
      )}
    </div>
  );
}
