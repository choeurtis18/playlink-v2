'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export interface RuleSlide {
  id: string;
  imageUrl: string | null;
  title: string;
  content: string;
}

interface RulesModalProps {
  slides: RuleSlide[];
  gameColors: { colorMain: string; colorSecondary: string };
  onClose: () => void;
}

export function RulesModal({ slides, gameColors, onClose }: RulesModalProps) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const goTo = (next: number) => {
    if (next < 0 || next >= slides.length) return;
    setDirection(next > index ? 1 : -1);
    setIndex(next);
  };

  const slide = slides[index];
  if (!slide) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="rules-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
      />
      <motion.div
        key="rules-sheet"
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 32 }}
        className="fixed bottom-0 inset-x-0 z-50 rounded-t-3xl flex flex-col overflow-hidden"
        style={{ height: '85dvh', background: '#0f0f1a' }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4 shrink-0"
          style={{ background: `linear-gradient(135deg, ${gameColors.colorMain}, ${gameColors.colorSecondary})` }}
        >
          <p className="text-white font-black text-base">📖 Règles du jeu</p>
          <button onClick={onClose} className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors">
            <X size={18} className="text-white" />
          </button>
        </div>

        {/* Slide content */}
        <div className="flex-1 overflow-hidden">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={index}
              custom={direction}
              initial={{ x: direction * 80, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: direction * -80, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 350, damping: 30 }}
              className="h-full overflow-y-auto flex flex-col"
            >
              {/* Image / GIF / Vidéo */}
              {slide.imageUrl && (
                <div className="w-full shrink-0 bg-black" style={{ height: '40%' }}>
                  {slide.imageUrl.match(/\.(mp4|webm|mov)$/i) ? (
                    <video
                      src={slide.imageUrl}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={slide.imageUrl} alt={slide.title} className="w-full h-full object-cover" />
                  )}
                </div>
              )}

              {/* Titre */}
              <div className="px-4 py-4 shrink-0">
                <p className="text-white font-black text-2xl leading-tight">{slide.title}</p>
              </div>

              {/* Contenu Markdown */}
              <div className="px-4 pb-4 flex-1 overflow-y-auto">
                <article className="prose prose-sm prose-invert max-w-none">
                  <ReactMarkdown
                    components={{
                      h1: ({ children }) => <h1 className="text-lg font-black text-white mt-3 mb-2">{children}</h1>,
                      h2: ({ children }) => <h2 className="text-base font-bold text-white mt-4 mb-2">{children}</h2>,
                      h3: ({ children }) => <h3 className="text-sm font-semibold text-white/90 mt-3 mb-1">{children}</h3>,
                      p: ({ children }) => <p className="text-white/70 text-sm leading-relaxed mb-2">{children}</p>,
                      ul: ({ children }) => <ul className="list-disc pl-5 mb-2 space-y-1 text-sm text-white/70">{children}</ul>,
                      ol: ({ children }) => <ol className="list-decimal pl-5 mb-2 space-y-1 text-sm text-white/70">{children}</ol>,
                      li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                      strong: ({ children }) => <strong className="text-white font-semibold">{children}</strong>,
                      em: ({ children }) => <em className="text-white/80 italic">{children}</em>,
                      hr: () => <hr className="my-3 border-white/20" />,
                    }}
                  >
                    {slide.content}
                  </ReactMarkdown>
                </article>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="shrink-0 px-4 py-4 flex items-center justify-between border-t border-white/10">
          <button
            onClick={() => goTo(index - 1)}
            disabled={index === 0}
            className="p-3 rounded-full bg-white/10 disabled:opacity-30 hover:bg-white/20 transition-colors"
          >
            <ChevronLeft size={20} className="text-white" />
          </button>

          <div className="flex gap-2 items-center">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className="rounded-full transition-all duration-300"
                style={{
                  width: i === index ? 24 : 7,
                  height: 7,
                  background: i === index ? gameColors.colorMain : 'rgba(255,255,255,0.25)',
                }}
              />
            ))}
          </div>

          <button
            onClick={() => goTo(index + 1)}
            disabled={index === slides.length - 1}
            className="p-3 rounded-full bg-white/10 disabled:opacity-30 hover:bg-white/20 transition-colors"
          >
            <ChevronRight size={20} className="text-white" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
