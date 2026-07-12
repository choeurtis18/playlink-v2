'use client';

import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, ArrowRight, Check, LogIn, LogOut, UserPlus } from 'lucide-react';
import { useSessionStore, type SessionPlayer } from '@/store/sessionStore';
import { useAuthStore } from '@/store/authStore';
import { AuthModal } from '@/components/AuthModal';
import { ImportGuestPlayersModal } from '@/components/ImportGuestPlayersModal';
import { DuplicatePlayerModal } from '@/components/DuplicatePlayerModal';
import type { DBPlayer } from '@/store/authStore';

const AVATARS = ['🎭', '🎯', '🔥', '⚡', '🌟', '🎪', '🎲', '🦊', '🐯', '🦁', '🐸', '🦋'];

function randomAvatar(used: string[]): string {
  const available = AVATARS.filter((a) => !used.includes(a));
  const pool = available.length > 0 ? available : AVATARS;
  return pool[Math.floor(Math.random() * pool.length)];
}

export default function SetupPage() {
  const router = useRouter();
  const { players: sessionPlayers, setPlayers, setMode } = useSessionStore();
  const { appUser, dbPlayers, signOut, fetchPlayers, createPlayer } = useAuthStore();

  const [players, setLocalPlayers] = useState<SessionPlayer[]>([]);
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [editError, setEditError] = useState('');
  const [showAuth, setShowAuth] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [duplicateConflict, setDuplicateConflict] = useState<DBPlayer | null>(null);
  const [renameHint, setRenameHint] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const editRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (sessionPlayers.length > 0) {
      setLocalPlayers(sessionPlayers);
    }
  }, [sessionPlayers]);

  useEffect(() => {
    if (appUser) fetchPlayers();
  }, [appUser, fetchPlayers]);

  useEffect(() => {
    if (editingId) editRef.current?.focus();
  }, [editingId]);

  const addPlayer = async () => {
    const name = input.trim();
    if (!name) return;
    if (players.some((p) => p.name.toLowerCase() === name.toLowerCase())) {
      setError('Ce prénom est déjà utilisé');
      return;
    }

    // Si connecté et nom correspond à un profil DB existant → pop-up doublon
    if (appUser) {
      const conflict = dbPlayers.find((dp) => dp.name.toLowerCase() === name.toLowerCase());
      if (conflict) {
        setDuplicateConflict(conflict);
        return;
      }
    }

    await doAddPlayer(name);
  };

  const doAddPlayer = async (name: string) => {
    const usedAvatars = players.map((p) => p.avatar ?? '');
    const avatar = randomAvatar(usedAvatars);
    let player: SessionPlayer;
    if (appUser) {
      try {
        const dbPlayer = await createPlayer(name, avatar);
        player = { id: dbPlayer.id, name: dbPlayer.name, avatar: dbPlayer.avatar ?? avatar };
      } catch {
        player = { id: `guest-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, name, avatar };
      }
    } else {
      player = { id: `guest-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, name, avatar };
    }
    setLocalPlayers((prev) => [...prev, player]);
    setInput('');
    setError('');
    setRenameHint('');
    inputRef.current?.focus();
  };

  const addDbPlayer = (dbPlayer: { id: string; name: string; avatar: string | null }) => {
    if (players.some((p) => p.id === dbPlayer.id || p.name.toLowerCase() === dbPlayer.name.toLowerCase())) return;
    const usedAvatars = players.map((p) => p.avatar ?? '');
    setLocalPlayers((prev) => [
      ...prev,
      {
        id: dbPlayer.id,
        name: dbPlayer.name,
        avatar: dbPlayer.avatar ?? randomAvatar(usedAvatars),
      },
    ]);
  };

  const removePlayer = (id: string) => {
    setLocalPlayers((prev) => prev.filter((p) => p.id !== id));
    if (editingId === id) setEditingId(null);
  };

  const startEdit = (player: SessionPlayer) => {
    setEditingId(player.id);
    setEditValue(player.name);
    setEditError('');
  };

  const confirmEdit = (id: string) => {
    const name = editValue.trim();
    if (!name) { setEditError('Le prénom ne peut pas être vide'); return; }
    if (players.some((p) => p.id !== id && p.name.toLowerCase() === name.toLowerCase())) {
      setEditError('Ce prénom est déjà utilisé');
      return;
    }
    setLocalPlayers((prev) => prev.map((p) => p.id === id ? { ...p, name } : p));
    setEditingId(null);
    setEditError('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditError('');
  };

  const handleImportConflict = () => {
    if (!duplicateConflict) return;
    const existing = players.find((p) => p.id === duplicateConflict.id);
    if (!existing) {
      setLocalPlayers((prev) => [...prev, {
        id: duplicateConflict.id,
        name: duplicateConflict.name,
        avatar: duplicateConflict.avatar ?? undefined,
      }]);
    }
    setInput('');
    setDuplicateConflict(null);
    inputRef.current?.focus();
  };

  const handleRenameConflict = () => {
    setDuplicateConflict(null);
    setRenameHint('Ce nom existe déjà — choisis un autre prénom');
    inputRef.current?.focus();
  };

  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') addPlayer().catch(() => {});
  };

  const handleEditKey = (e: KeyboardEvent<HTMLInputElement>, id: string) => {
    if (e.key === 'Enter') confirmEdit(id);
    if (e.key === 'Escape') cancelEdit();
  };

  const handleGo = () => {
    if (players.length < 1) return;
    setMode(appUser ? 'auth' : 'guest');
    setPlayers(players);
    router.push('/');
  };

  const availableDbPlayers = dbPlayers.filter(
    (dp) => !players.some((p) => p.id === dp.id || p.name.toLowerCase() === dp.name.toLowerCase()),
  );

  return (
    <div className="flex flex-col min-h-[100dvh] bg-gradient-to-b from-indigo-950 via-purple-900 to-indigo-950 px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="mb-6"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <img src="/playlink-logo.svg" alt="Playlink" width={28} height={28} />
            <span className="text-sm font-bold text-white/60 tracking-widest uppercase">Playlink</span>
          </div>
          {appUser ? (
            <button
              onClick={() => signOut()}
              className="flex items-center gap-1.5 text-white/50 text-xs hover:text-white/80 transition-colors"
            >
              <LogOut size={14} />
              Déconnexion
            </button>
          ) : (
            <button
              onClick={() => setShowAuth(true)}
              className="flex items-center gap-1.5 text-pink-400 text-xs font-semibold hover:text-pink-300 transition-colors"
            >
              <LogIn size={14} />
              Se connecter
            </button>
          )}
        </div>
        <h1 className="text-3xl font-black text-white leading-tight">
          Qui joue <span className="bg-pink-500 rounded-lg px-2">ce soir ?</span>
        </h1>
        <p className="text-white/60 text-sm mt-2">Ajoute au moins 1 joueur pour commencer</p>
      </motion.div>

      {/* Picker joueurs DB (mode auth) */}
      <AnimatePresence>
        {appUser && availableDbPlayers.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 overflow-hidden"
          >
            <p className="text-white/50 text-xs uppercase tracking-widest mb-2">Tes profils</p>
            <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-hide">
              {availableDbPlayers.map((dp) => (
                <motion.button
                  key={dp.id}
                  onClick={() => addDbPlayer(dp)}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 bg-white/10 border border-white/15 rounded-2xl px-3 py-2 shrink-0"
                >
                  <span>{dp.avatar ?? '👤'}</span>
                  <span className="text-white text-sm font-semibold">{dp.name}</span>
                  <Plus size={14} className="text-pink-400" />
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input ajout joueur guest */}
      <div className="flex gap-2 mb-1">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => { setInput(e.target.value); setError(''); setRenameHint(''); }}
          onKeyDown={handleKey}
          placeholder={appUser ? 'Nouveau joueur…' : 'Prénom du joueur…'}
          maxLength={20}
          autoFocus
          className={`flex-1 rounded-2xl bg-white/10 border text-white placeholder-white/40 px-4 py-3 text-sm outline-none focus:bg-white/15 transition-all ${error ? 'border-red-400 focus:border-red-400' : 'border-white/20 focus:border-pink-400'}`}
        />
        <motion.button
          onClick={addPlayer}
          whileTap={{ scale: 0.9 }}
          disabled={!input.trim()}
          className="w-12 h-12 rounded-2xl bg-pink-500 flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
        >
          <Plus size={20} className="text-white" />
        </motion.button>
      </div>

      <AnimatePresence>
        {(error || renameHint) && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className={`text-xs mb-2 px-1 ${renameHint && !error ? 'text-amber-400' : 'text-red-400'}`}
          >
            {error || renameHint}
          </motion.p>
        )}
      </AnimatePresence>

      {/* CTA créer profil si connecté et 0 players DB */}
      <AnimatePresence>
        {appUser && dbPlayers.length === 0 && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => { /* handled by input above */ inputRef.current?.focus(); }}
            className="flex items-center gap-2 text-white/40 text-xs mb-4 hover:text-white/60 transition-colors"
          >
            <UserPlus size={14} />
            Saisis un prénom pour créer ton premier profil
          </motion.button>
        )}
      </AnimatePresence>

      {/* Liste joueurs sélectionnés */}
      <div className="flex flex-col gap-2 flex-1 mt-2">
        <AnimatePresence initial={false}>
          {players.map((player, i) => (
            <motion.div
              key={player.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20, height: 0, marginBottom: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-white/10 rounded-2xl px-4 py-3"
            >
              {editingId === player.id ? (
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{player.avatar}</span>
                    <input
                      ref={editRef}
                      value={editValue}
                      onChange={(e) => { setEditValue(e.target.value); setEditError(''); }}
                      onKeyDown={(e) => handleEditKey(e, player.id)}
                      maxLength={20}
                      className={`flex-1 rounded-xl bg-white/10 border text-white px-3 py-1.5 text-sm outline-none transition-all ${editError ? 'border-red-400' : 'border-white/30 focus:border-pink-400'}`}
                    />
                    <button
                      onClick={() => confirmEdit(player.id)}
                      className="p-1.5 rounded-full bg-pink-500/20 hover:bg-pink-500/40 transition-colors"
                    >
                      <Check size={15} className="text-pink-400" />
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="p-1.5 rounded-full hover:bg-white/10 transition-colors"
                    >
                      <X size={15} className="text-white/50" />
                    </button>
                  </div>
                  {editError && <p className="text-red-400 text-xs pl-10">{editError}</p>}
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{player.avatar}</span>
                  <button onClick={() => startEdit(player)} className="flex-1 text-left">
                    <p className="text-white font-semibold text-sm">{player.name}</p>
                    <p className="text-white/40 text-xs">Joueur {i + 1} · Appuie pour modifier</p>
                  </button>
                  <button
                    onClick={() => removePlayer(player.id)}
                    className="p-1.5 rounded-full hover:bg-white/10 transition-colors"
                  >
                    <X size={16} className="text-white/50" />
                  </button>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {players.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-4xl mb-3">👥</p>
            <p className="text-white/40 text-sm">Aucun joueur pour l'instant</p>
          </div>
        )}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: players.length >= 1 ? 1 : 0.4, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mt-6"
      >
        <motion.button
          onClick={handleGo}
          disabled={players.length < 1}
          whileTap={{ scale: 0.97 }}
          className="w-full py-4 rounded-2xl bg-pink-500 flex items-center justify-center gap-3 disabled:cursor-not-allowed transition-all font-black text-white text-lg tracking-wide"
        >
          C&apos;est parti !
          <ArrowRight size={22} />
        </motion.button>
      </motion.div>

      <AuthModal
        open={showAuth}
        onClose={() => setShowAuth(false)}
        onSuccess={(hadGuests) => { setShowAuth(false); if (hadGuests) setShowImport(true); }}
      />
      {showImport && <ImportGuestPlayersModal onClose={() => setShowImport(false)} />}
      {duplicateConflict && (
        <DuplicatePlayerModal
          dbPlayer={duplicateConflict}
          onImport={handleImportConflict}
          onRename={handleRenameConflict}
          onClose={() => setDuplicateConflict(null)}
        />
      )}
    </div>
  );
}
