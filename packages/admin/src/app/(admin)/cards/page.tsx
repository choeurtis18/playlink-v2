'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, Pencil, Trash2, Upload, Download, Search } from 'lucide-react';
import { api, apiError, downloadCSV } from '@/lib/api';
import { Modal } from '@/components/Modal';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { Pagination } from '@/components/Pagination';
import { CardForm } from '@/components/forms/CardForm';
import { BulkImportForm } from '@/components/forms/BulkImportForm';
import { CsvImportForm } from '@/components/forms/CsvImportForm';
import type { AdminGame, AdminCategory, AdminCard, PaginationMeta } from '@/types/admin';

const LIMIT = 20;

const DIFFICULTY_LABEL: Record<string, string> = { easy: 'Facile', medium: 'Moyen', hard: 'Difficile' };
const DIFFICULTY_CLASS: Record<string, string> = {
  easy: 'bg-green-100 text-green-700',
  medium: 'bg-amber-100 text-amber-700',
  hard: 'bg-red-100 text-red-700',
};

export default function CardsPage() {
  const [games, setGames] = useState<AdminGame[]>([]);
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [cards, setCards] = useState<AdminCard[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>({ total: 0, page: 1, limit: LIMIT, totalPages: 1 });
  const [page, setPage] = useState(1);
  const [filterGameId, setFilterGameId] = useState('');
  const [filterCategoryId, setFilterCategoryId] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refresh, setRefresh] = useState(0);
  const [editCard, setEditCard] = useState<AdminCard | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [showBulk, setShowBulk] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [deletingBulk, setDeletingBulk] = useState(false);

  useEffect(() => {
    api.get<{ data: AdminGame[] }>('/api/admin/games?limit=100').then((r) => setGames(r.data.data)).catch(() => {});
  }, []);

  useEffect(() => {
    if (!filterGameId) { setCategories([]); setFilterCategoryId(''); return; }
    api.get<{ data: AdminCategory[] }>(`/api/admin/categories?gameId=${filterGameId}&limit=100`)
      .then((r) => { setCategories(r.data.data); setFilterCategoryId(''); })
      .catch(() => {});
  }, [filterGameId]);

  const fetchCards = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(LIMIT) });
      if (filterGameId) params.set('gameId', filterGameId);
      if (filterCategoryId) params.set('categoryId', filterCategoryId);
      if (search) params.set('search', search);
      const res = await api.get<{ data: AdminCard[]; pagination: PaginationMeta }>(`/api/admin/cards?${params}`);
      setCards(res.data.data);
      setPagination(res.data.pagination);
      setSelectedIds(new Set());
    } catch {
      setError('Impossible de charger les cartes.');
    } finally {
      setLoading(false);
    }
  }, [page, filterGameId, filterCategoryId, search, refresh]);

  useEffect(() => {
    const t = setTimeout(fetchCards, search ? 300 : 0);
    return () => clearTimeout(t);
  }, [fetchCards]);

  const handleFilterGame = (id: string) => { setFilterGameId(id); setPage(1); };
  const handleFilterCategory = (id: string) => { setFilterCategoryId(id); setPage(1); };
  const handleSearch = (val: string) => { setSearch(val); setPage(1); };

  const invalidate = () => setRefresh((n) => n + 1);

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) newSelected.delete(id);
    else newSelected.add(id);
    setSelectedIds(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === cards.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(cards.map((c) => c.id)));
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await api.delete(`/api/admin/cards/${deleteId}`);
      setDeleteId(null);
      invalidate();
    } catch (err) {
      setError(apiError(err));
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteBulk = async () => {
    if (selectedIds.size === 0) return;
    setDeletingBulk(true);
    let deleted = 0;
    try {
      for (const id of selectedIds) {
        try {
          await api.delete(`/api/admin/cards/${id}`);
          deleted++;
        } catch (e) {
          console.error(`Failed to delete card ${id}`, e);
        }
      }
      setError(null);
      invalidate();
    } catch (err) {
      setError(apiError(err));
    } finally {
      setDeletingBulk(false);
      setSelectedIds(new Set());
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const params = new URLSearchParams();
      if (filterGameId) params.set('gameId', filterGameId);
      if (filterCategoryId) params.set('categoryId', filterCategoryId);
      if (search) params.set('search', search);
      const qs = params.toString();
      await downloadCSV(`/api/admin/cards/export${qs ? `?${qs}` : ''}`, 'cards.csv');
    } catch (err) {
      setError(apiError(err));
    } finally {
      setExporting(false);
    }
  };

  const handleSuccess = () => {
    setShowCreate(false);
    setEditCard(null);
    setShowBulk(false);
    invalidate();
  };

  const handleImportSuccess = () => {
    setShowImport(false);
    invalidate();
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold">Cartes</h1>
          <p className="text-sm text-gray-500 mt-0.5">{pagination.total} carte{pagination.total !== 1 ? 's' : ''}</p>
        </div>
        <div className="flex items-center gap-2">
          {selectedIds.size > 0 && (
            <button onClick={handleDeleteBulk} disabled={deletingBulk} className="btn-danger flex items-center gap-2">
              <Trash2 size={15} /> Supprimer {selectedIds.size}
            </button>
          )}
          <button onClick={handleExport} disabled={exporting} className="btn-secondary flex items-center gap-2">
            <Download size={15} /> {exporting ? 'Export…' : 'Exporter CSV'}
          </button>
          <button onClick={() => setShowImport(true)} className="btn-secondary flex items-center gap-2">
            <Upload size={15} /> Importer CSV
          </button>
          <button onClick={() => setShowBulk(true)} className="btn-secondary flex items-center gap-2">
            <Upload size={15} /> Import texte
          </button>
          <button onClick={() => setShowCreate(true)} className="btn-primary flex items-center gap-2">
            <Plus size={16} /> Ajouter
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <select value={filterGameId} onChange={(e) => handleFilterGame(e.target.value)} className="input w-44">
          <option value="">Tous les jeux</option>
          {games.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
        </select>
        <select value={filterCategoryId} onChange={(e) => handleFilterCategory(e.target.value)} className="input w-48" disabled={!filterGameId}>
          <option value="">Toutes les catégories</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <div className="relative flex-1 max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" value={search} onChange={(e) => handleSearch(e.target.value)} placeholder="Rechercher…" className="input pl-8" />
        </div>
      </div>

      {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50 text-left">
              <th className="px-4 py-3 font-medium text-gray-600 w-8">
                <input type="checkbox" checked={selectedIds.size === cards.length && cards.length > 0} onChange={toggleSelectAll} className="rounded" />
              </th>
              <th className="px-4 py-3 font-medium text-gray-600">Catégorie</th>
              <th className="px-4 py-3 font-medium text-gray-600">Texte</th>
              <th className="px-4 py-3 font-medium text-gray-600">Difficulté</th>
              <th className="px-4 py-3 font-medium text-gray-600">Tags</th>
              <th className="px-4 py-3 font-medium text-gray-600 text-center">Actif</th>
              <th className="px-4 py-3 font-medium text-gray-600 w-20"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">Chargement…</td></tr>
            ) : cards.length === 0 ? (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">Aucune carte trouvée.</td></tr>
            ) : (
              cards.map((card) => (
                <tr key={card.id} className={`hover:bg-gray-50 transition-colors ${selectedIds.has(card.id) ? 'bg-blue-50' : ''}`}>
                  <td className="px-4 py-3">
                    <input type="checkbox" checked={selectedIds.has(card.id)} onChange={() => toggleSelect(card.id)} className="rounded" />
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-xs">{card.category.name}</p>
                    <p className="text-gray-400 text-xs">{card.category.game.name}</p>
                  </td>
                  <td className="px-4 py-3 max-w-xs">
                    <p className="line-clamp-2 text-gray-800">{card.text}</p>
                  </td>
                  <td className="px-4 py-3">
                    {card.difficulty ? (
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${DIFFICULTY_CLASS[card.difficulty]}`}>
                        {DIFFICULTY_LABEL[card.difficulty]}
                      </span>
                    ) : <span className="text-gray-300">—</span>}
                  </td>
                  <td className="px-4 py-3">
                    {card.tags.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {card.tags.map((t) => (
                          <span key={t} className="text-xs bg-gray-100 text-gray-600 rounded px-1.5 py-0.5">#{t}</span>
                        ))}
                      </div>
                    ) : <span className="text-gray-300">—</span>}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-block w-2 h-2 rounded-full ${card.active ? 'bg-green-500' : 'bg-gray-300'}`} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 justify-end">
                      <button onClick={() => setEditCard(card)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-800 transition-colors"><Pencil size={14} /></button>
                      <button onClick={() => setDeleteId(card.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-500 hover:text-red-600 transition-colors"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <Pagination
          page={pagination.page}
          totalPages={pagination.totalPages}
          total={pagination.total}
          limit={LIMIT}
          onPageChange={setPage}
        />
      </div>

      {(showCreate || editCard) && (
        <Modal title={editCard ? 'Modifier la carte' : 'Nouvelle carte'} onClose={() => { setShowCreate(false); setEditCard(null); }} size="lg">
          <CardForm games={games} card={editCard ?? undefined} defaultCategoryId={filterCategoryId} onSuccess={handleSuccess} onCancel={() => { setShowCreate(false); setEditCard(null); }} />
        </Modal>
      )}

      {showBulk && (
        <Modal title="Import en masse" onClose={() => setShowBulk(false)} size="lg">
          <BulkImportForm games={games} defaultGameId={filterGameId} defaultCategoryId={filterCategoryId} onSuccess={handleSuccess} onCancel={() => setShowBulk(false)} />
        </Modal>
      )}

      {deleteId && (
        <ConfirmDialog message="Cette carte sera définitivement supprimée." onConfirm={handleDelete} onCancel={() => setDeleteId(null)} loading={deleting} />
      )}

      {showImport && (
        <Modal title="Importer des cartes (CSV)" onClose={() => setShowImport(false)} size="lg">
          <CsvImportForm
            endpoint="/api/admin/cards/import"
            label="cartes"
            columns={['id', 'categoryId', 'text', 'difficulty', 'tags', 'active', 'order']}
            sampleRow={['', 'category-id-ici', "Tu as déjà menti à tes parents sur où tu étais ?", 'easy', 'mensonge|famille', 'true', '1']}
            onSuccess={handleImportSuccess}
            onCancel={() => setShowImport(false)}
          />
        </Modal>
      )}
    </div>
  );
}
