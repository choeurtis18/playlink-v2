'use client';

import { useState, useEffect } from 'react';
import { Eye, Save, Edit3 } from 'lucide-react';
import { api, apiError } from '@/lib/api';
import { MarkdownPreview } from '@/components/MarkdownPreview';
import type { AdminGame } from '@/types/admin';

const PLACEHOLDER = `## Comment jouer

Décris ici les règles du jeu en **Markdown**.

### Préparation
- Premier point
- Deuxième point

### Déroulement
1. Première étape
2. Deuxième étape

### Astuce
Utilise *l'italique* ou **gras** pour mettre en valeur.`;

export default function GameRulesPage() {
  const [games, setGames] = useState<AdminGame[]>([]);
  const [selectedGameId, setSelectedGameId] = useState('');
  const [rules, setRules] = useState('');
  const [loadingGames, setLoadingGames] = useState(true);
  const [loadingRules, setLoadingRules] = useState(false);
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    api.get<{ data: AdminGame[] }>('/api/admin/games?limit=100')
      .then((res) => {
        setGames(res.data.data);
        if (res.data.data[0]) setSelectedGameId(res.data.data[0].id);
      })
      .catch(() => setError('Impossible de charger les jeux.'))
      .finally(() => setLoadingGames(false));
  }, []);

  useEffect(() => {
    if (!selectedGameId) return;
    setLoadingRules(true);
    setError(null);
    setSuccess(null);
    api.get<{ data: { rules: string } }>(`/api/admin/games/${selectedGameId}/rules`)
      .then((res) => setRules(res.data.data.rules ?? ''))
      .catch(() => setRules(''))
      .finally(() => setLoadingRules(false));
  }, [selectedGameId]);

  const handleSave = async () => {
    if (!selectedGameId) return;
    if (rules.trim().length < 10) {
      setError('Les règles doivent contenir au moins 10 caractères.');
      return;
    }
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      await api.put(`/api/admin/games/${selectedGameId}/rules`, { rules });
      setSuccess('Règles sauvegardées avec succès.');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(apiError(err));
    } finally {
      setSaving(false);
    }
  };

  const selectedGame = games.find((g) => g.id === selectedGameId);

  return (
    <div className="p-8 max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold">Règles du jeu</h1>
          <p className="text-sm text-gray-500 mt-0.5">Éditez les règles affichées aux joueurs (Markdown)</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPreview((p) => !p)}
            className="btn-secondary flex items-center gap-2"
            type="button"
          >
            {preview ? <Edit3 size={15} /> : <Eye size={15} />}
            {preview ? 'Éditer' : 'Aperçu'}
          </button>
          <button
            onClick={handleSave}
            disabled={saving || loadingRules || !selectedGameId}
            className="btn-primary flex items-center gap-2"
            type="button"
          >
            <Save size={15} />
            {saving ? 'Sauvegarde…' : 'Sauvegarder'}
          </button>
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded-lg mb-4">
          {error}
        </p>
      )}
      {success && (
        <p className="text-sm text-green-700 bg-green-50 border border-green-200 px-3 py-2 rounded-lg mb-4">
          {success}
        </p>
      )}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
          <label className="block text-sm font-medium text-gray-700 mb-1">Jeu</label>
          <select
            value={selectedGameId}
            onChange={(e) => setSelectedGameId(e.target.value)}
            disabled={loadingGames}
            className="input w-full max-w-md"
          >
            {games.map((g) => (
              <option key={g.id} value={g.id}>
                {g.icon ?? '🎲'} {g.name}
              </option>
            ))}
          </select>
          {selectedGame && (
            <p className="text-xs text-gray-400 mt-2">
              Slug : <code className="font-mono">{selectedGame.slug}</code>
            </p>
          )}
        </div>

        <div className="p-4">
          {loadingRules ? (
            <p className="text-sm text-gray-400 py-12 text-center">Chargement…</p>
          ) : preview ? (
            <div className="min-h-[400px] border border-gray-200 rounded-lg p-4 bg-gray-50">
              <MarkdownPreview content={rules} />
            </div>
          ) : (
            <textarea
              value={rules}
              onChange={(e) => setRules(e.target.value)}
              placeholder={PLACEHOLDER}
              className="input font-mono text-sm w-full min-h-[400px] resize-y leading-relaxed"
            />
          )}
          <p className="text-xs text-gray-400 mt-2">
            {rules.length} / 5000 caractères · Supporte Markdown (## titres, **gras**, *italique*, listes)
          </p>
        </div>
      </div>
    </div>
  );
}
