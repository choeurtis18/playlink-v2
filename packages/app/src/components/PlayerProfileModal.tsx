'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trophy, Gamepad2, Edit2, Trash2, Check, AlertTriangle } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useSessionStore } from '@/store/sessionStore';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? '';

interface PlayerProfile {
  id: string;
  name: string;
  avatar: string | null;
  playerType: string;
  totalScore: number;
  totalGames: number;
  tagScores: Record<string, number>;
}

interface PlayerProfileModalProps {
  playerId: string;
  onClose: () => void;
  onDeleted?: (id: string) => void;
}

export function PlayerProfileModal({ playerId, onClose, onDeleted }: PlayerProfileModalProps) {
  const { token, updatePlayer, deletePlayer } = useAuthStore();
  const { players: sessionPlayers, setPlayers } = useSessionStore(); // setPlayers used for rename sync
  const [profile, setProfile] = useState<PlayerProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Rename state
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editError, setEditError] = useState('');
  const [saving, setSaving] = useState(false);

  // Delete state
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteToast, setDeleteToast] = useState(false);

  useEffect(() => {
    if (!token) return;
    fetch(`${API_URL}/api/players/${playerId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((j) => setProfile(j.data ?? null))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [playerId, token]);

  const topTags = profile
    ? Object.entries(profile.tagScores).sort(([, a], [, b]) => b - a).slice(0, 5)
    : [];

  const handleRename = async () => {
    const name = editName.trim();
    if (!name) { setEditError('Le nom ne peut pas être vide'); return; }
    setSaving(true);
    setEditError('');
    try {
      await updatePlayer(playerId, name);
      setProfile((p) => p ? { ...p, name } : p);
      // Mettre à jour le nom dans la session si ce joueur est en cours
      const updated = sessionPlayers.map((p) => p.id === playerId ? { ...p, name } : p);
      setPlayers(updated);
      setEditing(false);
    } catch (err) {
      setEditError((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (sessionPlayers.some((p) => p.id === playerId)) {
      setConfirmDelete(false);
      setDeleteToast(true);
      setTimeout(() => setDeleteToast(false), 3500);
      return;
    }
    setDeleting(true);
    try {
      await deletePlayer(playerId);
      onDeleted?.(playerId);
      onClose();
    } catch {
      setDeleting(false);
      setConfirmDelete(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 16 }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        className="fixed inset-0 z-50 flex items-center justify-center px-4"
      >
        <div className="w-full max-w-sm bg-indigo-950 border border-white/10 rounded-3xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
            <h2 className="text-white font-bold text-base">Profil joueur</h2>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 transition-colors">
              <X size={18} className="text-white/60" />
            </button>
          </div>

          <div className="px-5 py-5">
            {loading ? (
              <div className="flex justify-center py-8">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                  <Gamepad2 size={28} className="text-white/30" />
                </motion.div>
              </div>
            ) : !profile ? (
              <p className="text-white/50 text-sm text-center py-8">Profil non disponible</p>
            ) : (
              <div className="flex flex-col gap-5">
                {/* Avatar + nom + type */}
                <div className="flex flex-col items-center gap-2">
                  <span className="text-5xl">{profile.avatar ?? '👤'}</span>

                  {editing ? (
                    <div className="flex flex-col items-center gap-1.5 w-full">
                      <div className="flex items-center gap-2 w-full max-w-[200px]">
                        <input
                          autoFocus
                          value={editName}
                          onChange={(e) => { setEditName(e.target.value); setEditError(''); }}
                          onKeyDown={(e) => { if (e.key === 'Enter') handleRename(); if (e.key === 'Escape') setEditing(false); }}
                          maxLength={20}
                          className={`flex-1 bg-white/10 border rounded-xl px-3 py-1.5 text-white text-center text-base font-black outline-none ${editError ? 'border-red-400' : 'border-white/30 focus:border-pink-400'}`}
                        />
                        <button
                          onClick={handleRename}
                          disabled={saving}
                          className="p-1.5 rounded-full bg-pink-500/20 hover:bg-pink-500/40 transition-colors"
                        >
                          <Check size={15} className="text-pink-400" />
                        </button>
                        <button onClick={() => { setEditing(false); setEditError(''); }} className="p-1.5 rounded-full hover:bg-white/10 transition-colors">
                          <X size={15} className="text-white/50" />
                        </button>
                      </div>
                      {editError && <p className="text-red-400 text-xs">{editError}</p>}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <p className="text-white font-black text-xl">{profile.name}</p>
                      {token && (
                        <button
                          onClick={() => { setEditName(profile.name); setEditing(true); }}
                          className="p-1.5 rounded-full hover:bg-white/10 transition-colors"
                        >
                          <Edit2 size={14} className="text-white/40" />
                        </button>
                      )}
                    </div>
                  )}

                  <span className="bg-pink-500/20 text-pink-300 text-xs font-semibold px-3 py-1 rounded-full">
                    {profile.playerType}
                  </span>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/10 rounded-2xl px-4 py-3 text-center">
                    <Trophy size={18} className="text-yellow-400 mx-auto mb-1" />
                    <p className="text-white font-black text-xl">{profile.totalScore}</p>
                    <p className="text-white/50 text-xs">points</p>
                  </div>
                  <div className="bg-white/10 rounded-2xl px-4 py-3 text-center">
                    <Gamepad2 size={18} className="text-pink-400 mx-auto mb-1" />
                    <p className="text-white font-black text-xl">{profile.totalGames}</p>
                    <p className="text-white/50 text-xs">partie{profile.totalGames > 1 ? 's' : ''}</p>
                  </div>
                </div>

                {/* Top tags */}
                {topTags.length > 0 && (
                  <div>
                    <p className="text-white/50 text-xs uppercase tracking-widest mb-2">Points forts</p>
                    <div className="flex flex-col gap-2">
                      {topTags.map(([tag, score]) => (
                        <div key={tag} className="flex items-center gap-3">
                          <p className="text-white text-sm capitalize flex-1">{tag}</p>
                          <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${Math.min(100, (score / (topTags[0][1] || 1)) * 100)}%` }}
                              transition={{ duration: 0.6, ease: 'easeOut' }}
                              className="h-full bg-pink-500 rounded-full"
                            />
                          </div>
                          <p className="text-white/50 text-xs w-6 text-right">{score}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Supprimer */}
                {token && (
                  confirmDelete ? (
                    <div className="flex flex-col gap-2 bg-red-500/10 border border-red-500/20 rounded-2xl px-4 py-3">
                      <div className="flex items-center gap-2">
                        <AlertTriangle size={16} className="text-red-400 shrink-0" />
                        <p className="text-red-300 text-xs">Supprimer définitivement ce profil et tous ses scores ?</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={handleDelete}
                          disabled={deleting}
                          className="flex-1 py-2 rounded-xl bg-red-500 text-white text-xs font-bold"
                        >
                          {deleting ? 'Suppression…' : 'Confirmer'}
                        </button>
                        <button
                          onClick={() => setConfirmDelete(false)}
                          className="flex-1 py-2 rounded-xl bg-white/10 text-white/60 text-xs font-bold"
                        >
                          Annuler
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmDelete(true)}
                      className="flex items-center justify-center gap-2 py-2.5 rounded-2xl bg-white/5 hover:bg-red-500/10 text-red-400/70 hover:text-red-400 text-sm font-semibold transition-colors w-full"
                    >
                      <Trash2 size={15} />
                      Supprimer ce profil
                    </button>
                  )
                )}
              </div>
            )}
          </div>
        </div>
      </motion.div>
      <AnimatePresence>
        {deleteToast && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            className="fixed bottom-24 inset-x-0 z-[60] flex justify-center px-4"
          >
            <div className="flex items-center gap-2 bg-red-500 text-white text-sm font-semibold px-4 py-3 rounded-2xl shadow-lg max-w-sm w-full">
              <AlertTriangle size={16} className="shrink-0" />
              Ce joueur est dans la session en cours. Retire-le d'abord.
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </AnimatePresence>
  );
}
