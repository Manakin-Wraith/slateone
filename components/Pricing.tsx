import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { TierSelectionModal } from './TierSelectionModal';

export const Pricing: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <section id="pricing" className="bg-black relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.02] bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] [background-size:40px_40px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* ═══════════════════════════════════════════════ */}
        {/* SECTION 1: Pricing Header */}
        {/* ═══════════════════════════════════════════════ */}
        <div className="py-32 border-b border-white/5">

          <div className="max-w-3xl mb-8">
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-6 leading-[1.1]">
              Simple Pricing.<br/>Unlimited Breakdowns.
            </h2>
            <p className="text-lg text-white/40 leading-relaxed mb-6">
              One plan. No limits. No per-script charges.
              Get full access to the entire SlateOne system
              for a flat monthly fee.
            </p>
            <p className="text-sm text-white/30 font-mono">
              Everything included. Cancel anytime.
            </p>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════ */}
        {/* SECTION 2: Single Plan */}
        {/* ═══════════════════════════════════════════════ */}
        <div className="py-32 border-b border-white/5">

          <div className="max-w-2xl mx-auto">
            <div className="border border-white/[0.08] rounded-2xl overflow-hidden bg-white/[0.02]">

              {/* Plan Header */}
              <div className="p-10 text-center border-b border-white/[0.06]">
                <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-neon bg-neon/10 border border-neon/20 px-3 py-1 rounded inline-block mb-6">
                  Monthly
                </span>
                <div className="flex items-baseline justify-center gap-1 mb-3">
                  <span className="text-6xl md:text-7xl font-bold text-white">$49</span>
                  <span className="text-lg text-white/30 font-mono">/mo</span>
                </div>
                <p className="text-white/40 text-sm">
                  Unlimited breakdowns &middot; Full production infrastructure
                </p>
              </div>

              {/* Features List */}
              <div className="p-10 space-y-4">
                {[
                  'Unlimited script breakdowns',
                  'Props / characters / locations extraction',
                  'Full production workspace',
                  'Production scheduling',
                  'Stripboards & Kanban visualization',
                  'Department reports',
                  'No per-seat charges',
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-[15px] text-white/50">
                    <Check className="w-4 h-4 text-neon/40 flex-shrink-0" />
                    {item}
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="px-10 pb-10">
                <button
                  onClick={() => setModalOpen(true)}
                  className="w-full bg-neon text-black font-bold py-4 px-6 rounded-lg hover:bg-white transition-all duration-300 text-sm uppercase tracking-wide cursor-pointer shadow-[0_0_30px_-5px_rgba(227,255,0,0.3)]"
                >
                  Get Started
                </button>
                <p className="text-[10px] text-white/20 text-center mt-4 font-mono">
                  Cancel anytime. No long-term contracts.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════ */}
        {/* SECTION 3: Who This Is For */}
        {/* ═══════════════════════════════════════════════ */}
        <div className="py-32">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-[10px] font-mono text-white/30 uppercase tracking-[0.2em] mb-6">Built For</p>
            <h3 className="font-display text-3xl md:text-4xl font-bold text-white mb-8 leading-[1.1]">
              Who This Is For
            </h3>

            <div className="flex flex-wrap justify-center gap-3 mb-10">
              {['Indie filmmakers', 'Production companies', 'Studios', 'Producers', 'Line producers', 'UPMs'].map((role) => (
                <span key={role} className="text-sm text-white/50 bg-white/[0.03] border border-white/[0.06] px-5 py-2.5 rounded-lg font-mono">
                  {role}
                </span>
              ))}
            </div>

            <p className="text-lg text-white/40 leading-relaxed mb-2">
              If your production runs on spreadsheets and fragmented tools,
            </p>
            <p className="text-lg text-white/70 font-medium">
              SlateOne replaces that system.
            </p>
          </div>
        </div>

      </div>

      {/* Payment Modal */}
      <TierSelectionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        tier="monthly"
      />
    </section>
  );
};
