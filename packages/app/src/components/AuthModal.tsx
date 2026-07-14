'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, Loader2, Eye, EyeOff, User } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useSessionStore } from '@/store/sessionStore';

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: (hadGuestPlayers: boolean) => void;
}

export function AuthModal({ open, onClose, onSuccess }: AuthModalProps) {
  const { signIn, signUp, isLoading } = useAuthStore();
  const { players } = useSessionStore();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    try {
      if (mode === 'signup') {
        if (password !== confirmPassword) { setError('Les mots de passe ne correspondent pas.'); return; }
        await signUp(email, password, firstName, lastName);
        setSuccessMsg('Compte créé ! Tu peux jouer.');
        const hadGuestPlayers = players.some((p) => p.id.startsWith('guest-'));
        onSuccess?.(hadGuestPlayers);
        onClose();
      } else {
        await signIn(email, password);
        const hadGuestPlayers = players.some((p) => p.id.startsWith('guest-'));
        onSuccess?.(hadGuestPlayers);
        onClose();
      }
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
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
                <h2 className="text-white font-bold text-base">
                  {mode === 'login' ? 'Se connecter' : 'Créer un compte'}
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-white/10 transition-colors"
                >
                  <X size={18} className="text-white/60" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="px-5 py-5 flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  {mode === 'signup' && (
                    <>
                      <div className="flex items-center gap-3 bg-white/10 rounded-2xl px-4 py-3">
                        <User size={16} className="text-white/40 shrink-0" />
                        <input
                          type="text"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          placeholder="Prénom"
                          required
                          className="flex-1 bg-transparent text-white placeholder-white/40 text-sm outline-none"
                        />
                      </div>
                      <div className="flex items-center gap-3 bg-white/10 rounded-2xl px-4 py-3">
                        <User size={16} className="text-white/40 shrink-0" />
                        <input
                          type="text"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          placeholder="Nom"
                          required
                          className="flex-1 bg-transparent text-white placeholder-white/40 text-sm outline-none"
                        />
                      </div>
                    </>
                  )}
                  <div className="flex items-center gap-3 bg-white/10 rounded-2xl px-4 py-3">
                    <Mail size={16} className="text-white/40 shrink-0" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email"
                      required
                      className="flex-1 bg-transparent text-white placeholder-white/40 text-sm outline-none"
                    />
                  </div>
                  <div className="flex items-center gap-3 bg-white/10 rounded-2xl px-4 py-3">
                    <Lock size={16} className="text-white/40 shrink-0" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Mot de passe"
                      required
                      minLength={6}
                      className="flex-1 bg-transparent text-white placeholder-white/40 text-sm outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="text-white/40 hover:text-white/70 transition-colors"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {mode === 'signup' && (
                    <div className="flex items-center gap-3 bg-white/10 rounded-2xl px-4 py-3">
                      <Lock size={16} className="text-white/40 shrink-0" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirmer le mot de passe"
                        required
                        minLength={6}
                        className="flex-1 bg-transparent text-white placeholder-white/40 text-sm outline-none"
                      />
                    </div>
                  )}
                </div>

                <AnimatePresence>
                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-red-400 text-xs text-center"
                    >
                      {error}
                    </motion.p>
                  )}
                  {successMsg && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-green-400 text-xs text-center"
                    >
                      {successMsg}
                    </motion.p>
                  )}
                </AnimatePresence>

                <motion.button
                  type="submit"
                  disabled={isLoading}
                  whileTap={{ scale: 0.97 }}
                  className="w-full py-3 rounded-2xl bg-pink-500 text-white font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {isLoading && <Loader2 size={16} className="animate-spin" />}
                  {mode === 'login' ? 'Se connecter' : 'Créer mon compte'}
                </motion.button>

                <button
                  type="button"
                  onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); setSuccessMsg(''); setFirstName(''); setLastName(''); setConfirmPassword(''); }}
                  className="text-white/50 text-xs text-center hover:text-white/80 transition-colors"
                >
                  {mode === 'login'
                    ? "Pas encore de compte ? S'inscrire"
                    : 'Déjà un compte ? Se connecter'}
                </button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
