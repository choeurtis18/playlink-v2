'use client';

import { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, Save, GripVertical, ImageIcon, X, ChevronUp, ChevronDown } from 'lucide-react';
import { api, apiError } from '@/lib/api';
import type { AdminGame } from '@/types/admin';

interface Slide {
  id: string;
  order: number;
  imageUrl: string | null;
  title: string;
  content: string;
}

const EMPTY_SLIDE = { title: '', content: '', imageUrl: null };

export default function GameRulesPage() {
  const [games, setGames] = useState<AdminGame[]>([]);
  const [selectedGameId, setSelectedGameId] = useState('');
  const [slides, setSlides] = useState<Slide[]>([]);
  const [loadingGames, setLoadingGames] = useState(true);
  const [loadingSlides, setLoadingSlides] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [newSlide, setNewSlide] = useState(EMPTY_SLIDE);
  const [showNew, setShowNew] = useState(false);
  const [creating, setCreating] = useState(false);
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const flash = (msg: string) => { setSuccess(msg); setTimeout(() => setSuccess(null), 3000); };

  useEffect(() => {
    api.get<{ data: AdminGame[] }>('/api/admin/games?limit=100')
      .then((r) => {
        setGames(r.data.data);
        if (r.data.data[0]) setSelectedGameId(r.data.data[0].id);
      })
      .catch(() => setError('Impossible de charger les jeux.'))
      .finally(() => setLoadingGames(false));
  }, []);

  useEffect(() => {
    if (!selectedGameId) return;
    setLoadingSlides(true);
    setError(null);
    setSlides([]);
    api.get<{ data: Slide[] }>(`/api/admin/games/${selectedGameId}/rule-slides`)
      .then((r) => setSlides(r.data.data))
      .catch(() => setError('Impossible de charger les slides.'))
      .finally(() => setLoadingSlides(false));
  }, [selectedGameId]);

  const updateLocal = (id: string, patch: Partial<Slide>) => {
    setSlides((prev) => prev.map((s) => s.id === id ? { ...s, ...patch } : s));
  };

  const handleSaveSlide = async (slide: Slide) => {
    setSavingId(slide.id);
    setError(null);
    try {
      await api.patch(`/api/admin/games/${selectedGameId}/rule-slides/${slide.id}`, {
        title: slide.title,
        content: slide.content,
        imageUrl: slide.imageUrl,
      });
      flash('Slide sauvegardée.');
    } catch (err) { setError(apiError(err)); }
    finally { setSavingId(null); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer cette slide ?')) return;
    setDeletingId(id);
    try {
      await api.delete(`/api/admin/games/${selectedGameId}/rule-slides/${id}`);
      setSlides((prev) => prev.filter((s) => s.id !== id));
      flash('Slide supprimée.');
    } catch (err) { setError(apiError(err)); }
    finally { setDeletingId(null); }
  };

  const handleCreate = async () => {
    if (!newSlide.title.trim() || !newSlide.content.trim()) {
      setError('Le titre et le contenu sont requis.');
      return;
    }
    setCreating(true);
    setError(null);
    try {
      const r = await api.post<{ data: Slide }>(`/api/admin/games/${selectedGameId}/rule-slides`, newSlide);
      setSlides((prev) => [...prev, r.data.data]);
      setNewSlide(EMPTY_SLIDE);
      setShowNew(false);
      flash('Slide créée.');
    } catch (err) { setError(apiError(err)); }
    finally { setCreating(false); }
  };

  const handleUpload = async (slideId: string, file: File) => {
    setUploadingId(slideId);
    setError(null);
    try {
      const form = new FormData();
      form.append('file', file);
      const r = await api.post<{ data: { url: string } }>('/api/admin/upload', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const url = r.data.data.url;
      updateLocal(slideId, { imageUrl: url });
      await api.patch(`/api/admin/games/${selectedGameId}/rule-slides/${slideId}`, { imageUrl: url });
      flash('Image uploadée.');
    } catch (err) { setError(apiError(err)); }
    finally { setUploadingId(null); }
  };

  const handleMoveUp = async (index: number) => {
    if (index === 0) return;
    const next = [...slides];
    [next[index - 1], next[index]] = [next[index], next[index - 1]];
    const updated = next.map((s, i) => ({ ...s, order: i }));
    setSlides(updated);
    try {
      await Promise.all(updated.map((s) =>
        api.patch(`/api/admin/games/${selectedGameId}/rule-slides/${s.id}`, { order: s.order })
      ));
    } catch (err) { setError(apiError(err)); }
  };

  const handleMoveDown = async (index: number) => {
    if (index === slides.length - 1) return;
    const next = [...slides];
    [next[index], next[index + 1]] = [next[index + 1], next[index]];
    const updated = next.map((s, i) => ({ ...s, order: i }));
    setSlides(updated);
    try {
      await Promise.all(updated.map((s) =>
        api.patch(`/api/admin/games/${selectedGameId}/rule-slides/${s.id}`, { order: s.order })
      ));
    } catch (err) { setError(apiError(err)); }
  };

  const selectedGame = games.find((g) => g.id === selectedGameId);

  return (
    <div className="p-8 max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold">Règles du jeu</h1>
          <p className="text-sm text-gray-500 mt-0.5">Slides affichées dans le swiper de règles</p>
        </div>
        <button
          onClick={() => { setShowNew(true); setError(null); }}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={15} />
          Nouvelle slide
        </button>
      </div>

      {/* Sélecteur de jeu */}
      <div className="bg-white border border-gray-200 rounded-xl px-4 py-3 mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">Jeu</label>
        <select
          value={selectedGameId}
          onChange={(e) => setSelectedGameId(e.target.value)}
          disabled={loadingGames}
          className="input w-full max-w-md"
        >
          {games.map((g) => (
            <option key={g.id} value={g.id}>{g.icon ?? '🎲'} {g.name}</option>
          ))}
        </select>
        {selectedGame && (
          <p className="text-xs text-gray-400 mt-1.5">
            <code className="font-mono bg-gray-100 px-1 rounded">{selectedGame.slug}</code>
            {' · '}{slides.length} slide{slides.length !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded-lg mb-4">{error}</p>}
      {success && <p className="text-sm text-green-700 bg-green-50 border border-green-200 px-3 py-2 rounded-lg mb-4">{success}</p>}

      {/* Formulaire nouvelle slide */}
      {showNew && (
        <div className="bg-white border border-indigo-200 rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <p className="font-semibold text-sm">Nouvelle slide</p>
            <button onClick={() => { setShowNew(false); setNewSlide(EMPTY_SLIDE); setError(null); }}>
              <X size={16} className="text-gray-400 hover:text-gray-600" />
            </button>
          </div>
          <div className="flex flex-col gap-3 mb-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Titre</label>
              <input
                className="input w-full"
                placeholder="Comment jouer ?"
                value={newSlide.title}
                onChange={(e) => setNewSlide((f) => ({ ...f, title: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Contenu</label>
              <textarea
                className="input w-full resize-none"
                rows={3}
                placeholder="Explication de cette étape…"
                value={newSlide.content}
                onChange={(e) => setNewSlide((f) => ({ ...f, content: e.target.value }))}
              />
            </div>
          </div>
          <button onClick={handleCreate} disabled={creating} className="btn-primary flex items-center gap-2">
            <Plus size={14} />
            {creating ? 'Création…' : 'Créer'}
          </button>
        </div>
      )}

      {/* Liste des slides */}
      {loadingSlides ? (
        <p className="text-sm text-gray-400 py-12 text-center">Chargement…</p>
      ) : slides.length === 0 ? (
        <p className="text-sm text-gray-400 py-12 text-center">Aucune slide pour ce jeu.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {slides.map((slide, index) => (
            <div key={slide.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              {/* Header slide */}
              <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 border-b border-gray-100">
                <GripVertical size={16} className="text-gray-300" />
                <span className="text-xs font-semibold text-gray-500 flex-1">Slide {index + 1}</span>
                <button onClick={() => handleMoveUp(index)} disabled={index === 0} className="p-1 rounded hover:bg-gray-200 disabled:opacity-30">
                  <ChevronUp size={14} />
                </button>
                <button onClick={() => handleMoveDown(index)} disabled={index === slides.length - 1} className="p-1 rounded hover:bg-gray-200 disabled:opacity-30">
                  <ChevronDown size={14} />
                </button>
                <button
                  onClick={() => handleDelete(slide.id)}
                  disabled={deletingId === slide.id}
                  className="p-1 rounded hover:bg-red-50 text-red-400"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              <div className="p-4 flex flex-col gap-3">
                {/* Image */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Image / GIF / Vidéo</label>
                  {slide.imageUrl ? (
                    <div className="relative rounded-lg overflow-hidden bg-gray-100 h-36">
                      {slide.imageUrl.match(/\.(mp4|webm|mov)$/i) ? (
                        <video src={slide.imageUrl} className="w-full h-full object-cover" muted loop />
                      ) : (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={slide.imageUrl} alt="" className="w-full h-full object-cover" />
                      )}
                      <button
                        onClick={() => updateLocal(slide.id, { imageUrl: null })}
                        className="absolute top-2 right-2 p-1.5 bg-black/60 rounded-full hover:bg-black/80"
                      >
                        <X size={13} className="text-white" />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <input
                        type="file"
                        accept="image/*,video/mp4,video/webm"
                        className="hidden"
                        ref={(el) => { fileInputRefs.current[slide.id] = el; }}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleUpload(slide.id, file);
                        }}
                      />
                        <button
                        onClick={() => fileInputRefs.current[slide.id]?.click()}
                        disabled={uploadingId === slide.id}
                        className="flex items-center gap-2 px-3 py-2 border border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-indigo-400 hover:text-indigo-600 transition-colors w-full justify-center"
                      >
                        <ImageIcon size={15} />
                        {uploadingId === slide.id ? 'Upload en cours…' : 'Ajouter une image ou vidéo'}
                      </button>
                      <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">
                        <span className="font-medium text-gray-500">Image</span> JPG, PNG, WebP, GIF — ratio 16:9 ou 4:3, max 2 Mo (GIF max 5 Mo)<br />
                        <span className="font-medium text-gray-500">Vidéo</span> MP4, WebM — ratio 16:9, max 10 Mo, durée recommandée &lt; 10s (loop automatique)
                      </p>
                    </div>
                  )}
                </div>

                {/* Titre */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Titre</label>
                  <input
                    className="input w-full"
                    value={slide.title}
                    onChange={(e) => updateLocal(slide.id, { title: e.target.value })}
                  />
                </div>

                {/* Contenu */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Contenu</label>
                  <textarea
                    className="input w-full resize-none"
                    rows={3}
                    value={slide.content}
                    onChange={(e) => updateLocal(slide.id, { content: e.target.value })}
                  />
                </div>

                <button
                  onClick={() => handleSaveSlide(slide)}
                  disabled={savingId === slide.id}
                  className="btn-primary flex items-center gap-2 self-start"
                >
                  <Save size={13} />
                  {savingId === slide.id ? 'Sauvegarde…' : 'Sauvegarder'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
