import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ArrowLeft } from 'lucide-react';

interface LegalDocumentProps {
  title: string;
  content: string;
  onBack: () => void;
}

export const LegalDocument: React.FC<LegalDocumentProps> = ({ title, content, onBack }) => {
  return (
    <div className="min-h-screen bg-charcoal pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back button */}
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-white/70 hover:text-neon transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </button>

        {/* Document header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
            {title}
          </h1>
          <div className="h-1 w-20 bg-cyan"></div>
        </div>

        {/* Document content */}
        <div className="prose prose-invert prose-lg max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ children }) => (
                <h1 className="text-3xl font-display font-bold text-white mt-12 mb-6 first:mt-0">
                  {children}
                </h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-2xl font-display font-bold text-white mt-10 mb-4">
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-xl font-display font-semibold text-white mt-8 mb-3">
                  {children}
                </h3>
              ),
              p: ({ children }) => (
                <p className="text-white/80 leading-relaxed mb-6">
                  {children}
                </p>
              ),
              ul: ({ children }) => (
                <ul className="list-disc list-inside text-white/80 space-y-2 mb-6 ml-4">
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal list-inside text-white/80 space-y-2 mb-6 ml-4">
                  {children}
                </ol>
              ),
              li: ({ children }) => (
                <li className="text-white/80 leading-relaxed">
                  {children}
                </li>
              ),
              a: ({ href, children }) => (
                <a
                  href={href}
                  className="text-cyan hover:text-neon underline transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {children}
                </a>
              ),
              strong: ({ children }) => (
                <strong className="text-white font-semibold">
                  {children}
                </strong>
              ),
              em: ({ children }) => (
                <em className="text-white/90 italic">
                  {children}
                </em>
              ),
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-cyan pl-6 py-2 my-6 text-white/70 italic">
                  {children}
                </blockquote>
              ),
              code: ({ children }) => (
                <code className="bg-white/5 text-cyan px-2 py-1 rounded text-sm font-mono">
                  {children}
                </code>
              ),
              pre: ({ children }) => (
                <pre className="bg-white/5 p-4 rounded-lg overflow-x-auto mb-6">
                  {children}
                </pre>
              ),
            }}
          >
            {content}
          </ReactMarkdown>
        </div>

        {/* Scroll to top button */}
        <div className="mt-16 text-center">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="text-white/50 hover:text-cyan transition-colors text-sm"
          >
            Back to Top ↑
          </button>
        </div>
      </div>
    </div>
  );
};
