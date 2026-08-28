'use client';

import { useState, useEffect } from 'react';
import { api, apiError } from '@/lib/api';
import { INTENSITY_LEVELS, INTENSITY_LABELS, INTENSITY_DEFAULT } from '@playlink/shared';
import type { AdminGame, AdminCategory } from '@/types/admin';

interface BulkImportFormProps {
  games: AdminGame[];
  defaultGameId?: string;
  defaultCategoryId?: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function BulkImportForm({ games, defaultGameId, defaultCategoryId, onSuccess, onCancel }: BulkImportFormProps) {
  const [selectedGameId, setSelectedGameId] = useState(defaultGameId ?? games[0]?.id ?? '');
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [categoryId, setCategoryId] = useState(defaultCategoryId ?? '');
  const [rawText, setRawText] = useState('');
  const [defaultIntensity, setDefaultIntensity] = useState<number>(INTENSITY_DEFAULT);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedGameId) return;
    api.get<{ data: AdminCategory[] }>(`/api/admin/categories?gameId=${selectedGameId}&limit=100`)
      .then((res) => {
        setCategories(res.data.data);
        if (!defaultCategoryId) setCategoryId(res.data.data[0]?.id ?? '');
      })
      .catch(() => {});
  }, [selectedGameId, defaultCategoryId]);

  // Chaque ligne : "texte" ou "texte | intensité" (l'intensité par ligne prime sur celle du lot)
  const cards = rawText
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .map((line) => {
      const match = line.match(/^(.*?)\s*\|\s*([1-5])$/);
      if (match) return { text: match[1].trim(), intensity: Number(match[2]) };
      return { text: line, intensity: defaultIntensity };
    })
    .filter((c) => c.text.length > 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cards.length === 0) { setError('Ajoutez au moins une carte.'); return; }
    setLoading(true);
    setError(null);
    try {
      await api.post('/api/admin/bulk-import', {
        categoryId,
        cards,
      });
      onSuccess();
    } catch (err) {
      setError(apiError(err));
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded-lg">{error}</p>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Jeu</label>
          <select value={selectedGameId} onChange={(e) => setSelectedGameId(e.target.value)} className="input">
            {games.map((g) => (
              <option key={g.id} value={g.id}>{g.icon} {g.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie *</label>
          <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required className="input">
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Intensité par défaut</label>
        <select
          value={defaultIntensity}
          onChange={(e) => setDefaultIntensity(Number(e.target.value))}
          className="input"
        >
          {INTENSITY_LEVELS.map((level) => (
            <option key={level} value={level}>{level} — {INTENSITY_LABELS[level]}</option>
          ))}
        </select>
        <p className="text-xs text-gray-500 mt-1">
          Appliquée aux lignes sans intensité explicite.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Cartes — une par ligne
          {cards.length > 0 && (
            <span className="ml-2 text-indigo-600 font-normal">{cards.length} carte{cards.length > 1 ? 's' : ''}</span>
          )}
        </label>
        <textarea
          value={rawText}
          onChange={(e) => setRawText(e.target.value)}
          rows={10}
          className="input resize-none font-mono text-xs leading-relaxed"
          placeholder={"Tu as déjà menti à tes parents sur où tu étais ? | 2\nTu préfères la plage ou la montagne ?"}
        />
        <p className="text-xs text-gray-500 mt-1">
          Ajoutez <code className="bg-gray-100 px-1 rounded">| 1</code> à <code className="bg-gray-100 px-1 rounded">| 5</code> en fin de ligne pour fixer l&apos;intensité d&apos;une carte.
        </p>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="btn-secondary">Annuler</button>
        <button type="submit" disabled={loading || cards.length === 0} className="btn-primary">
          {loading ? 'Import en cours…' : `Importer ${cards.length} carte${cards.length > 1 ? 's' : ''}`}
        </button>
      </div>
    </form>
  );
}
