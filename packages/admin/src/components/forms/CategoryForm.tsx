'use client';

import { useState, useEffect } from 'react';
import { api, apiError } from '@/lib/api';
import { slugify } from '@/lib/utils';
import { EmojiPicker } from '@/components/EmojiPicker';
import type { AdminGame, AdminCategory } from '@/types/admin';

interface CategoryFormProps {
  games: AdminGame[];
  category?: AdminCategory;
  defaultGameId?: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function CategoryForm({ games, category, defaultGameId, onSuccess, onCancel }: CategoryFormProps) {
  const isEdit = !!category;
  const [gameId, setGameId] = useState(category?.gameId ?? defaultGameId ?? games[0]?.id ?? '');
  const [name, setName] = useState(category?.name ?? '');
  const [slug, setSlug] = useState(category?.slug ?? '');
  const [slugManual, setSlugManual] = useState(isEdit);
  const [description, setDescription] = useState(category?.description ?? '');
  const [icon, setIcon] = useState(category?.icon ?? '');
  const [order, setOrder] = useState(category?.order ?? 0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slugManual) setSlug(slugify(name));
  }, [name, slugManual]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const body = {
      gameId,
      name,
      slug,
      description: description || undefined,
      icon: icon || undefined,
      ...(isEdit ? { order } : {}),
    };
    try {
      if (isEdit) {
        await api.put(`/api/admin/categories/${category.id}`, body);
      } else {
        await api.post('/api/admin/categories', body);
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

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Jeu *</label>
        <select value={gameId} onChange={(e) => setGameId(e.target.value)} required disabled={isEdit} className="input">
          {games.map((g) => (
            <option key={g.id} value={g.id}>{g.icon} {g.name}</option>
          ))}
        </select>
        {isEdit && <p className="text-xs text-gray-400 mt-1">Le jeu ne peut pas être modifié après création.</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="input" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Slug *</label>
          <input
            type="text"
            value={slug}
            onChange={(e) => { setSlug(e.target.value); setSlugManual(true); }}
            required
            className="input font-mono text-xs"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} className="input resize-none" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Icône</label>
        <EmojiPicker value={icon} onChange={setIcon} />
      </div>

      {isEdit && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ordre</label>
          <input type="number" min={0} value={order} onChange={(e) => setOrder(parseInt(e.target.value) || 0)} className="input w-32" />
        </div>
      )}

      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="btn-secondary">Annuler</button>
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? 'Enregistrement…' : isEdit ? 'Mettre à jour' : 'Créer la catégorie'}
        </button>
      </div>
    </form>
  );
}
