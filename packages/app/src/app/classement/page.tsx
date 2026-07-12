'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Medal, LogIn, Star } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { AuthModal } from '@/components/AuthModal';
import { PlayerProfileModal } from '@/components/PlayerProfileModal';
import { ImportGuestPlayersModal } from '@/components/ImportGuestPlayersModal';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? '';

interface LeaderboardEntry {
  id: string;
  name: string;
  avatar: string | null;
  totalScore: number;
  totalGames: number;
  playerType: string;
}

interface UserBadge {
  id: string;
  earnedAt: string;
  badge: { key: string; name: string; description: string; icon: string };
}

const RANK_COLORS = ['text-yellow-400', 'text-slate-300', 'text-amber-600'];
const RANK_ICONS = ['🥇', '🥈', '🥉'];

export default function ClassementPage() {
  const { appUser, token } = useAuthStore();
  const [tab, setTab] = useState<'top' | 'badges'>('top');
  const [showAuth, setShowAuth] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [badges, setBadges] = useState<UserBadge[]>([]);
  const [loadingBoard, setLoadingBoard] = useState(false);
  const [loadingBadges, setLoadingBadges] = useState(false);

  useEffect(() => {
    if (!appUser || !token) { setLeaderboard([]); return; }
    setLoadingBoard(true);
    fetch(`${API_URL}/api/leaderboard`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((j) => setLeaderboard(j.data ?? []))
      .catch(() => {})
      .finally(() => setLoadingBoard(false));
  }, [appUser, token]);

  useEffect(() => {
    if (!appUser || !token || tab !== 'badges') return;
    setLoadingBadges(true);
    fetch(`${API_URL}/api/app-users/badges`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((j) => setBadges(j.data ?? []))
      .catch(() => {})
      .finally(() => setLoadingBadges(false));
  }, [appUser, token, tab]);

  if (!appUser) {
    return (
      <div className="flex flex-col min-h-[100dvh] bg-gradient-to-b from-indigo-950 via-purple-900 to-indigo-950 pb-20">
        <div className="px-4 pt-6 pb-4">
          <h1 className="text-2xl font-black text-white">Classement</h1>
          <p className="text-white/60 text-sm mt-1">Tes stats et badges</p>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center gap-4 px-8 text-center">
          <Trophy size={56} className="text-yellow-400/50" />
          <p className="text-white font-black text-xl">Connecte-toi pour accéder au classement</p>
          <p className="text-white/50 text-sm">Sauvegarde tes scores, gagne des badges et compare-toi aux autres joueurs.</p>
          <motion.button
            onClick={() => setShowAuth(true)}
            whileTap={{ scale: 0.97 }}
            className="mt-2 flex items-center gap-2 px-6 py-3 rounded-2xl bg-pink-500 text-white font-bold"
          >
            <LogIn size={18} />
            Se connecter
          </motion.button>
        </div>
        <AuthModal open={showAuth} onClose={() => setShowAuth(false)} onSuccess={(hadGuests) => { setShowAuth(false); if (hadGuests) setShowImport(true); }} />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-[100dvh] bg-gradient-to-b from-indigo-950 via-purple-900 to-indigo-950 pb-20">
      {/* Header */}
      <div className="px-4 pt-6 pb-4">
        <h1 className="text-2xl font-black text-white">Classement</h1>
        <p className="text-white/60 text-sm mt-1">Tes stats et badges</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 px-4 mb-4">
        {(['top', 'badges'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2.5 rounded-2xl text-sm font-bold transition-all ${
              tab === t ? 'bg-pink-500 text-white' : 'bg-white/10 text-white/60'
            }`}
          >
            {t === 'top' ? '🏆 Top joueurs' : '⭐ Mes badges'}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {tab === 'top' && (
          <motion.div
            key="top"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex-1 px-4"
          >
            {loadingBoard ? (
              <div className="flex justify-center py-20">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                >
                  <Trophy size={32} className="text-white/30" />
                </motion.div>
              </div>
            ) : leaderboard.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
                <Trophy size={48} className="text-yellow-400/50" />
                <p className="text-white font-bold">Aucun joueur encore</p>
                <p className="text-white/50 text-sm">Connecte-toi et joue une partie pour apparaître ici !</p>
                {!appUser && (
                  <motion.button
                    onClick={() => setShowAuth(true)}
                    whileTap={{ scale: 0.97 }}
                    className="mt-2 flex items-center gap-2 px-6 py-3 rounded-2xl bg-pink-500 text-white font-bold text-sm"
                  >
                    <LogIn size={16} />
                    Se connecter
                  </motion.button>
                )}
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {leaderboard.map((entry, i) => (
                  <motion.button
                    key={entry.id}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    onClick={() => setSelectedPlayerId(entry.id)}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-3 bg-white/10 rounded-2xl px-4 py-3 text-left w-full"
                  >
                    <span className="text-lg w-6 text-center">
                      {i < 3 ? RANK_ICONS[i] : <Medal size={16} className="text-white/40" />}
                    </span>
                    <span className="text-2xl">{entry.avatar ?? '👤'}</span>
                    <div className="flex-1 min-w-0">
                      <p className={`font-bold text-sm truncate ${i < 3 ? RANK_COLORS[i] : 'text-white'}`}>
                        {entry.name}
                      </p>
                      <p className="text-white/40 text-xs truncate">{entry.playerType}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-white font-black text-sm">{entry.totalScore} pts</p>
                      <p className="text-white/40 text-xs">{entry.totalGames} partie{entry.totalGames > 1 ? 's' : ''}</p>
                    </div>
                  </motion.button>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {tab === 'badges' && (
          <motion.div
            key="badges"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex-1 px-4"
          >
            {!appUser ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
                <Star size={48} className="text-pink-400/50" />
                <p className="text-white font-bold">Connecte-toi pour voir tes badges</p>
                <motion.button
                  onClick={() => setShowAuth(true)}
                  whileTap={{ scale: 0.97 }}
                  className="mt-2 flex items-center gap-2 px-6 py-3 rounded-2xl bg-pink-500 text-white font-bold text-sm"
                >
                  <LogIn size={16} />
                  Se connecter
                </motion.button>
              </div>
            ) : loadingBadges ? (
              <div className="flex justify-center py-20">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                  <Star size={32} className="text-white/30" />
                </motion.div>
              </div>
            ) : badges.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
                <Star size={48} className="text-pink-400/50" />
                <p className="text-white font-bold">Aucun badge encore</p>
                <p className="text-white/50 text-sm">Joue des parties pour débloquer tes premiers badges !</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {badges.map((ub, i) => (
                  <motion.div
                    key={ub.id}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="flex items-center gap-4 bg-white/10 rounded-2xl px-4 py-4"
                  >
                    <span className="text-3xl">{ub.badge.icon}</span>
                    <div className="flex-1">
                      <p className="text-white font-bold text-sm">{ub.badge.name}</p>
                      <p className="text-white/50 text-xs">{ub.badge.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <AuthModal open={showAuth} onClose={() => setShowAuth(false)} onSuccess={(hadGuests) => { setShowAuth(false); if (hadGuests) setShowImport(true); }} />
      {showImport && <ImportGuestPlayersModal onClose={() => setShowImport(false)} />}

      {selectedPlayerId && (
        <PlayerProfileModal
          playerId={selectedPlayerId}
          onClose={() => setSelectedPlayerId(null)}
          onDeleted={(id) => {
            setLeaderboard((prev) => prev.filter((e) => e.id !== id));
            setSelectedPlayerId(null);
          }}
        />
      )}
    </div>
  );
}
