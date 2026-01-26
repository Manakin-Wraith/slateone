import React from 'react';
import { X, Check, Clock, Zap } from 'lucide-react';

export const SeeItInAction: React.FC = () => {
  return (
    <section className="py-24 bg-black border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-6">
            See What You Get
          </h2>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            From hours of manual work to minutes of AI-powered automation
          </p>
        </div>

        {/* Before/After Comparison */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          
          {/* Before: Manual */}
          <div className="bg-[#161616] rounded-2xl border border-red-500/30 overflow-hidden">
            <div className="bg-red-500/10 border-b border-red-500/30 p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-red-500/20">
                  <X className="w-6 h-6 text-red-400" />
                </div>
                <h3 className="text-2xl font-bold text-white">The Old Way</h3>
              </div>
              <div className="flex items-center gap-2 text-red-400">
                <Clock className="w-4 h-4" />
                <span className="text-sm font-medium">12+ hours of manual work</span>
              </div>
            </div>
            <div className="p-6">
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-white/60">
                  <span className="text-red-400 mt-1">•</span>
                  <span>Read script line by line, page by page</span>
                </li>
                <li className="flex items-start gap-3 text-white/60">
                  <span className="text-red-400 mt-1">•</span>
                  <span>Type cast, props, locations into Excel manually</span>
                </li>
                <li className="flex items-start gap-3 text-white/60">
                  <span className="text-red-400 mt-1">•</span>
                  <span>Miss props, forget cast members, lose track</span>
                </li>
                <li className="flex items-start gap-3 text-white/60">
                  <span className="text-red-400 mt-1">•</span>
                  <span>Script changes? Start over from scratch</span>
                </li>
                <li className="flex items-start gap-3 text-white/60">
                  <span className="text-red-400 mt-1">•</span>
                  <span>Send Excel file, hope everyone has the right version</span>
                </li>
              </ul>
              <div className="mt-6 p-4 bg-red-500/5 border border-red-500/20 rounded-lg">
                <p className="text-sm text-red-400 font-medium">
                  Result: Errors, missed items, wasted Sundays
                </p>
              </div>
            </div>
          </div>

          {/* After: SlateOne */}
          <div className="bg-[#161616] rounded-2xl border border-neon/30 overflow-hidden shadow-[0_0_30px_-5px_rgba(227,255,0,0.2)]">
            <div className="bg-neon/10 border-b border-neon/30 p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-neon/20">
                  <Check className="w-6 h-6 text-neon" />
                </div>
                <h3 className="text-2xl font-bold text-white">With SlateOne</h3>
              </div>
              <div className="flex items-center gap-2 text-neon">
                <Zap className="w-4 h-4" />
                <span className="text-sm font-medium">2 minutes. Automated.</span>
              </div>
            </div>
            <div className="p-6">
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-white/70">
                  <span className="text-neon mt-1">✓</span>
                  <span>Upload PDF script (drag & drop)</span>
                </li>
                <li className="flex items-start gap-3 text-white/70">
                  <span className="text-neon mt-1">✓</span>
                  <span>AI extracts everything automatically</span>
                </li>
                <li className="flex items-start gap-3 text-white/70">
                  <span className="text-neon mt-1">✓</span>
                  <span>Verify breakdown, make quick edits if needed</span>
                </li>
                <li className="flex items-start gap-3 text-white/70">
                  <span className="text-neon mt-1">✓</span>
                  <span>Script changes? Re-upload, update in seconds</span>
                </li>
                <li className="flex items-start gap-3 text-white/70">
                  <span className="text-neon mt-1">✓</span>
                  <span>Export or Print your breakdown in seconds</span>
                </li>
              </ul>
              <div className="mt-6 p-4 bg-neon/5 border border-neon/20 rounded-lg">
                <p className="text-sm text-neon font-medium">
                  Result: Accurate, fast, collaborative
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Sample Output Table */}
        <div className="bg-[#161616] rounded-2xl border border-white/10 overflow-hidden">
          <div className="bg-white/5 border-b border-white/10 p-6">
            <h3 className="text-2xl font-bold text-white mb-2">Output Example</h3>
            <p className="text-white/60 text-sm">
              This is what you get after uploading your script — ready to export or share
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-white/5 border-b border-white/10">
                  <th className="text-left p-4 text-sm font-bold text-neon uppercase tracking-wider">Scene</th>
                  <th className="text-left p-4 text-sm font-bold text-neon uppercase tracking-wider">Location</th>
                  <th className="text-left p-4 text-sm font-bold text-neon uppercase tracking-wider">Cast</th>
                  <th className="text-left p-4 text-sm font-bold text-neon uppercase tracking-wider">Props</th>
                  <th className="text-left p-4 text-sm font-bold text-neon uppercase tracking-wider">Time</th>
                  <th className="text-left p-4 text-sm font-bold text-neon uppercase tracking-wider">Pages</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="p-4 text-white/80 font-mono text-sm">1. INT. APARTMENT</td>
                  <td className="p-4 text-white/60 text-sm">Johannesburg Apartment</td>
                  <td className="p-4 text-white/60 text-sm">Thabo, Sarah</td>
                  <td className="p-4 text-white/60 text-sm">Coffee mug, Laptop, Phone</td>
                  <td className="p-4 text-white/60 text-sm">Day</td>
                  <td className="p-4 text-white/60 text-sm">2/8</td>
                </tr>
                <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="p-4 text-white/80 font-mono text-sm">2. EXT. MABONENG</td>
                  <td className="p-4 text-white/60 text-sm">Maboneng Precinct</td>
                  <td className="p-4 text-white/60 text-sm">Taxi Driver, Pedestrians</td>
                  <td className="p-4 text-white/60 text-sm">Red Taxi, Traffic cones</td>
                  <td className="p-4 text-white/60 text-sm">Day</td>
                  <td className="p-4 text-white/60 text-sm">4/8</td>
                </tr>
                <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="p-4 text-white/80 font-mono text-sm">3. INT. HOSPITAL</td>
                  <td className="p-4 text-white/60 text-sm">Charlotte Maxeke Hospital</td>
                  <td className="p-4 text-white/60 text-sm">Doctor, Nurse, Thabo</td>
                  <td className="p-4 text-white/60 text-sm">Medical chart, Stethoscope</td>
                  <td className="p-4 text-white/60 text-sm">Night</td>
                  <td className="p-4 text-white/60 text-sm">2/8</td>
                </tr>
                <tr className="hover:bg-white/5 transition-colors">
                  <td className="p-4 text-white/80 font-mono text-sm">4. EXT. ROOFTOP</td>
                  <td className="p-4 text-white/60 text-sm">Braamfontein Rooftop</td>
                  <td className="p-4 text-white/60 text-sm">Thabo, Sarah</td>
                  <td className="p-4 text-white/60 text-sm">Wine bottle, Blanket</td>
                  <td className="p-4 text-white/60 text-sm">Night</td>
                  <td className="p-4 text-white/60 text-sm">6/8</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="bg-white/5 border-t border-white/10 p-4 flex items-center justify-between">
            <p className="text-sm text-white/50">
              Export to: PDF • CSV
            </p>
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-neon/10 border border-neon/30 rounded text-xs text-neon font-medium">
                4 Scenes
              </span>
              <span className="px-3 py-1 bg-cyan/10 border border-cyan/30 rounded text-xs text-cyan font-medium">
                14/8 Pages
              </span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
