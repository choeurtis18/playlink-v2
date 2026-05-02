'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

const EMOJI_GROUPS: { label: string; emojis: string[] }[] = [
  {
    label: 'Jeux & Fête',
    emojis: ['🎲', '🎮', '🃏', '🎯', '🎳', '🎰', '🎪', '🎠', '🎡', '🎢', '🎭', '🎬', '🎤', '🎸', '🎵', '🎶', '🥳', '🎉', '🎊', '🪅', '🎁', '🏆', '🥇', '🎖️'],
  },
  {
    label: 'Émotions & Personnes',
    emojis: ['😂', '🤣', '😈', '😏', '🤔', '😳', '🥵', '🤯', '😎', '🥴', '😬', '🙈', '💀', '👀', '🫣', '🤭', '😇', '🤠', '👑', '🫡', '🤡', '👻', '🫂', '💬'],
  },
  {
    label: 'Alcool & Soirée',
    emojis: ['🍺', '🍻', '🥂', '🍷', '🥃', '🍸', '🍹', '🧃', '🫗', '🍾', '🎰', '🕺', '💃', '🪩', '🌙', '⭐', '✨', '💫', '🔥', '💥', '⚡', '🌈'],
  },
  {
    label: 'Amour & Relations',
    emojis: ['❤️', '🔥', '💕', '💔', '😍', '🥰', '💋', '💑', '👫', '💏', '🫀', '💘', '💝', '💖', '💗', '💓', '💞', '💟', '🩷', '🩶', '🖤', '🤍'],
  },
  {
    label: 'Divers',
    emojis: ['💣', '🔮', '🧿', '🪬', '🧲', '🪄', '🔑', '🗝️', '⚔️', '🛡️', '🎭', '🧩', '🎑', '🌀', '♾️', '☯️', '🔴', '🟠', '🟡', '🟢', '🔵', '🟣'],
  },
];

interface EmojiPickerProps {
  value: string;
  onChange: (emoji: string) => void;
}

export function EmojiPicker({ value, onChange }: EmojiPickerProps) {
  const [open, setOpen] = useState(false);
  const [custom, setCustom] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleCustom = (val: string) => {
    setCustom(val);
    if (val.trim()) onChange(val.trim());
  };

  const handleSelect = (emoji: string) => {
    onChange(emoji);
    setCustom('');
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onMouseDown={(e) => e.stopPropagation()}
        onClick={() => setOpen((o) => !o)}
        className="input flex items-center gap-2 w-full text-left"
      >
        <span className="text-xl leading-none">{value || '—'}</span>
        <span className="text-sm text-gray-400 flex-1 truncate">{value || 'Choisir…'}</span>
        <ChevronDown size={14} className={`text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute z-50 top-full left-0 mt-1 w-80 bg-white rounded-xl border border-gray-200 shadow-lg p-3 space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Coller un emoji personnalisé</label>
            <input
              type="text"
              value={custom}
              onChange={(e) => handleCustom(e.target.value)}
              placeholder="Coller ici…"
              className="input text-sm"
              autoFocus
            />
          </div>

          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {EMOJI_GROUPS.map((group) => (
              <div key={group.label}>
                <p className="text-xs font-medium text-gray-400 mb-1">{group.label}</p>
                <div className="flex flex-wrap gap-1">
                  {group.emojis.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => handleSelect(emoji)}
                      className={`w-8 h-8 flex items-center justify-center rounded-lg text-lg hover:bg-indigo-50 transition-colors ${value === emoji ? 'bg-indigo-100 ring-1 ring-indigo-400' : ''}`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
