'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownRendererProps {
  markdown: string;
}

export function MarkdownRenderer({ markdown }: MarkdownRendererProps) {
  return (
    <div className="space-y-4">
      <ReactMarkdown
        components={{
          h1: ({ children }) => (
            <h2 className="text-3xl font-black text-text">{children}</h2>
          ),
          h2: ({ children }) => (
            <h3 className="pt-4 text-2xl font-black text-text">{children}</h3>
          ),
          h3: ({ children }) => (
            <h4 className="pt-2 text-lg font-bold text-text">{children}</h4>
          ),
          p: ({ children }) => (
            <p className="text-base leading-7 text-text-muted">{children}</p>
          ),
          ul: ({ children }) => (
            <ul className="list-disc space-y-2 pl-6 text-base leading-7 text-text-muted">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal space-y-2 pl-6 text-base leading-7 text-text-muted">
              {children}
            </ol>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-primary pl-4 text-text-muted">
              {children}
            </blockquote>
          ),
          a: ({ children, href }) => (
            <a
              className="font-semibold text-primary underline-offset-4 hover:underline"
              href={href}
              rel="noreferrer"
              target="_blank"
            >
              {children}
            </a>
          ),
          code: ({ children, className }) => {
            const isBlock = className?.includes('language-');

            if (isBlock) {
              return (
                <code className="block whitespace-pre-wrap text-xs leading-6 text-text">
                  {children}
                </code>
              );
            }

            return (
              <code className="rounded-[var(--radius-sm)] bg-surface-secondary px-1.5 py-0.5 text-sm font-semibold text-primary">
                {children}
              </code>
            );
          },
          pre: ({ children }) => (
            <pre className="max-h-72 overflow-auto rounded-[var(--radius-lg)] border border-border bg-surface-secondary p-4">
              {children}
            </pre>
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto rounded-[var(--radius-lg)] border border-border">
              <table className="w-full border-collapse text-left text-sm text-text">
                {children}
              </table>
            </div>
          ),
          th: ({ children }) => (
            <th className="border-b border-border bg-surface-secondary px-3 py-2 font-bold">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border-b border-border px-3 py-2 text-text-muted">
              {children}
            </td>
          ),
        }}
        remarkPlugins={[remarkGfm]}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
}
