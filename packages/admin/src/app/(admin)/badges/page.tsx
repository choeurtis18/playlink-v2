'use client';

import { useState, useEffect } from 'react';
import { Plus, Save, Trash2, X, Edit3 } from 'lucide-react';
import { api, apiError } from '@/lib/api';

interface Badge {
  id: string;
  key: string;
  name: string;
  description: string;
  icon: string;
  _count: { users: number };
}

const EMPTY = { key: '', name: '', description: '', icon: '' };

export default function BadgesPage() {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: '', description: '', icon: '' });
  const [newForm, setNewForm] = useState(EMPTY);
  const [showNew, setShowNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const flash = (msg: string) => { setSuccess(msg); setTimeout(() => setSuccess(null), 3000); };

  useEffect(() => {
    api.get<{ data: Badge[] }>('/api/admin/badges')
      .then((r) => setBadges(r.data.data))
      .catch(() => setError('Impossible de charger les badges.'))
      .finally(() => setLoading(false));
  }, []);

  const startEdit = (b: Badge) => {
    setEditingId(b.id);
    setEditForm({ name: b.name, description: b.description, icon: b.icon });
    setError(null);
  };

  const handleUpdate = async (id: string) => {
    setSaving(true); setError(null);
    try {
      await api.put(`/api/admin/badges/${id}`, editForm);
      setBadges((prev) => prev.map((b) => b.id === id ? { ...b, ...editForm } : b));
      setEditingId(null);
      flash('Badge mis à jour.');
    } catch (err) { setError(apiError(err)); }
    finally { setSaving(false); }
  };

  const handleCreate = async () => {
    if (!newForm.key.trim() || !newForm.name.trim() || !newForm.description.trim() || !newForm.icon.trim()) {
      setError('Tous les champs sont requis.'); return;
    }
    setSaving(true); setError(null);
    try {
      const r = await api.post<{ data: Badge }>('/api/admin/badges', newForm);
      setBadges((prev) => [...prev, { ...r.data.data, _count: { users: 0 } }]);
      setNewForm(EMPTY);
      setShowNew(false);
      flash('Badge créé.');
    } catch (err) { setError(apiError(err)); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string, userCount: number) => {
    if (!confirm(`Supprimer ce badge ? Il sera retiré à ${userCount} utilisateur${userCount > 1 ? 's' : ''}.`)) return;
    try {
      await api.delete(`/api/admin/badges/${id}`);
      setBadges((prev) => prev.filter((b) => b.id !== id));
      flash('Badge supprimé.');
    } catch (err) { setError(apiError(err)); }
  };

  return (
    <div className="p-8 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold">Badges</h1>
          <p className="text-sm text-gray-500 mt-0.5">Gérez les badges attribuables aux joueurs</p>
        </div>
        <button
          onClick={() => { setShowNew(true); setError(null); }}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={15} />
          Nouveau badge
        </button>
      </div>

      {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded-lg mb-4">{error}</p>}
      {success && <p className="text-sm text-green-700 bg-green-50 border border-green-200 px-3 py-2 rounded-lg mb-4">{success}</p>}

      {/* Formulaire nouveau badge */}
      {showNew && (
        <div className="bg-white border border-indigo-200 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <p className="font-semibold text-sm">Nouveau badge</p>
            <button onClick={() => { setShowNew(false); setNewForm(EMPTY); setError(null); }}>
              <X size={16} className="text-gray-400 hover:text-gray-600" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Clé unique</label>
              <input className="input w-full" placeholder="ex: first_win" value={newForm.key} onChange={(e) => setNewForm((f) => ({ ...f, key: e.target.value }))} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Icône (emoji)</label>
              <input className="input w-full" placeholder="🏆" value={newForm.icon} onChange={(e) => setNewForm((f) => ({ ...f, icon: e.target.value }))} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Nom</label>
              <input className="input w-full" placeholder="Première victoire" value={newForm.name} onChange={(e) => setNewForm((f) => ({ ...f, name: e.target.value }))} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
              <input className="input w-full" placeholder="Remporter sa première partie" value={newForm.description} onChange={(e) => setNewForm((f) => ({ ...f, description: e.target.value }))} />
            </div>
          </div>
          <button onClick={handleCreate} disabled={saving} className="btn-primary flex items-center gap-2">
            <Plus size={14} />
            {saving ? 'Création…' : 'Créer'}
          </button>
        </div>
      )}

      {loading ? (
        <p className="text-sm text-gray-400 py-12 text-center">Chargement…</p>
      ) : badges.length === 0 ? (
        <p className="text-sm text-gray-400 py-12 text-center">Aucun badge configuré.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {badges.map((b) => (
            <div key={b.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              {editingId === b.id ? (
                <div className="p-4">
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Icône</label>
                      <input className="input w-full" value={editForm.icon} onChange={(e) => setEditForm((f) => ({ ...f, icon: e.target.value }))} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Nom</label>
                      <input className="input w-full" value={editForm.name} onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))} />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
                      <input className="input w-full" value={editForm.description} onChange={(e) => setEditForm((f) => ({ ...f, description: e.target.value }))} />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleUpdate(b.id)} disabled={saving} className="btn-primary flex items-center gap-1.5">
                      <Save size={13} />{saving ? 'Sauvegarde…' : 'Sauvegarder'}
                    </button>
                    <button onClick={() => setEditingId(null)} className="btn-secondary flex items-center gap-1.5">
                      <X size={13} />Annuler
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-4 px-4 py-3">
                  <span className="text-2xl w-8 text-center">{b.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm">{b.name}</p>
                    <p className="text-gray-500 text-xs truncate">{b.description}</p>
                    <p className="text-gray-400 text-xs mt-0.5">
                      <code className="font-mono bg-gray-100 px-1 rounded">{b.key}</code>
                      {' · '}
                      <span>{b._count.users} utilisateur{b._count.users > 1 ? 's' : ''}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button onClick={() => startEdit(b)} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                      <Edit3 size={15} className="text-gray-400" />
                    </button>
                    <button onClick={() => handleDelete(b.id, b._count.users)} className="p-2 rounded-lg hover:bg-red-50 transition-colors">
                      <Trash2 size={15} className="text-red-400" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
