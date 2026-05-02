'use client';

import { useState, useEffect } from 'react';
import { api, apiError } from '@/lib/api';
import { slugify } from '@/lib/utils';
import { EmojiPicker } from '@/components/EmojiPicker';
import type { AdminGame } from '@/types/admin';

interface GameFormProps {
  game?: AdminGame;
  onSuccess: () => void;
  onCancel: () => void;
}

export function GameForm({ game, onSuccess, onCancel }: GameFormProps) {
  const isEdit = !!game;
  const [name, setName] = useState(game?.name ?? '');
  const [slug, setSlug] = useState(game?.slug ?? '');
  const [slugManual, setSlugManual] = useState(isEdit);
  const [description, setDescription] = useState(game?.description ?? '');
  const [icon, setIcon] = useState(game?.icon ?? '');
  const [colorMain, setColorMain] = useState(game?.colorMain ?? '#6366f1');
  const [colorSecondary, setColorSecondary] = useState(game?.colorSecondary ?? '#818cf8');
  const [active, setActive] = useState(game?.active ?? true);
  const [order, setOrder] = useState(game?.order ?? 0);
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
      name,
      slug,
      description: description || undefined,
      icon: icon || undefined,
      colorMain,
      colorSecondary,
      ...(isEdit ? { active, order } : {}),
    };
    try {
      if (isEdit) {
        await api.put(`/api/admin/games/${game.id}`, body);
      } else {
        await api.post('/api/admin/games', body);
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

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Icône (emoji)</label>
          <EmojiPicker value={icon} onChange={setIcon} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Couleur principale</label>
          <div className="flex gap-2">
            <input type="color" value={colorMain} onChange={(e) => setColorMain(e.target.value)} className="h-[38px] w-10 rounded-lg border border-gray-300 cursor-pointer p-0.5" />
            <input type="text" value={colorMain} onChange={(e) => setColorMain(e.target.value)} className="input font-mono text-xs" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Couleur secondaire</label>
          <div className="flex gap-2">
            <input type="color" value={colorSecondary} onChange={(e) => setColorSecondary(e.target.value)} className="h-[38px] w-10 rounded-lg border border-gray-300 cursor-pointer p-0.5" />
            <input type="text" value={colorSecondary} onChange={(e) => setColorSecondary(e.target.value)} className="input font-mono text-xs" />
          </div>
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
          {loading ? 'Enregistrement…' : isEdit ? 'Mettre à jour' : 'Créer le jeu'}
        </button>
      </div>
    </form>
  );
}
