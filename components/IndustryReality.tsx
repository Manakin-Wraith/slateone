import React from 'react';

const painPoints = [
  { label: 'Manual script breakdowns', detail: 'Line-by-line, page-by-page data entry' },
  { label: 'Static PDF reports', detail: 'Outdated the moment a revision drops' },
  { label: 'Excel-based scheduling', detail: 'Disconnected from breakdown data' },
  { label: 'Fragmented crew communication', detail: 'WhatsApp threads, email chains, lost context' },
  { label: 'No central production data layer', detail: 'Every department operates in isolation' },
];

export const IndustryReality: React.FC = () => {
  return (
    <section className="py-32 bg-black border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section label */}
        <div className="inline-flex items-center space-x-3 mb-6">
          <span className="h-px w-12 bg-white/20"></span>
          <span className="text-xs font-mono text-white/40 tracking-[0.2em] uppercase">The Problem</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          
          {/* Left: Statement */}
          <div>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-8 leading-[1.1]">
              The Way Productions<br/>Still Operate
            </h2>
            <p className="text-lg text-white/40 leading-relaxed max-w-lg">
              Most productions still rely on disconnected systems — spreadsheets for breakdown, 
              PDFs for reports, chat apps for coordination. The result is friction at every stage 
              of production.
            </p>
            
            {/* Consequence block */}
            <div className="mt-10 border-l-2 border-white/10 pl-6">
              <p className="text-sm text-white/30 uppercase tracking-widest font-mono mb-3">The Cost</p>
              <div className="flex flex-wrap gap-3">
                {['Administrative drag', 'Data duplication', 'Version confusion', 'Lost time', 'Operational risk'].map((item) => (
                  <span key={item} className="text-xs text-white/50 bg-white/[0.03] border border-white/[0.06] px-3 py-1.5 rounded font-mono">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Pain points */}
          <div className="space-y-0">
            {painPoints.map((point, i) => (
              <div key={i} className="group border-b border-white/[0.06] py-6 first:pt-0 last:border-b-0">
                <div className="flex items-start gap-4">
                  <span className="text-xs font-mono text-white/20 mt-1 w-6 flex-shrink-0">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <p className="text-white/80 font-medium mb-1">{point.label}</p>
                    <p className="text-sm text-white/30">{point.detail}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};
