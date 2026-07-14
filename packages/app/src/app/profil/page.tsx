'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LogIn, LogOut, User, Layers, ChevronRight, Shield, FileText, HelpCircle, Pencil, Check, X } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useGameStore } from '@/store/gameStore';
import { useSessionStore } from '@/store/sessionStore';
import { AuthModal } from '@/components/AuthModal';
import { LegalModal } from '@/components/LegalModal';
import { ImportGuestPlayersModal } from '@/components/ImportGuestPlayersModal';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? '';
const CARDS_OPTIONS = [5, 10, 15];

export default function ProfilPage() {
  const { appUser, signOut, updateProfile } = useAuthStore();
  const { cardsPerGame, setCardsPerGame } = useGameStore();
  const { scores, players, phase } = useSessionStore();
  const [showAuth, setShowAuth] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [legalDoc, setLegalDoc] = useState<'privacy' | 'terms' | null>(null);
  const [supportEmail, setSupportEmail] = useState('support@playlink.app');
  const [editingProfile, setEditingProfile] = useState(false);
  const [editFirstName, setEditFirstName] = useState('');
  const [editLastName, setEditLastName] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/api/legal/support_email`)
      .then((r) => r.json())
      .then((j) => { if (j.data?.content) setSupportEmail(j.data.content); })
      .catch(() => {});
  }, []);

  const totalSessionScore = Object.values(scores).reduce((s, n) => s + n, 0);
  const sessionPlayers = players.length;
  const sessionActive = sessionPlayers > 0 && (phase === 'playing' || phase === 'voting' || phase === 'results');

  return (
    <div className="flex flex-col min-h-[100dvh] bg-gradient-to-b from-indigo-950 via-purple-900 to-indigo-950 pb-24">
      {/* Header */}
      <div className="px-4 pt-6 pb-4">
        <h1 className="text-2xl font-black text-white">Profil</h1>
        <p className="text-white/60 text-sm mt-1">Préférences et informations</p>
      </div>

      <div className="flex flex-col gap-4 px-4">
        {/* Compte */}
        <Section title="Compte">
          {appUser ? (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3 py-1">
                <div className="w-10 h-10 rounded-full bg-pink-500/20 flex items-center justify-center flex-shrink-0">
                  <User size={20} className="text-pink-400" />
                </div>
                {editingProfile ? (
                  <div className="flex-1 flex flex-col gap-2">
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        value={editFirstName}
                        onChange={(e) => setEditFirstName(e.target.value)}
                        placeholder="Prénom"
                        className="bg-white/10 rounded-xl px-3 py-2 text-white text-sm outline-none placeholder-white/30"
                      />
                      <input
                        value={editLastName}
                        onChange={(e) => setEditLastName(e.target.value)}
                        placeholder="Nom"
                        className="bg-white/10 rounded-xl px-3 py-2 text-white text-sm outline-none placeholder-white/30"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={async () => {
                          setSavingProfile(true);
                          try { await updateProfile(editFirstName, editLastName); setEditingProfile(false); }
                          finally { setSavingProfile(false); }
                        }}
                        disabled={savingProfile}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-pink-500 text-white text-sm font-semibold"
                      >
                        <Check size={14} /> Enregistrer
                      </button>
                      <button
                        onClick={() => setEditingProfile(false)}
                        className="px-3 py-2 rounded-xl bg-white/10 text-white/60"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 min-w-0">
                    {(appUser.firstName || appUser.lastName) ? (
                      <p className="text-white font-bold text-sm">{[appUser.firstName, appUser.lastName].filter(Boolean).join(' ')}</p>
                    ) : (
                      <p className="text-white/40 text-sm italic">Aucun nom renseigné</p>
                    )}
                    <p className="text-white/40 text-xs truncate">{appUser.email}</p>
                  </div>
                )}
                {!editingProfile && (
                  <button
                    onClick={() => { setEditFirstName(appUser.firstName ?? ''); setEditLastName(appUser.lastName ?? ''); setEditingProfile(true); }}
                    className="p-2 rounded-xl bg-white/5 text-white/40 hover:text-white/70 transition-colors"
                  >
                    <Pencil size={14} />
                  </button>
                )}
              </div>
              <button
                onClick={() => signOut()}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 text-red-400 text-sm font-semibold w-full hover:bg-white/10 transition-colors"
              >
                <LogOut size={16} />
                Se déconnecter
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <p className="text-white/50 text-sm">Connecte-toi pour sauvegarder tes scores et accéder au classement.</p>
              <motion.button
                onClick={() => setShowAuth(true)}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-4 py-3 rounded-xl bg-pink-500 text-white font-bold text-sm"
              >
                <LogIn size={16} />
                Se connecter / Créer un compte
              </motion.button>
            </div>
          )}
        </Section>

        {/* Préférences de jeu */}
        <Section title="Cartes par partie">
          <div className="flex gap-2">
            {CARDS_OPTIONS.map((n) => (
              <motion.button
                key={n}
                onClick={() => setCardsPerGame(n)}
                whileTap={{ scale: 0.95 }}
                className={`flex-1 py-3 rounded-xl font-black text-lg transition-all ${
                  cardsPerGame === n
                    ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/30'
                    : 'bg-white/10 text-white/60'
                }`}
              >
                {n}
              </motion.button>
            ))}
          </div>
          <p className="text-white/40 text-xs mt-2 text-center">
            Actuellement : <span className="text-white/70 font-semibold">{cardsPerGame} cartes</span> par partie
          </p>
        </Section>

        {/* Stats de session */}
        {sessionActive && (
          <Section title="Partie en cours">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/10 rounded-xl px-4 py-3 text-center">
                <p className="text-white font-black text-2xl">{sessionPlayers}</p>
                <p className="text-white/50 text-xs mt-0.5">joueur{sessionPlayers > 1 ? 's' : ''}</p>
              </div>
              <div className="bg-white/10 rounded-xl px-4 py-3 text-center">
                <p className="text-white font-black text-2xl">{totalSessionScore}</p>
                <p className="text-white/50 text-xs mt-0.5">points cumulés</p>
              </div>
            </div>
            <div className="flex flex-col gap-1.5 mt-2">
              {players.map((p) => (
                <div key={p.id} className="flex items-center gap-2 px-1">
                  <span className="text-base">{p.avatar ?? '👤'}</span>
                  <span className="text-white/80 text-sm flex-1">{p.name}</span>
                  <span className="text-white font-bold text-sm">{scores[p.id] ?? 0} pts</span>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Légal */}
        <Section title="Informations">
          <div className="flex flex-col divide-y divide-white/5">
            <LegalLink icon={<Shield size={16} />} label="Politique de confidentialité" onClick={() => setLegalDoc('privacy')} />
            <LegalLink icon={<FileText size={16} />} label="Conditions d'utilisation" onClick={() => setLegalDoc('terms')} />
            <LegalLink
              icon={<HelpCircle size={16} />}
              label="Aide et support"
              onClick={() => window.location.href = `mailto:${supportEmail}`}
            />
            <LegalLink icon={<Layers size={16} />} label="Version 2.0.0" chevron={false} />
          </div>
        </Section>
      </div>

      <AuthModal open={showAuth} onClose={() => setShowAuth(false)} onSuccess={(hadGuests) => { setShowAuth(false); if (hadGuests) setShowImport(true); }} />
      {legalDoc && <LegalModal docKey={legalDoc} onClose={() => setLegalDoc(null)} />}
      {showImport && <ImportGuestPlayersModal onClose={() => setShowImport(false)} />}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-4 flex flex-col gap-3">
      <p className="text-white/40 text-xs font-semibold uppercase tracking-widest">{title}</p>
      {children}
    </div>
  );
}

function LegalLink({ icon, label, chevron = true, onClick }: { icon: React.ReactNode; label: string; chevron?: boolean; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 py-3 text-white/70 hover:text-white transition-colors w-full text-left"
    >
      <span className="text-white/40">{icon}</span>
      <span className="flex-1 text-sm">{label}</span>
      {chevron && <ChevronRight size={16} className="text-white/30" />}
    </button>
  );
}
