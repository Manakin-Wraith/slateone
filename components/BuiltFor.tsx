import React from 'react';

const roles = [
  { title: 'Production Companies', description: 'Centralized operational control across all active productions.' },
  { title: 'Producers', description: 'System-level visibility from script to scheduling to execution.' },
  { title: 'Line Producers', description: 'Structured breakdown data connected directly to budget and schedule.' },
  { title: 'UPMs', description: 'Dynamic reporting and resource allocation from a single data source.' },
  { title: 'First Assistant Directors', description: 'Connected scheduling intelligence built on real breakdown data.' },
];

export const BuiltFor: React.FC = () => {
  return (
    <section className="py-32 bg-charcoal border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">


        <div className="grid lg:grid-cols-2 gap-16 items-start">

          {/* Left: Statement */}
          <div>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-8 leading-[1.1]">
              Built for Serious<br/>Production Teams
            </h2>
            <p className="text-lg text-white/40 leading-relaxed max-w-lg mb-8">
              SlateOne is designed for production companies that treat filmmaking as an 
              operational discipline — not a collection of disconnected tools.
            </p>
            <div className="border-l-2 border-neon/30 pl-6">
              <p className="text-white/50 text-sm leading-relaxed italic">
                "I am loving SlateOne and will highly recommend it to my colleagues! It just did an excellent script breakdown and DOOD's for my film Umbulali — saved me so much time and $'s."
              </p>
              <p className="text-xs text-white/30 font-mono mt-3 tracking-wide">
                — Dan Jawitz, Film producer
              </p>
            </div>
          </div>

          {/* Right: Roles */}
          <div className="space-y-0">
            {roles.map((role, i) => (
              <div key={i} className="border-b border-white/[0.06] py-6 first:pt-0 last:border-b-0 group">
                <div className="flex items-start gap-4">
                  <span className="w-2 h-2 rounded-full bg-neon/40 mt-2.5 flex-shrink-0 group-hover:bg-neon transition-colors" />
                  <div>
                    <p className="text-white font-medium mb-1">{role.title}</p>
                    <p className="text-sm text-white/30">{role.description}</p>
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
