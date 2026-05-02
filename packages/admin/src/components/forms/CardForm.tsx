'use client';

import { useState, useEffect } from 'react';
import { api, apiError } from '@/lib/api';
import type { AdminGame, AdminCategory, AdminCard } from '@/types/admin';

interface CardFormProps {
  games: AdminGame[];
  card?: AdminCard;
  defaultCategoryId?: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function CardForm({ games, card, defaultCategoryId, onSuccess, onCancel }: CardFormProps) {
  const isEdit = !!card;

  const [selectedGameId, setSelectedGameId] = useState(
    card?.category.game.id ?? games[0]?.id ?? '',
  );
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [categoryId, setCategoryId] = useState(card?.categoryId ?? defaultCategoryId ?? '');
  const [text, setText] = useState(card?.text ?? '');
  const [difficulty, setDifficulty] = useState<string>(card?.difficulty ?? '');
  const [tags, setTags] = useState(card?.tags.join(', ') ?? '');
  const [active, setActive] = useState(card?.active ?? true);
  const [order, setOrder] = useState(card?.order ?? 0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedGameId) return;
    api.get<{ data: AdminCategory[] }>(`/api/admin/categories?gameId=${selectedGameId}&limit=100`)
      .then((res) => {
        setCategories(res.data.data);
        if (!isEdit && !defaultCategoryId) setCategoryId(res.data.data[0]?.id ?? '');
      })
      .catch(() => {});
  }, [selectedGameId, isEdit, defaultCategoryId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const tagsArray = tags.split(',').map((t) => t.trim()).filter(Boolean);
    const body = {
      categoryId,
      text,
      difficulty: difficulty || undefined,
      tags: tagsArray,
      ...(isEdit ? { active, order } : {}),
    };
    try {
      if (isEdit) {
        await api.put(`/api/admin/cards/${card.id}`, body);
      } else {
        await api.post('/api/admin/cards', body);
      }
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
          <label className="block text-sm font-medium text-gray-700 mb-1">Jeu *</label>
          <select value={selectedGameId} onChange={(e) => setSelectedGameId(e.target.value)} className="input" disabled={isEdit}>
            {games.map((g) => (
              <option key={g.id} value={g.id}>{g.icon} {g.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie *</label>
          <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required disabled={isEdit} className="input">
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          {isEdit && <p className="text-xs text-gray-400 mt-1">La catégorie ne peut pas être modifiée.</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Texte de la carte * <span className="text-gray-400 font-normal">({text.length}/500)</span>
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
          maxLength={500}
          rows={3}
          className="input resize-none"
          placeholder="Texte de la carte..."
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Difficulté</label>
          <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className="input">
            <option value="">Aucune</option>
            <option value="easy">Facile</option>
            <option value="medium">Moyen</option>
            <option value="hard">Difficile</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tags (virgule séparés)</label>
          <input type="text" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="tag1, tag2" className="input" />
        </div>
      </div>

      {isEdit && (
        <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-100">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ordre</label>
            <input type="number" min={0} value={order} onChange={(e) => setOrder(parseInt(e.target.value) || 0)} className="input" />
          </div>
          <div className="flex items-end pb-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-indigo-600" />
              <span className="text-sm font-medium text-gray-700">Actif</span>
            </label>
          </div>
        </div>
      )}

      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="btn-secondary">Annuler</button>
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? 'Enregistrement…' : isEdit ? 'Mettre à jour' : 'Créer la carte'}
        </button>
      </div>
    </form>
  );
}
