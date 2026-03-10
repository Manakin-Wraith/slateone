import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { TierSelectionModal } from './TierSelectionModal';
import { SubscriptionTier } from '../lib/supabase';

export const Pricing: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState<SubscriptionTier>('single_script');

  const handleTierSelect = (tier: SubscriptionTier) => {
    setSelectedTier(tier);
    setModalOpen(true);
  };

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
              Pay Only When<br/>You Use It
            </h2>
            <p className="text-lg text-white/40 leading-relaxed mb-6">
              No subscriptions. No monthly commitments.
              Buy breakdown packs, get full production infrastructure,
              and archive only if you need it.
            </p>
            <p className="text-sm text-white/30 font-mono">
              Volume discounts reward heavy users. Every breakdown gets the full system.
            </p>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════ */}
        {/* SECTION 2: Script Packs */}
        {/* ═══════════════════════════════════════════════ */}
        <div className="py-32 border-b border-white/5">

          <div className="grid lg:grid-cols-2 gap-16 items-start mb-16">
            <div>
              <h3 className="font-display text-3xl md:text-4xl font-bold text-white mb-6 leading-[1.1]">
                Breakdown<br/>Packs
              </h3>
              <p className="text-lg text-white/40 leading-relaxed mb-6">
                Purchase breakdowns upfront. Use them when you're ready.
              </p>
              <p className="text-xs text-white/20 font-mono">
                Unused credits valid for up to 12 months on packs.
              </p>
            </div>

            {/* Packs Table */}
            <div className="border border-white/[0.06] rounded-xl overflow-hidden">
              <div className="bg-white/[0.02] px-6 py-4 border-b border-white/[0.06]">
                <div className="grid grid-cols-4 text-[10px] font-mono text-white/30 uppercase tracking-[0.15em]">
                  <span>Pack</span>
                  <span className="text-right">Price</span>
                  <span className="text-right">Per Breakdown</span>
                  <span className="text-right">Validity</span>
                </div>
              </div>
              {[
                { pack: '1 Breakdown', price: 'R500', per: 'R500', validity: '6 months', tier: 'single_script' as SubscriptionTier },
                { pack: '5 Breakdowns', price: 'R2,000', per: 'R400', validity: '12 months', tier: 'pack_5' as SubscriptionTier },
                { pack: '10 Breakdowns', price: 'R3,500', per: 'R350', validity: '12 months', tier: 'pack_10' as SubscriptionTier },
                { pack: '25 Breakdowns', price: 'R7,500', per: 'R300', validity: '12 months', tier: 'pack_25' as SubscriptionTier },
              ].map((row, i) => (
                <button
                  key={i}
                  onClick={() => handleTierSelect(row.tier)}
                  className="grid grid-cols-4 px-6 py-4 border-b border-white/[0.04] last:border-b-0 items-center w-full text-left hover:bg-white/[0.02] transition-colors duration-200 cursor-pointer"
                >
                  <span className="text-sm text-white/70 font-medium">{row.pack}</span>
                  <span className="text-sm font-bold text-neon text-right">{row.price}</span>
                  <span className="text-xs text-white/40 text-right">{row.per}</span>
                  <span className="text-xs text-white/30 font-mono text-right">{row.validity}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Highlighted CTA */}
          <div className="grid md:grid-cols-4 gap-px bg-white/[0.04] border border-white/[0.06] rounded-xl overflow-hidden">
            {[
              { pack: '1 Breakdown', price: 'R500', tier: 'single_script' as SubscriptionTier, highlight: false },
              { pack: '5 Breakdowns', price: 'R2,000', tier: 'pack_5' as SubscriptionTier, highlight: false },
              { pack: '10 Breakdowns', price: 'R3,500', tier: 'pack_10' as SubscriptionTier, highlight: true },
              { pack: '25 Breakdowns', price: 'R7,500', tier: 'pack_25' as SubscriptionTier, highlight: false },
            ].map((item, i) => (
              <div key={i} className={`bg-black p-8 flex flex-col items-center text-center ${item.highlight ? 'bg-white/[0.02]' : ''}`}>
                {item.highlight && (
                  <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-neon bg-neon/10 border border-neon/20 px-3 py-1 rounded mb-4">
                    Best Value
                  </span>
                )}
                <p className="text-sm text-white/50 mb-2">{item.pack}</p>
                <p className={`text-3xl font-bold mb-4 ${item.highlight ? 'text-neon' : 'text-white'}`}>{item.price}</p>
                <button
                  onClick={() => handleTierSelect(item.tier)}
                  className={`w-full py-3 px-4 rounded-lg font-bold text-sm uppercase tracking-wide transition-all duration-300 cursor-pointer ${
                    item.highlight
                      ? 'bg-neon text-black hover:bg-white'
                      : 'bg-white/[0.04] border border-white/[0.08] text-white/60 hover:bg-white/[0.08] hover:text-white'
                  }`}
                >
                  Buy Now
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* ═══════════════════════════════════════════════ */}
        {/* SECTION 3: What Every Breakdown Includes */}
        {/* ═══════════════════════════════════════════════ */}
        <div className="py-32 border-b border-white/5">

          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div>
              <h3 className="font-display text-3xl md:text-4xl font-bold text-white mb-6 leading-[1.1]">
                Full Production<br/>Infrastructure
              </h3>
              <p className="text-lg text-white/40 leading-relaxed">
                No feature tiers. No per-seat charges.
                Every breakdown unlocks the complete SlateOne system
                for that project.
              </p>
            </div>

            <div className="space-y-4">
              {[
                'Full Script breakdown',
                'Props / characters / locations extraction',
                'Full production workspace',
                'Production scheduling',
                'Stripboards & Kanban visualization',
                'Department reports',
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-[15px] text-white/50">
                  <Check className="w-4 h-4 text-neon/40 flex-shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════ */}
        {/* SECTION 4: Who This Is For */}
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

      {/* Tier Selection Modal */}
      <TierSelectionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        tier={selectedTier}
      />
    </section>
  );
};
