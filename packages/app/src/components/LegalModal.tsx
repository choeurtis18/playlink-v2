'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? '';

interface LegalModalProps {
  docKey: 'privacy' | 'terms';
  onClose: () => void;
}

export function LegalModal({ docKey, onClose }: LegalModalProps) {
  const [content, setContent] = useState<string | null>(null);
  const [title, setTitle] = useState('');

  useEffect(() => {
    fetch(`${API_URL}/api/legal/${docKey}`)
      .then((r) => r.json())
      .then((j) => {
        setContent(j.data?.content ?? null);
        setTitle(j.data?.title ?? '');
      })
      .catch(() => setContent(null));
  }, [docKey]);

  return (
    <AnimatePresence>
      <motion.div
        key="legal-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 backdrop-blur-sm bg-black/50"
      />
      <motion.div
        key="legal-sheet"
        initial={{ opacity: 0, y: '100%' }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 32 }}
        className="fixed inset-x-0 bottom-0 z-50 max-w-md mx-auto flex flex-col"
        style={{ maxHeight: '85dvh' }}
      >
        <div className="bg-indigo-950 rounded-t-3xl flex flex-col overflow-hidden h-full">
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 shrink-0">
            <h2 className="text-white font-bold text-base">{title}</h2>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 transition-colors">
              <X size={18} className="text-white/60" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-5">
            {content === null ? (
              <p className="text-white/40 text-sm text-center py-8">Chargement…</p>
            ) : (
              <article className="prose prose-sm prose-invert max-w-none">
                <ReactMarkdown
                  components={{
                    h1: ({ children }) => <h1 className="text-xl font-black text-white mt-2 mb-3">{children}</h1>,
                    h2: ({ children }) => <h2 className="text-base font-bold text-white mt-5 mb-2">{children}</h2>,
                    h3: ({ children }) => <h3 className="text-sm font-semibold text-white/90 mt-4 mb-1">{children}</h3>,
                    p: ({ children }) => <p className="text-white/70 text-sm leading-relaxed mb-3">{children}</p>,
                    ul: ({ children }) => <ul className="list-disc pl-5 mb-3 space-y-1 text-sm text-white/70">{children}</ul>,
                    ol: ({ children }) => <ol className="list-decimal pl-5 mb-3 space-y-1 text-sm text-white/70">{children}</ol>,
                    li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                    strong: ({ children }) => <strong className="text-white font-semibold">{children}</strong>,
                  }}
                >
                  {content}
                </ReactMarkdown>
              </article>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
