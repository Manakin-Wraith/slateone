import React from 'react';
import { FileText, BarChart3, LayoutGrid, Calendar } from 'lucide-react';

const capabilities = [
  {
    icon: <FileText className="w-5 h-5" />,
    title: 'Script → Structured Data',
    description: 'Scripts are converted into structured production data — scenes, cast, props, locations, FX, wardrobe, and vehicles extracted and classified automatically.',
  },
  {
    icon: <BarChart3 className="w-5 h-5" />,
    title: 'Breakdown → Dynamic Reports',
    description: 'Reports generated dynamically from production data. No static PDFs. Revisions propagate instantly across every report and view.',
  },
  {
    icon: <LayoutGrid className="w-5 h-5" />,
    title: 'Visualization → Kanban Control',
    description: 'Production elements visualized by story day, location, and character. Kanban boards provide operational clarity across departments.',
  },
  {
    icon: <Calendar className="w-5 h-5" />,
    title: 'Scheduling → Connected Intelligence',
    description: 'Scheduling connected directly to breakdown data. Changes in one propagate to the other. One system controlling production flow.',
  },
];

export const OperatingLayer: React.FC = () => {
  return (
    <section className="py-32 bg-charcoal border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">


        <div className="max-w-3xl mb-20">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-6 leading-[1.1]">
            A Production<br/>Operating Layer
          </h2>
          <p className="text-lg text-white/40 leading-relaxed">
            SlateOne is not a script analyzer. Not a breakdown app. Not a scheduling tool. 
            It is the production infrastructure that consolidates, transforms, and centralizes 
            every operational workflow into a single source of production truth.
          </p>
        </div>

        {/* Capability grid */}
        <div className="grid md:grid-cols-2 gap-px bg-white/[0.06] border border-white/[0.06] rounded-xl overflow-hidden">
          {capabilities.map((cap, i) => (
            <div key={i} className="bg-charcoal p-10 group hover:bg-white/[0.02] transition-colors duration-300">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-lg bg-neon/10 border border-neon/20 flex items-center justify-center text-neon group-hover:bg-neon/20 transition-colors">
                  {cap.icon}
                </div>
                <span className="text-[10px] font-mono text-white/20 uppercase tracking-widest">
                  {String(i + 1).padStart(2, '0')}
                </span>
              </div>
              <h3 className="text-xl font-display font-bold text-white mb-3">
                {cap.title}
              </h3>
              <p className="text-sm text-white/40 leading-relaxed">
                {cap.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
