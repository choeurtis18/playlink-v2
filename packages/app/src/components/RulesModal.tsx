'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface RulesModalProps {
  rules: string;
  gameColors: { colorMain: string; colorSecondary: string };
  onClose: () => void;
}

export function RulesModal({ rules, gameColors, onClose }: RulesModalProps) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex flex-col"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 backdrop-blur-sm bg-black/40"
        />

        <div className="relative z-10 h-full flex flex-col">
          <div
            className="flex items-center justify-between p-4 border-b"
            style={{
              background: `linear-gradient(135deg, ${gameColors.colorMain}, ${gameColors.colorSecondary})`,
              borderColor: 'rgba(255, 255, 255, 0.1)',
            }}
          >
            <h2 className="text-lg font-bold text-white">📖 Règles du jeu</h2>
            <motion.button
              onClick={onClose}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="p-1.5 rounded-full text-white hover:bg-white/20 transition-colors"
            >
              <X size={20} />
            </motion.button>
          </div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="flex-1 overflow-y-auto p-6 bg-white dark:bg-gray-900"
          >
            <article className="prose prose-sm dark:prose-invert max-w-none text-gray-800 dark:text-gray-100">
              <ReactMarkdown
                components={{
                  h1: ({ children }) => <h1 className="text-2xl font-black mt-2 mb-3">{children}</h1>,
                  h2: ({ children }) => <h2 className="text-xl font-bold mt-4 mb-2">{children}</h2>,
                  h3: ({ children }) => <h3 className="text-lg font-semibold mt-3 mb-2">{children}</h3>,
                  p: ({ children }) => <p className="text-sm leading-relaxed mb-3">{children}</p>,
                  ul: ({ children }) => <ul className="list-disc pl-5 mb-3 space-y-1 text-sm">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal pl-5 mb-3 space-y-1 text-sm">{children}</ol>,
                  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                  strong: ({ children }) => <strong className="font-bold" style={{ color: gameColors.colorMain }}>{children}</strong>,
                  em: ({ children }) => <em className="italic">{children}</em>,
                  code: ({ children }) => <code className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-xs">{children}</code>,
                }}
              >
                {rules}
              </ReactMarkdown>
            </article>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
