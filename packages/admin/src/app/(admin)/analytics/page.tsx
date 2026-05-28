'use client';

import { useState, useEffect } from 'react';
import { Download, TrendingUp, Gamepad2, Eye, Calendar } from 'lucide-react';
import { api, apiError, downloadCSV } from '@/lib/api';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from 'recharts';

interface Overview {
  totalSessions: number;
  totalCardsViewed: number;
  totalFinished: number;
  activeDays: number;
  topGame: { name: string; icon: string; sessions: number } | null;
}

interface GameStat { gameId: string; name: string; icon: string; colorMain: string; sessions: number }
interface CategoryStat { categoryId: string; name: string; icon: string; gameName: string; colorMain: string; sessions: number }
interface DailyStat { date: string; sessions: number; cardsViewed: number }
interface HourlyStat { hour: number; label: string; sessions: number }

export default function AnalyticsPage() {
  const [overview, setOverview] = useState<Overview | null>(null);
  const [games, setGames] = useState<GameStat[]>([]);
  const [categories, setCategories] = useState<CategoryStat[]>([]);
  const [daily, setDaily] = useState<DailyStat[]>([]);
  const [hourly, setHourly] = useState<HourlyStat[]>([]);
  const [days, setDays] = useState(30);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const [exportFrom, setExportFrom] = useState('');
  const [exportTo, setExportTo] = useState('');

  useEffect(() => {
    setLoading(true);
    setError(null);
    Promise.all([
      api.get<{ data: Overview }>('/api/admin/analytics/overview'),
      api.get<{ data: GameStat[] }>('/api/admin/analytics/games'),
      api.get<{ data: CategoryStat[] }>('/api/admin/analytics/categories'),
      api.get<{ data: DailyStat[] }>(`/api/admin/analytics/daily?days=${days}`),
      api.get<{ data: HourlyStat[] }>('/api/admin/analytics/hourly'),
    ])
      .then(([ov, gm, cat, day, hr]) => {
        setOverview(ov.data.data);
        setGames(gm.data.data);
        setCategories(cat.data.data);
        setDaily(day.data.data);
        setHourly(hr.data.data);
      })
      .catch((err) => setError(apiError(err)))
      .finally(() => setLoading(false));
  }, [days]);

  const handleExport = async () => {
    setExporting(true);
    try {
      const params = new URLSearchParams();
      if (exportFrom) params.set('from', exportFrom);
      if (exportTo) params.set('to', exportTo);
      await downloadCSV(`/api/admin/analytics/export?${params}`, 'analytics-export.csv');
    } catch {
      setError('Export échoué');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="p-8 max-w-6xl space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Analytics</h1>
          <p className="text-sm text-gray-500 mt-0.5">Suivi d'activité des joueurs</p>
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded-lg">{error}</p>
      )}

      {/* KPIs */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse h-24" />
          ))}
        </div>
      ) : overview && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <KpiCard icon={<Gamepad2 size={18} className="text-indigo-500" />} label="Sessions jouées" value={overview.totalSessions.toLocaleString('fr-FR')} />
          <KpiCard icon={<Eye size={18} className="text-purple-500" />} label="Cartes vues" value={overview.totalCardsViewed.toLocaleString('fr-FR')} />
          <KpiCard icon={<TrendingUp size={18} className="text-green-500" />} label="Parties finies" value={overview.totalFinished.toLocaleString('fr-FR')} />
          <KpiCard icon={<Calendar size={18} className="text-orange-500" />} label="Jours actifs" value={overview.activeDays.toLocaleString('fr-FR')} sub={overview.topGame ? `Top: ${overview.topGame.icon} ${overview.topGame.name}` : undefined} />
        </div>
      )}

      {/* Sessions par jour + Jeux populaires */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold">Sessions par jour</h2>
            <select
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              className="input text-xs py-1 px-2 w-28"
            >
              <option value={7}>7 jours</option>
              <option value={30}>30 jours</option>
              <option value={90}>90 jours</option>
            </select>
          </div>
          {loading ? <ChartSkeleton /> : (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={daily} margin={{ top: 4, right: 8, bottom: 0, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} tickFormatter={(v) => v.slice(5)} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip labelFormatter={(l) => `Date: ${l}`} formatter={(v) => [v, 'Sessions']} />
                <Line type="monotone" dataKey="sessions" stroke="#6366f1" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-sm font-semibold mb-4">Jeux les plus joués</h2>
          {loading ? <ChartSkeleton /> : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={games} layout="vertical" margin={{ top: 0, right: 8, bottom: 0, left: 60 }}>
                <XAxis type="number" tick={{ fontSize: 10 }} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={60} />
                <Tooltip formatter={(v) => [v, 'Sessions']} />
                <Bar dataKey="sessions" radius={[0, 4, 4, 0]}>
                  {games.map((g, i) => (
                    <Cell key={i} fill={g.colorMain} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Heures de pointe */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="text-sm font-semibold mb-4">Heures de pointe</h2>
        {loading ? <ChartSkeleton /> : (
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={hourly} margin={{ top: 4, right: 8, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 9 }} interval={1} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip formatter={(v) => [v, 'Sessions']} />
              <Bar dataKey="sessions" fill="#8b5cf6" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Top catégories + Export */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-sm font-semibold mb-4">Catégories populaires</h2>
          {loading ? <ChartSkeleton /> : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={categories} layout="vertical" margin={{ top: 0, right: 8, bottom: 0, left: 80 }}>
                <XAxis type="number" tick={{ fontSize: 10 }} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={80} />
                <Tooltip formatter={(v) => [v, 'Sessions']} labelFormatter={(l, p) => `${l} (${p?.[0]?.payload?.gameName ?? ''})`} />
                <Bar dataKey="sessions" radius={[0, 4, 4, 0]}>
                  {categories.map((c, i) => (
                    <Cell key={i} fill={c.colorMain} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-sm font-semibold mb-4">Export CSV</h2>
          <p className="text-xs text-gray-500 mb-4">Exporte tous les événements bruts sur une période.</p>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Depuis</label>
                <input type="date" value={exportFrom} onChange={(e) => setExportFrom(e.target.value)} className="input w-full text-sm" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Jusqu'au</label>
                <input type="date" value={exportTo} onChange={(e) => setExportTo(e.target.value)} className="input w-full text-sm" />
              </div>
            </div>
            <button
              onClick={handleExport}
              disabled={exporting}
              className="btn-primary flex items-center gap-2 w-full justify-center"
            >
              <Download size={15} />
              {exporting ? 'Export en cours…' : 'Télécharger le CSV'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function KpiCard({ icon, label, value, sub }: { icon: React.ReactNode; label: string; value: string; sub?: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="text-xs text-gray-500">{label}</span>
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-1 truncate">{sub}</p>}
    </div>
  );
}

function ChartSkeleton() {
  return <div className="h-48 bg-gray-100 rounded-lg animate-pulse" />;
}
