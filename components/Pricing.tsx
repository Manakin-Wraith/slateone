import React, { useState } from 'react';
import { Check, Users } from 'lucide-react';
import { TierSelectionModal } from './TierSelectionModal';
import { BillingPeriod, PricingTier } from '../lib/supabase';

interface TeamsBand {
  eyebrow: string;
  headline: string;
  line: string;
  features: string[];
}

interface BillingVariant {
  price: string;
  priceUnit: string;
  priceNote: string;
  savingsBadge?: string;
}

interface TierConfig {
  id: PricingTier;
  badge: string;
  name: string;
  price: string;
  priceUnit: string;
  priceNote?: string;
  billing?: Record<BillingPeriod, BillingVariant>;
  tagline: string;
  features: string[];
  footnote?: string;
  teamsBand?: TeamsBand;
  cta: string;
  highlighted?: boolean;
}

const TIERS: TierConfig[] = [
  {
    id: 'tier_1',
    badge: 'Solo',
    name: 'Pay-Per-Breakdown',
    price: 'R450',
    priceUnit: '/ breakdown',
    tagline: 'For individual filmmakers. Pay only when you run a breakdown.',
    features: [
      'Unlimited script uploads',
      'Scene detection & parsing — free',
      'Full breakdown extraction (cast, props, wardrobe, vehicles, SFX & more)',
      'Scene & story-day management',
      'Narrative & scene intelligence',
      'Zoomable stripboard scheduling',
      'All production reports & exports',
    ],
    footnote: 'Just you — no crew collaboration.',
    cta: 'Get Started',
  },
  {
    id: 'tier_2',
    badge: 'Crew',
    name: 'Team License',
    price: 'R1,850',
    priceUnit: '/ month',
    priceNote: '+ R150 per seat / mo',
    billing: {
      monthly: {
        price: 'R1,850',
        priceUnit: '/ month',
        priceNote: '+ R150 per seat / mo',
      },
      annual: {
        price: 'R18,500',
        priceUnit: '/ year',
        priceNote: '+ R1,500 per seat / yr',
        savingsBadge: '2 months free',
      },
    },
    tagline: 'Unlimited breakdowns for your whole crew.',
    features: [
      'Everything in Solo, plus unlimited breakdowns included',
    ],
    teamsBand: {
      eyebrow: 'One Source of Truth',
      headline: 'Your whole crew, one breakdown.',
      line: 'No more emailing spreadsheets — everyone works off the same live breakdown.',
      features: [
        'Invite crew members',
        'Department workspaces',
        'Cross-department threads',
        'Item tracking & notes',
        'Team access control',
      ],
    },
    cta: 'Get Started',
    highlighted: true,
  },
];

