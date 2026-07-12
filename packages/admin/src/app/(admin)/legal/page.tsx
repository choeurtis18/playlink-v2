'use client';

import { useState, useEffect } from 'react';
import { Eye, Save, Edit3 } from 'lucide-react';
import { api, apiError } from '@/lib/api';
import { MarkdownPreview } from '@/components/MarkdownPreview';

const DOCS = [
  { key: 'privacy', label: 'Politique de confidentialité' },
  { key: 'terms', label: "Conditions d'utilisation" },
  { key: 'support_email', label: 'Email de support' },
];

export default function LegalPage() {
  const [selectedKey, setSelectedKey] = useState('privacy');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    api.get<{ data: { content: string } }>(`/api/admin/legal/${selectedKey}`)
      .then((res) => setContent(res.data.data.content ?? ''))
      .catch(() => setContent(''))
      .finally(() => setLoading(false));
  }, [selectedKey]);

  const handleSave = async () => {
    if (content.trim().length < 10) {
      setError('Le contenu doit faire au moins 10 caractères.');
      return;
    }
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      await api.put(`/api/admin/legal/${selectedKey}`, { content });
      setSuccess('Contenu sauvegardé.');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(apiError(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-8 max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold">Mentions légales</h1>
          <p className="text-sm text-gray-500 mt-0.5">Éditez les documents affichés aux utilisateurs (Markdown)</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPreview((p) => !p)}
            className="btn-secondary flex items-center gap-2"
            type="button"
          >
            {preview ? <Edit3 size={15} /> : <Eye size={15} />}
            {preview ? 'Éditer' : 'Aperçu'}
          </button>
          <button
            onClick={handleSave}
            disabled={saving || loading}
            className="btn-primary flex items-center gap-2"
            type="button"
          >
            <Save size={15} />
            {saving ? 'Sauvegarde…' : 'Sauvegarder'}
          </button>
        </div>
      </div>

      {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded-lg mb-4">{error}</p>}
      {success && <p className="text-sm text-green-700 bg-green-50 border border-green-200 px-3 py-2 rounded-lg mb-4">{success}</p>}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 bg-gray-50 flex gap-2">
          {DOCS.map((d) => (
            <button
              key={d.key}
              onClick={() => setSelectedKey(d.key)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                selectedKey === d.key
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>

        <div className="p-4">
          {loading ? (
            <p className="text-sm text-gray-400 py-12 text-center">Chargement…</p>
          ) : preview ? (
            <div className="min-h-[400px] border border-gray-200 rounded-lg p-4 bg-gray-50">
              <MarkdownPreview content={content} />
            </div>
          ) : (
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="input font-mono text-sm w-full min-h-[400px] resize-y leading-relaxed"
            />
          )}
          <p className="text-xs text-gray-400 mt-2">
            {content.length} caractères · Supporte Markdown (## titres, **gras**, *italique*, listes)
          </p>
        </div>
      </div>
    </div>
  );
}
