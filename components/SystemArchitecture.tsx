import React from 'react';
import { ChevronDown } from 'lucide-react';

const flowSteps = [
  { label: 'Script', sublabel: 'PDF Upload', accent: false },
  { label: 'Structured Production Data', sublabel: 'Scenes, Cast, Props, Locations, FX', accent: true },
  { label: 'Reports / Kanban / Scheduling', sublabel: 'Dynamic, Connected, Real-Time', accent: true },
  { label: 'Production Execution', sublabel: 'Operational Control', accent: false },
];

export const SystemArchitecture: React.FC = () => {
  return (
    <section className="py-32 bg-black border-b border-white/5 relative overflow-hidden">
      {/* Subtle grid */}
      <div className="absolute inset-0 opacity-[0.02] bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] [background-size:40px_40px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">


        <div className="text-center mb-20">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-6 leading-[1.1]">
            From Script to<br/>Production Control
          </h2>
          <p className="text-lg text-white/40 max-w-2xl mx-auto leading-relaxed">
            One continuous data pipeline. Every stage connected. No fragmentation.
          </p>
        </div>

        {/* Flow Diagram */}
        <div className="max-w-lg mx-auto">
          {flowSteps.map((step, i) => (
            <React.Fragment key={i}>
              <div className={`
                relative border rounded-xl p-8 text-center transition-all duration-300
                ${step.accent 
                  ? 'bg-neon/[0.03] border-neon/20 hover:border-neon/40' 
                  : 'bg-white/[0.02] border-white/[0.08] hover:border-white/20'
                }
              `}>
                <p className={`font-display text-xl font-bold mb-1 ${step.accent ? 'text-neon' : 'text-white'}`}>
                  {step.label}
                </p>
                <p className="text-xs text-white/30 font-mono tracking-wide">
                  {step.sublabel}
                </p>
              </div>
              {i < flowSteps.length - 1 && (
                <div className="flex justify-center py-3">
                  <ChevronDown className="w-5 h-5 text-white/15" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Reinforcement line */}
        <div className="mt-20 text-center">
          <p className="text-sm text-white/20 font-mono tracking-widest uppercase">
            One System. Complete Visibility. Operational Control.
          </p>
        </div>

      </div>
    </section>
  );
};
