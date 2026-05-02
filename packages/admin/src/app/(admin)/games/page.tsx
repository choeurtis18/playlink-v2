'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, Pencil, Trash2, Download, Upload } from 'lucide-react';
import { api, downloadCSV } from '@/lib/api';
import { Modal } from '@/components/Modal';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { Pagination } from '@/components/Pagination';
import { GameForm } from '@/components/forms/GameForm';
import { CsvImportForm } from '@/components/forms/CsvImportForm';
import type { AdminGame, PaginationMeta } from '@/types/admin';

const LIMIT = 10;

export default function GamesPage() {
  const [games, setGames] = useState<AdminGame[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>({ total: 0, page: 1, limit: LIMIT, totalPages: 1 });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refresh, setRefresh] = useState(0);
  const [editGame, setEditGame] = useState<AdminGame | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [exporting, setExporting] = useState(false);

  const fetchGames = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get<{ data: AdminGame[]; pagination: PaginationMeta }>(
        `/api/admin/games?page=${page}&limit=${LIMIT}`,
      );
      setGames(res.data.data);
      setPagination(res.data.pagination);
    } catch {
      setError('Impossible de charger les jeux.');
    } finally {
      setLoading(false);
    }
  }, [page, refresh]);

  useEffect(() => { fetchGames(); }, [fetchGames]);

  const invalidate = () => setRefresh((n) => n + 1);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await api.delete(`/api/admin/games/${deleteId}`);
      setDeleteId(null);
      invalidate();
    } finally {
      setDeleting(false);
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try { await downloadCSV('/api/admin/games/export', 'games.csv'); }
    finally { setExporting(false); }
  };

  const handleSuccess = () => {
    setShowCreate(false);
    setEditGame(null);
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
          <h1 className="text-xl font-bold">Jeux</h1>
          <p className="text-sm text-gray-500 mt-0.5">{pagination.total} jeu{pagination.total !== 1 ? 'x' : ''}</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleExport} disabled={exporting} className="btn-secondary flex items-center gap-2">
            <Download size={15} /> {exporting ? 'Export…' : 'Exporter CSV'}
          </button>
          <button onClick={() => setShowImport(true)} className="btn-secondary flex items-center gap-2">
            <Upload size={15} /> Importer CSV
          </button>
          <button onClick={() => setShowCreate(true)} className="btn-primary flex items-center gap-2">
            <Plus size={16} /> Ajouter un jeu
          </button>
        </div>
      </div>

      {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50 text-left">
              <th className="px-4 py-3 font-medium text-gray-600 w-10">Icône</th>
              <th className="px-4 py-3 font-medium text-gray-600">Nom</th>
              <th className="px-4 py-3 font-medium text-gray-600">Slug</th>
              <th className="px-4 py-3 font-medium text-gray-600 text-center">Catégories</th>
              <th className="px-4 py-3 font-medium text-gray-600 text-center">Actif</th>
              <th className="px-4 py-3 font-medium text-gray-600 text-center">Ordre</th>
              <th className="px-4 py-3 font-medium text-gray-600 w-20"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">Chargement…</td></tr>
            ) : games.length === 0 ? (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">Aucun jeu trouvé.</td></tr>
            ) : (
              games.map((game) => (
                <tr key={game.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-xl">{game.icon ?? '🎲'}</td>
                  <td className="px-4 py-3 font-medium">{game.name}</td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-500">{game.slug}</td>
                  <td className="px-4 py-3 text-center text-gray-600">{game._count.categories}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-block w-2 h-2 rounded-full ${game.active ? 'bg-green-500' : 'bg-gray-300'}`} />
                  </td>
                  <td className="px-4 py-3 text-center text-gray-500">{game.order}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 justify-end">
                      <button onClick={() => setEditGame(game)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-800 transition-colors" title="Modifier">
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => setDeleteId(game.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-500 hover:text-red-600 transition-colors" title="Supprimer">
                        <Trash2 size={14} />
                      </button>
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

      {(showCreate || editGame) && (
        <Modal title={editGame ? `Modifier — ${editGame.name}` : 'Nouveau jeu'} onClose={() => { setShowCreate(false); setEditGame(null); }} size="lg">
          <GameForm game={editGame ?? undefined} onSuccess={handleSuccess} onCancel={() => { setShowCreate(false); setEditGame(null); }} />
        </Modal>
      )}

      {deleteId && (
        <ConfirmDialog message="Ce jeu et toutes ses catégories et cartes seront définitivement supprimés." onConfirm={handleDelete} onCancel={() => setDeleteId(null)} loading={deleting} />
      )}

      {showImport && (
        <Modal title="Importer des jeux (CSV)" onClose={() => setShowImport(false)}>
          <CsvImportForm
            endpoint="/api/admin/games/import"
            label="jeux"
            columns={['id', 'name', 'slug', 'description', 'icon', 'colorMain', 'colorSecondary', 'active', 'order']}
            sampleRow={['', 'Action ou Vérité', 'action-ou-verite', 'Le classique revisité', '🎯', '#6366f1', '#818cf8', 'true', '1']}
            onSuccess={handleImportSuccess}
            onCancel={() => setShowImport(false)}
          />
        </Modal>
      )}
    </div>
  );
}
