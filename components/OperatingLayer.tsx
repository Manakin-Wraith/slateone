import React from 'react';
import { FileText, BarChart3, LayoutGrid, Calendar } from 'lucide-react';

const capabilities = [
  {
    icon: <FileText className="w-5 h-5" />,
    title: 'Script → Structured Data',
    description: 'Your script is converted into structured production data — scenes, cast, props, locations, FX, wardrobe, and vehicles extracted and classified automatically.',
  },
  {
    icon: <BarChart3 className="w-5 h-5" />,
    title: 'Breakdown → Dynamic Reports',
    description: 'Reports generate directly from your breakdown data — no static PDFs to redo by hand. When a revision drops, every report and view updates with it.',
  },
  {
    icon: <LayoutGrid className="w-5 h-5" />,
    title: 'Visualization → Stripboard Control',
    description: 'See your production by story day, location, and character on a zoomable stripboard — one shared view your whole team can work from.',
  },
  {
    icon: <Calendar className="w-5 h-5" />,
    title: 'Scheduling → Connected to Breakdown',
    description: 'Your shooting schedule stays connected to the breakdown it came from — change one and the other reflects it, instead of drifting apart in separate spreadsheets.',
  },
];

export const OperatingLayer: React.FC = () => {
  return (
    <section className="py-32 bg-slate-900 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="max-w-3xl mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-50 mb-6 leading-[1.1]">
            From Script to<br/>Shooting Schedule
          </h2>
          <p className="text-lg text-slate-400 leading-relaxed">
            SlateOne isn't a script analyzer, a breakdown app, and a scheduling tool bolted
            together — it's one system that takes your script all the way to a shootable
            schedule, with everything staying connected along the way.
          </p>
        </div>

        {/* Capability grid */}
        <div className="grid md:grid-cols-2 gap-px bg-slate-800 border border-slate-800 rounded-xl overflow-hidden">
          {capabilities.map((cap, i) => (
            <div key={i} className="bg-slate-900 p-10 group hover:bg-slate-800/60 transition-colors duration-300">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 group-hover:bg-amber-500/20 transition-colors">
                  {cap.icon}
                </div>
                <span className="text-[10px] font-mono text-slate-600 uppercase tracking-widest">
                  {String(i + 1).padStart(2, '0')}
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-50 mb-3">
                {cap.title}
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                {cap.description}
              </p>
            </div>
          ))}
        </div>

        {/* Reinforcement line — folded in from the retired SystemArchitecture section */}
        <p className="mt-12 text-center text-sm text-slate-500 font-mono tracking-widest uppercase">
          One script in. One connected system out.
        </p>

      </div>
    </section>
  );
};
