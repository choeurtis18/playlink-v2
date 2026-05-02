'use client';

import { useState, useRef } from 'react';
import { Upload, FileText, X, Download } from 'lucide-react';
import { api, apiError } from '@/lib/api';

interface CsvImportFormProps {
  endpoint: string;
  label: string;
  columns: string[];
  sampleRow: string[];
  onSuccess: (result: { created: number; updated: number }) => void;
  onCancel: () => void;
}

export function CsvImportForm({ endpoint, label, columns, sampleRow, onSuccess, onCancel }: CsvImportFormProps) {
  const [csv, setCsv] = useState('');
  const [filename, setFilename] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ created: number; updated: number } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const lineCount = Math.max(0, csv.split('\n').filter((l) => l.trim()).length - 1);

  const handleDownloadTemplate = () => {
    const escape = (v: string) => (v.includes(',') || v.includes('"') || v.includes('\n') ? `"${v.replace(/"/g, '""')}"` : v);
    const content = [columns.map(escape).join(','), sampleRow.map(escape).join(',')].join('\n');
    const blob = new Blob(['﻿' + content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `modele_${label.replace(/\s+/g, '_')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFile = (file: File) => {
    setFilename(file.name);
    setError(null);
    const reader = new FileReader();
    reader.onload = (e) => setCsv(String(e.target?.result ?? ''));
    reader.readAsText(file, 'UTF-8');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.name.endsWith('.csv')) handleFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!csv.trim()) { setError('Aucun fichier chargé.'); return; }
    setLoading(true);
    setError(null);
    try {
      const res = await api.post<{ data: { created: number; updated: number } }>(endpoint, { csv });
      setResult(res.data.data);
    } catch (err) {
      setError(apiError(err));
      setLoading(false);
    }
  };

  if (result) {
    return (
      <div className="space-y-4">
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center space-y-2">
          <p className="text-2xl">✅</p>
          <p className="font-semibold text-green-800">Import réussi</p>
          <div className="flex justify-center gap-6 text-sm text-green-700 mt-1">
            {result.created > 0 && <span><span className="font-bold">{result.created}</span> créé{result.created > 1 ? 's' : ''}</span>}
            {result.updated > 0 && <span><span className="font-bold">{result.updated}</span> mis à jour</span>}
            {result.created === 0 && result.updated === 0 && <span>Aucune modification</span>}
          </div>
        </div>
        <div className="flex justify-end">
          <button type="button" onClick={() => onSuccess(result)} className="btn-primary">Fermer</button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded-lg whitespace-pre-wrap">
          {error}
        </div>
      )}

      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => fileRef.current?.click()}
        className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center cursor-pointer hover:border-indigo-300 hover:bg-indigo-50/40 transition-colors"
      >
        <input
          ref={fileRef}
          type="file"
          accept=".csv"
          className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
        />
        {filename ? (
          <div className="flex items-center justify-center gap-3">
            <FileText size={20} className="text-indigo-500" />
            <div className="text-left">
              <p className="text-sm font-medium text-gray-800">{filename}</p>
              {lineCount > 0 && (
                <p className="text-xs text-indigo-600 mt-0.5">
                  {lineCount} ligne{lineCount > 1 ? 's' : ''} détectée{lineCount > 1 ? 's' : ''}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setCsv(''); setFilename(''); }}
              className="ml-2 p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <div className="space-y-1">
            <Upload size={24} className="mx-auto text-gray-300" />
            <p className="text-sm text-gray-500">Glisser un fichier CSV ou <span className="text-indigo-600 underline">parcourir</span></p>
          </div>
        )}
      </div>

      <div className="bg-gray-50 rounded-lg px-4 py-3 text-xs text-gray-500 space-y-2">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1 min-w-0">
            <p className="font-medium text-gray-700">Format attendu — colonnes :</p>
            <p className="font-mono break-all">{columns.join(', ')}</p>
            <p className="mt-1">
              <span className="font-medium text-gray-600">id</span> renseigné = mise à jour si existe, création sinon.
              Vide ou absent = toujours création.
            </p>
          </div>
          <button
            type="button"
            onClick={handleDownloadTemplate}
            className="shrink-0 flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-800 font-medium transition-colors whitespace-nowrap"
          >
            <Download size={13} /> Télécharger le modèle
          </button>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="btn-secondary">Annuler</button>
        <button
          type="submit"
          disabled={loading || !csv.trim() || lineCount <= 0}
          className="btn-primary flex items-center gap-2"
        >
          {loading ? 'Import en cours…' : `Importer${lineCount > 0 ? ` ${lineCount} ligne${lineCount > 1 ? 's' : ''}` : ''}`}
        </button>
      </div>
    </form>
  );
}
