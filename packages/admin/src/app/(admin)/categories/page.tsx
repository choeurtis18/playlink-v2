'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, Pencil, Trash2, Download, Upload } from 'lucide-react';
import { api, apiError, downloadCSV } from '@/lib/api';
import { Modal } from '@/components/Modal';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { Pagination } from '@/components/Pagination';
import { CategoryForm } from '@/components/forms/CategoryForm';
import { CsvImportForm } from '@/components/forms/CsvImportForm';
import type { AdminGame, AdminCategory, PaginationMeta } from '@/types/admin';

const LIMIT = 15;

export default function CategoriesPage() {
  const [games, setGames] = useState<AdminGame[]>([]);
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>({ total: 0, page: 1, limit: LIMIT, totalPages: 1 });
  const [page, setPage] = useState(1);
  const [filterGameId, setFilterGameId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refresh, setRefresh] = useState(0);
  const [editCategory, setEditCategory] = useState<AdminCategory | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [deletingBulk, setDeletingBulk] = useState(false);

  useEffect(() => {
    api.get<{ data: AdminGame[] }>('/api/admin/games?limit=100')
      .then((res) => setGames(res.data.data))
      .catch(() => {});
  }, []);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(LIMIT) });
      if (filterGameId) params.set('gameId', filterGameId);
      const res = await api.get<{ data: AdminCategory[]; pagination: PaginationMeta }>(`/api/admin/categories?${params}`);
      setCategories(res.data.data);
      setPagination(res.data.pagination);
      setSelectedIds(new Set());
    } catch {
      setError('Impossible de charger les catégories.');
    } finally {
      setLoading(false);
    }
  }, [page, filterGameId, refresh]);

  useEffect(() => { fetchCategories(); }, [fetchCategories]);

  const handleFilterChange = (gameId: string) => { setFilterGameId(gameId); setPage(1); };
  const invalidate = () => setRefresh((n) => n + 1);

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelectedIds(next);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === categories.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(categories.map((c) => c.id)));
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await api.delete(`/api/admin/categories/${deleteId}`);
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
    try {
      for (const id of selectedIds) {
        try { await api.delete(`/api/admin/categories/${id}`); }
        catch (e) { console.error(`Failed to delete category ${id}`, e); }
      }
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
      const params = filterGameId ? `?gameId=${filterGameId}` : '';
      await downloadCSV(`/api/admin/categories/export${params}`, 'categories.csv');
    } catch (err) {
      setError(apiError(err));
    } finally {
      setExporting(false);
    }
  };

  const handleSuccess = () => { setShowCreate(false); setEditCategory(null); invalidate(); };
  const handleImportSuccess = () => { setShowImport(false); invalidate(); };
  const gameName = (gameId: string) => games.find((g) => g.id === gameId)?.name ?? '—';

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold">Catégories</h1>
          <p className="text-sm text-gray-500 mt-0.5">{pagination.total} catégorie{pagination.total !== 1 ? 's' : ''}</p>
        </div>
        <div className="flex items-center gap-3">
          {selectedIds.size > 0 && (
            <button onClick={handleDeleteBulk} disabled={deletingBulk} className="btn-danger flex items-center gap-2">
              <Trash2 size={15} /> Supprimer {selectedIds.size}
            </button>
          )}
          <select value={filterGameId} onChange={(e) => handleFilterChange(e.target.value)} className="input w-48">
            <option value="">Tous les jeux</option>
            {games.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
          </select>
          <button onClick={handleExport} disabled={exporting} className="btn-secondary flex items-center gap-2">
            <Download size={15} /> {exporting ? 'Export…' : 'Exporter CSV'}
          </button>
          <button onClick={() => setShowImport(true)} className="btn-secondary flex items-center gap-2">
            <Upload size={15} /> Importer CSV
          </button>
          <button onClick={() => setShowCreate(true)} className="btn-primary flex items-center gap-2">
            <Plus size={16} /> Ajouter
          </button>
        </div>
      </div>

      {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50 text-left">
              <th className="px-4 py-3 font-medium text-gray-600 w-8">
                <input type="checkbox" checked={selectedIds.size === categories.length && categories.length > 0} onChange={toggleSelectAll} className="rounded" />
              </th>
              <th className="px-4 py-3 font-medium text-gray-600">Jeu</th>
              <th className="px-4 py-3 font-medium text-gray-600">Nom</th>
              <th className="px-4 py-3 font-medium text-gray-600">Slug</th>
              <th className="px-4 py-3 font-medium text-gray-600 text-center">Icône</th>
              <th className="px-4 py-3 font-medium text-gray-600 text-center">Cartes</th>
              <th className="px-4 py-3 font-medium text-gray-600 text-center">Ordre</th>
              <th className="px-4 py-3 font-medium text-gray-600 w-20"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr><td colSpan={8} className="px-4 py-8 text-center text-gray-400">Chargement…</td></tr>
            ) : categories.length === 0 ? (
              <tr><td colSpan={8} className="px-4 py-8 text-center text-gray-400">Aucune catégorie trouvée.</td></tr>
            ) : (
              categories.map((cat) => (
                <tr key={cat.id} className={`hover:bg-gray-50 transition-colors ${selectedIds.has(cat.id) ? 'bg-blue-50' : ''}`}>
                  <td className="px-4 py-3">
                    <input type="checkbox" checked={selectedIds.has(cat.id)} onChange={() => toggleSelect(cat.id)} className="rounded" />
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{gameName(cat.gameId)}</td>
                  <td className="px-4 py-3 font-medium">{cat.name}</td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-500">{cat.slug}</td>
                  <td className="px-4 py-3 text-center text-xl">{cat.icon ?? '—'}</td>
                  <td className="px-4 py-3 text-center text-gray-600">{cat._count.cards}</td>
                  <td className="px-4 py-3 text-center text-gray-500">{cat.order}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 justify-end">
                      <button onClick={() => setEditCategory(cat)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-800 transition-colors"><Pencil size={14} /></button>
                      <button onClick={() => setDeleteId(cat.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-500 hover:text-red-600 transition-colors"><Trash2 size={14} /></button>
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

      {(showCreate || editCategory) && (
        <Modal title={editCategory ? `Modifier — ${editCategory.name}` : 'Nouvelle catégorie'} onClose={() => { setShowCreate(false); setEditCategory(null); }}>
          <CategoryForm games={games} category={editCategory ?? undefined} defaultGameId={filterGameId || undefined} onSuccess={handleSuccess} onCancel={() => { setShowCreate(false); setEditCategory(null); }} />
        </Modal>
      )}

      {deleteId && (
        <ConfirmDialog message="Cette catégorie et toutes ses cartes seront définitivement supprimées." onConfirm={handleDelete} onCancel={() => setDeleteId(null)} loading={deleting} />
      )}

      {showImport && (
        <Modal title="Importer des catégories (CSV)" onClose={() => setShowImport(false)}>
          <CsvImportForm
            endpoint="/api/admin/categories/import"
            label="catégories"
            columns={['id', 'gameId', 'name', 'slug', 'description', 'order']}
            sampleRow={['', 'game-id-ici', 'Soirée entre amis', 'soiree-entre-amis', 'Questions pour une soirée détendue', '1']}
            onSuccess={handleImportSuccess}
            onCancel={() => setShowImport(false)}
          />
        </Modal>
      )}
    </div>
  );
}
