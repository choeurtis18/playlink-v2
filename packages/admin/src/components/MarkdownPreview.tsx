'use client';

import ReactMarkdown from 'react-markdown';

interface MarkdownPreviewProps {
  content: string;
}

export function MarkdownPreview({ content }: MarkdownPreviewProps) {
  if (!content.trim()) {
    return (
      <div className="text-sm text-gray-400 italic">
        Aucun contenu à prévisualiser.
      </div>
    );
  }

  return (
    <article className="prose prose-sm max-w-none text-gray-800">
      <ReactMarkdown
        components={{
          h1: ({ children }) => <h1 className="text-2xl font-black mt-2 mb-3">{children}</h1>,
          h2: ({ children }) => <h2 className="text-xl font-bold mt-4 mb-2">{children}</h2>,
          h3: ({ children }) => <h3 className="text-lg font-semibold mt-3 mb-2">{children}</h3>,
          p: ({ children }) => <p className="text-sm leading-relaxed mb-3">{children}</p>,
          ul: ({ children }) => <ul className="list-disc pl-5 mb-3 space-y-1 text-sm">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal pl-5 mb-3 space-y-1 text-sm">{children}</ol>,
          li: ({ children }) => <li className="leading-relaxed">{children}</li>,
          strong: ({ children }) => <strong className="font-bold text-indigo-600">{children}</strong>,
          em: ({ children }) => <em className="italic">{children}</em>,
          code: ({ children }) => <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">{children}</code>,
        }}
      >
        {content}
      </ReactMarkdown>
    </article>
  );
}
