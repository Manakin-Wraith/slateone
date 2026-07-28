import React from 'react';
import { Film } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="py-12 bg-slate-900 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">

          {/* Logo */}
          <div className="flex items-center gap-2">
            <Film className="h-5 w-5 text-amber-500" />
            <span className="font-bold text-lg tracking-tight text-slate-50">
              Slate<span className="text-amber-500">One</span>
            </span>
            <span className="text-slate-600 text-xs font-mono ml-3">Production Infrastructure</span>
          </div>

          {/* Contact */}
          <div className="flex items-center gap-6 text-xs text-slate-500">
            <a href="mailto:hello@slateone.studio" target="_blank" rel="noopener noreferrer" className="hover:text-amber-500 transition-colors">
              hello@slateone.studio
            </a>
          </div>

        </div>
      </div>
    </footer>
  );
};