'use client';

import { useState, useEffect } from 'react';
import { api, apiError } from '@/lib/api';
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

  const cards = rawText
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cards.length === 0) { setError('Ajoutez au moins une carte.'); return; }
    setLoading(true);
    setError(null);
    try {
      await api.post('/api/admin/bulk-import', {
        categoryId,
        cards: cards.map((text) => ({ text })),
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
          placeholder={"Tu as déjà menti à tes parents sur où tu étais ?\nTu préfères la plage ou la montagne ?"}
        />
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