export const Pricing: React.FC = () => {
  const [selectedTier, setSelectedTier] = useState<PricingTier | null>(null);
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>('monthly');

  return (
    <section id="pricing" className="bg-slate-950 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.02] bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] [background-size:40px_40px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* ═══════════════════════════════════════════════ */}
        {/* SECTION 1: Pricing Header */}
        {/* ═══════════════════════════════════════════════ */}
        <div className="py-32 border-b border-slate-800">

          <div className="max-w-3xl mb-8">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-50 mb-6 leading-[1.1]">
              Simple Pricing.<br/>Built For How You Work.
            </h2>
            <p className="text-lg text-slate-400 leading-relaxed mb-6">
              Pay per breakdown when you need it, or license your whole
              team for the year. Uploading and editing scripts is always
              free &mdash; you only pay when you run a breakdown.
            </p>
            <p className="text-sm text-slate-500 font-mono">
              Prices in ZAR. No lock-in.
            </p>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════ */}
        {/* SECTION 2: Tier Grid */}
        {/* ═══════════════════════════════════════════════ */}
        <div className="py-32 border-b border-slate-800">

          <p className="text-center text-2xl md:text-3xl font-bold text-slate-200 mb-12">
            Work solo. Or bring the whole crew.
          </p>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto items-stretch">
            {TIERS.map((tier) => {
              const variant = tier.billing?.[billingPeriod];
              const displayPrice = variant?.price ?? tier.price;
              const displayUnit = variant?.priceUnit ?? tier.priceUnit;
              const displayNote = variant?.priceNote ?? tier.priceNote;

              return (
              <div
                key={tier.id}
                className={`relative border rounded-2xl overflow-hidden flex flex-col ${
                  tier.highlighted
                    ? 'border-amber-500/30 bg-amber-500/[0.03] shadow-lg'
                    : 'border-slate-700 bg-slate-800'
                }`}
              >
                {tier.highlighted && (
                  <div className="absolute top-0 right-0 text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-slate-900 bg-amber-500 px-3 py-1 rounded-bl-lg">
                    Recommended
                  </div>
                )}

                {/* Plan Header */}
                <div className="p-10 border-b border-slate-700">
                  <div className="flex items-center justify-between gap-3 mb-6">
                    <span
                      className={`text-[10px] font-mono font-bold uppercase tracking-[0.2em] px-3 py-1 rounded inline-block ${
                        tier.highlighted
                          ? 'text-amber-500 bg-amber-500/10 border border-amber-500/20'
                          : 'text-slate-400 bg-slate-700 border border-slate-600'
                      }`}
                    >
                      {tier.badge}
                    </span>

                    {tier.billing && (
                      <div className="inline-flex items-center bg-slate-900 border border-slate-700 rounded-full p-0.5 text-[11px] font-mono">
                        <button
                          type="button"
                          onClick={() => setBillingPeriod('monthly')}
                          className={`px-3 py-1 rounded-full transition-colors ${
                            billingPeriod === 'monthly'
                              ? 'bg-amber-500 text-slate-900 font-bold'
                              : 'text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          Monthly
                        </button>
                        <button
                          type="button"
                          onClick={() => setBillingPeriod('annual')}
                          className={`px-3 py-1 rounded-full transition-colors ${
                            billingPeriod === 'annual'
                              ? 'bg-amber-500 text-slate-900 font-bold'
                              : 'text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          Annual
                        </button>
                      </div>
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-slate-50 mb-4">{tier.name}</h3>

                  {tier.billing?.annual?.savingsBadge && billingPeriod === 'annual' && (
                    <span className="inline-block text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-amber-500 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded mb-3">
                      {tier.billing.annual.savingsBadge}
                    </span>
                  )}

                  {displayNote ? (
                    <div className="space-y-2 mb-1">
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500">License</span>
                        <span className="flex items-baseline gap-1">
                          <span className="text-3xl font-bold text-slate-50">{displayPrice}</span>
                          <span className="text-sm text-slate-500 font-mono">{displayUnit}</span>
                        </span>
                      </div>
                      <div className="flex items-baseline justify-between gap-2 pt-2 border-t border-dashed border-slate-700">
                        <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500">+ Seats</span>
                        <span className="flex items-baseline gap-1">
                          <span className="text-xl font-bold text-amber-500">{displayNote.replace('+ ', '')}</span>
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-baseline gap-1 mb-1">
                      <span className="text-5xl font-bold text-slate-50">{displayPrice}</span>
                      <span className="text-base text-slate-500 font-mono">{displayUnit}</span>
                    </div>
                  )}
                  <p className="text-slate-400 text-sm mt-3">{tier.tagline}</p>
                </div>

                {/* Features List */}
                <div className="p-10 space-y-4 flex-1">
                  {tier.features.map((item, i) => (
                    <div key={i} className="flex items-start gap-3 text-[15px] text-slate-400">
                      <Check className="w-4 h-4 text-amber-500/50 flex-shrink-0 mt-1" />
                      {item}
                    </div>
                  ))}

                  {tier.footnote && (
                    <p className="text-[13px] text-slate-500 italic pt-2">{tier.footnote}</p>
                  )}

                  {tier.teamsBand && (
                    <div className="mt-4 rounded-xl border border-amber-500/20 bg-amber-500/[0.06] p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <Users className="w-4 h-4 text-amber-500" />
                        <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-amber-500">
                          {tier.teamsBand.eyebrow}
                        </span>
                      </div>
                      <h4 className="text-lg font-bold text-slate-50 mb-2 leading-tight">
                        {tier.teamsBand.headline}
                      </h4>
                      <p className="text-sm text-slate-400 leading-relaxed mb-5">
                        {tier.teamsBand.line}
                      </p>
                      <div className="space-y-3">
                        {tier.teamsBand.features.map((item, i) => (
                          <div key={i} className="flex items-center gap-3 text-[15px] text-slate-200">
                            <Check className="w-4 h-4 text-amber-500 flex-shrink-0" />
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* CTA */}
                <div className="px-10 pb-10">
                  <button
                    onClick={() => setSelectedTier(tier.id)}
                    className={`w-full font-bold py-4 px-6 rounded-lg transition-all duration-300 text-sm cursor-pointer ${
                      tier.highlighted
                        ? 'bg-amber-500 text-slate-900 hover:bg-amber-400'
                        : 'bg-slate-700 text-slate-50 border border-slate-600 hover:bg-slate-600'
                    }`}
                  >
                    {tier.cta}
                  </button>
                </div>
              </div>
              );
            })}
          </div>
        </div>

        {/* ═══════════════════════════════════════════════ */}
        {/* SECTION 3: Who This Is For */}
        {/* ═══════════════════════════════════════════════ */}
        <div className="py-32">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.2em] mb-6">Built For</p>
            <h3 className="text-3xl md:text-4xl font-bold text-slate-50 mb-8 leading-[1.1]">
              Who This Is For
            </h3>

            <div className="flex flex-wrap justify-center gap-3 mb-10">
              {['Indie filmmakers', 'Production companies', 'Studios', 'Producers', 'Line producers', 'UPMs'].map((role) => (
                <span key={role} className="text-sm text-slate-400 bg-slate-800 border border-slate-700 px-5 py-2.5 rounded-lg font-mono">
                  {role}
                </span>
              ))}
            </div>

            <p className="text-lg text-slate-400 leading-relaxed mb-2">
              If your production runs on spreadsheets and fragmented tools,
            </p>
            <p className="text-lg text-slate-200 font-medium">
              SlateOne replaces that system.
            </p>
          </div>
        </div>

      </div>

      {/* Tier Selection Modal */}
      <TierSelectionModal
        isOpen={selectedTier !== null}
        onClose={() => setSelectedTier(null)}
        tier={selectedTier ?? 'tier_1'}
        billingPeriod={billingPeriod}
      />
    </section>
  );
};
