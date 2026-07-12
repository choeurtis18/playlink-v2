'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, UserPlus, RefreshCw } from 'lucide-react';
import { useAuthStore, type DBPlayer } from '@/store/authStore';
import { useSessionStore, type SessionPlayer } from '@/store/sessionStore';

interface PlayerImportState {
  player: SessionPlayer;
  // 'import' = utiliser profil DB existant, 'create' = créer nouveau, 'rename' = créer avec nouveau nom
  action: 'import' | 'create' | 'rename';
  conflict: DBPlayer | null; // profil DB qui a le même nom
  newName: string;
  nameError: string;
}

interface ImportGuestPlayersModalProps {
  onClose: () => void;
}

export function ImportGuestPlayersModal({ onClose }: ImportGuestPlayersModalProps) {
  const { dbPlayers, createPlayer } = useAuthStore();
  const { players: sessionPlayers, setPlayers } = useSessionStore();

  const guestPlayers = sessionPlayers.filter((p) => p.id.startsWith('guest-'));

  const [states, setStates] = useState<PlayerImportState[]>(() =>
    guestPlayers.map((p) => {
      const conflict = dbPlayers.find((dp) => dp.name.toLowerCase() === p.name.toLowerCase()) ?? null;
      return {
        player: p,
        action: conflict ? 'import' : 'create',
        conflict,
        newName: '',
        nameError: '',
      };
    })
  );

  const [saving, setSaving] = useState(false);

  if (guestPlayers.length === 0) { onClose(); return null; }

  const setAction = (idx: number, action: 'import' | 'create' | 'rename') => {
    setStates((prev) => prev.map((s, i) => i === idx ? { ...s, action, newName: '', nameError: '' } : s));
  };

  const setNewName = (idx: number, name: string) => {
    setStates((prev) => prev.map((s, i) => i === idx ? { ...s, newName: name, nameError: '' } : s));
  };

  const validate = (): boolean => {
    const errors: Record<number, string> = {};

    states.forEach((s, i) => {
      if (s.action !== 'rename') return;
      const name = s.newName.trim();
      if (!name) { errors[i] = 'Le nom ne peut pas être vide'; return; }
      const takenByDb = dbPlayers.some((dp) => dp.name.toLowerCase() === name.toLowerCase());
      const takenByOther = states.some((other, j) => j !== i && other.action === 'rename' && other.newName.trim().toLowerCase() === name.toLowerCase());
      if (takenByDb || takenByOther) { errors[i] = 'Ce nom est déjà utilisé'; }
    });

    if (Object.keys(errors).length > 0) {
      setStates((prev) => prev.map((s, i) => errors[i] ? { ...s, nameError: errors[i] } : s));
      return false;
    }
    return true;
  };

  const handleConfirm = async () => {
    if (!validate()) return;
    setSaving(true);

    const updatedPlayers = [...sessionPlayers];

    for (const s of states) {
      const idx = updatedPlayers.findIndex((p) => p.id === s.player.id);
      if (idx === -1) continue;

      if (s.action === 'import' && s.conflict) {
        // Remplacer le guest par le profil DB existant
        updatedPlayers[idx] = { id: s.conflict.id, name: s.conflict.name, avatar: s.conflict.avatar ?? s.player.avatar };
      } else if (s.action === 'create') {
        // Créer un nouveau profil DB avec le nom existant
        try {
          const created = await createPlayer(s.player.name, s.player.avatar ?? '🎭');
          updatedPlayers[idx] = { id: created.id, name: created.name, avatar: created.avatar ?? s.player.avatar };
        } catch { /* garder le guest si erreur */ }
      } else if (s.action === 'rename') {
        // Créer un nouveau profil DB avec le nouveau nom
        try {
          const created = await createPlayer(s.newName.trim(), s.player.avatar ?? '🎭');
          updatedPlayers[idx] = { id: created.id, name: created.name, avatar: created.avatar ?? s.player.avatar };
        } catch { /* garder le guest si erreur */ }
      }
    }

    setPlayers(updatedPlayers);
    setSaving(false);
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        key="import-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 backdrop-blur-sm bg-black/60"
      />
      <motion.div
        key="import-sheet"
        initial={{ opacity: 0, y: '100%' }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 32 }}
        className="fixed inset-x-0 bottom-0 z-50 max-w-md mx-auto"
      >
        <div className="bg-indigo-950 rounded-t-3xl border-t border-white/10 px-5 pt-5 pb-8 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-white font-bold text-base">Joueurs en session</h2>
              <p className="text-white/50 text-xs mt-0.5">Que faire avec tes joueurs invités ?</p>
            </div>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 transition-colors">
              <X size={18} className="text-white/60" />
            </button>
          </div>

          <div className="flex flex-col gap-3">
            {states.map((s, idx) => (
              <div key={s.player.id} className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3 flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{s.player.avatar ?? '👤'}</span>
                  <p className="text-white font-bold text-sm">{s.player.name}</p>
                  {s.conflict && (
                    <span className="text-xs text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full">Nom déjà utilisé</span>
                  )}
                </div>

                {s.conflict ? (
                  // Conflit : import ou renommer
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setAction(idx, 'import')}
                        className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${s.action === 'import' ? 'bg-pink-500 text-white' : 'bg-white/10 text-white/60'}`}
                      >
                        Importer le profil existant
                      </button>
                      <button
                        onClick={() => setAction(idx, 'rename')}
                        className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${s.action === 'rename' ? 'bg-pink-500 text-white' : 'bg-white/10 text-white/60'}`}
                      >
                        Créer avec nouveau nom
                      </button>
                    </div>
                    {s.action === 'import' && s.conflict && (
                      <p className="text-white/40 text-xs px-1">Le profil "{s.conflict.name}" existant sera utilisé pour cette session.</p>
                    )}
                    {s.action === 'rename' && (
                      <div className="flex flex-col gap-1">
                        <input
                          type="text"
                          value={s.newName}
                          onChange={(e) => setNewName(idx, e.target.value)}
                          placeholder="Nouveau nom…"
                          maxLength={20}
                          className={`rounded-xl bg-white/10 border text-white placeholder-white/30 px-3 py-2 text-sm outline-none ${s.nameError ? 'border-red-400' : 'border-white/20 focus:border-pink-400'}`}
                        />
                        {s.nameError && <p className="text-red-400 text-xs px-1">{s.nameError}</p>}
                      </div>
                    )}
                  </div>
                ) : (
                  // Pas de conflit : créer profil
                  <p className="text-white/40 text-xs">Un nouveau profil sera créé dans ton compte.</p>
                )}
              </div>
            ))}
          </div>

          <motion.button
            onClick={handleConfirm}
            disabled={saving}
            whileTap={{ scale: 0.97 }}
            className="w-full py-3.5 rounded-2xl bg-pink-500 text-white font-bold flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {saving ? <RefreshCw size={16} className="animate-spin" /> : <UserPlus size={16} />}
            {saving ? 'Sauvegarde…' : 'Confirmer'}
          </motion.button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
