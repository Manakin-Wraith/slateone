import React, { useState } from 'react';
import { Check, Users } from 'lucide-react';
import { TierSelectionModal } from './TierSelectionModal';
import { BillingPeriod, PricingTier } from '../lib/supabase';

const CADENCE_MONTHS: Record<BillingPeriod, number> = {
  '3month': 3,
  '6month': 6,
  annual: 12,
};

function formatZAR(amount: number): string {
  return `R${amount.toLocaleString('en-US')}`;
}

function effectiveMonthlyLabel(totalZAR: number, cadence: BillingPeriod): string {
  const months = CADENCE_MONTHS[cadence];
  return `${formatZAR(Math.round(totalZAR / months))}/mo effective`;
}

interface CollaborationBand {
  eyebrow: string;
  headline: string;
  line: string;
  features: string[];
}

interface LadderCard {
  key: string;
  tier: PricingTier;
  billingPeriod: BillingPeriod;
  badge: string;
  name: string;
  priceZAR: number;
  priceUnit: string;
  effectiveMonthly?: string;
  includedSeats?: number;
  seatPriceLabel?: string;
  tagline: string;
  features: string[];
  footnote?: string;
  cta: string;
  accent: 'neutral' | 'cyan' | 'amber';
  badgeRibbon?: string;
}

const CARDS: LadderCard[] = [
  {
    key: 'project',
    tier: 'tier_1',
    billingPeriod: 'annual',
    badge: 'Project',
    name: 'Project',
    priceZAR: 2250,
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
    accent: 'neutral',
  },
  {
    key: 'studio_3',
    tier: 'tier_2',
    billingPeriod: '3month',
    badge: 'Studio 3',
    name: 'Studio 3',
    priceZAR: 5500,
    priceUnit: '/ 3 months',
    includedSeats: 1,
    seatPriceLabel: 'R250 / mo',
    tagline: '3-month commitment. You + 1 teammate included.',
    features: ['Everything in Project, plus unlimited breakdowns included'],
    cta: 'Get Started',
    accent: 'neutral',
  },
  {
    key: 'studio_6',
    tier: 'tier_2',
    billingPeriod: '6month',
    badge: 'Studio 6',
    name: 'Studio 6',
    priceZAR: 9500,
    priceUnit: '/ 6 months',
    includedSeats: 2,
    seatPriceLabel: 'R250 / mo',
    tagline: '6-month commitment. Your 3-person crew included.',
    features: ['Everything in Project, plus unlimited breakdowns included'],
    cta: 'Get Started',
    accent: 'cyan',
  },
  {
    key: 'studio_12',
    tier: 'tier_2',
    billingPeriod: 'annual',
    badge: 'Studio 12',
    name: 'Studio 12',
    priceZAR: 18500,
    priceUnit: '/ year',
    includedSeats: 3,
    seatPriceLabel: 'R250 / mo',
    tagline: '12-month commitment. Your whole 4-person team included.',
    features: ['Everything in Project, plus unlimited breakdowns included'],
    cta: 'Get Started',
    accent: 'amber',
    badgeRibbon: 'Best Value',
  },
].map((card) => ({
  ...card,
  effectiveMonthly:
    typeof card.includedSeats === 'number'
      ? effectiveMonthlyLabel(card.priceZAR, card.billingPeriod as BillingPeriod)
      : undefined,
}) as LadderCard);

const COLLABORATION_BAND: CollaborationBand = {
  eyebrow: 'One Source of Truth',
  headline: 'Your whole crew, one breakdown.',
  line: 'No more emailing spreadsheets — everyone works off the same live breakdown, on any Studio plan.',
  features: [
    'Invite crew members',
    'Department workspaces',
    'Cross-department threads',
    'Item tracking & notes',
    'Team access control',
  ],
};

const ACCENT_CARD_CLASSES: Record<LadderCard['accent'], string> = {
  neutral: 'border-slate-700 bg-slate-800',
  cyan: 'border-cyan-500/30 bg-cyan-500/[0.03]',
  amber: 'border-amber-500/30 bg-amber-500/[0.03] shadow-lg',
};

const ACCENT_BADGE_CLASSES: Record<LadderCard['accent'], string> = {
  neutral: 'text-slate-400 bg-slate-700 border border-slate-600',
  cyan: 'text-cyan-400 bg-cyan-500/10 border border-cyan-500/20',
  amber: 'text-amber-500 bg-amber-500/10 border border-amber-500/20',
};

const ACCENT_CTA_CLASSES: Record<LadderCard['accent'], string> = {
  neutral: 'bg-slate-700 text-slate-50 border border-slate-600 hover:bg-slate-600',
  cyan: 'bg-slate-700 text-slate-50 border border-cyan-500/30 hover:bg-slate-600',
  amber: 'bg-amber-500 text-slate-900 hover:bg-amber-400',
};

export const Pricing: React.FC = () => {
  const [selectedCardKey, setSelectedCardKey] = useState<string | null>(null);
  const selectedCard = CARDS.find((card) => card.key === selectedCardKey) ?? null;

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
              Pay per project when you need it, or lock in a term and bring
              your crew along. Uploading and editing scripts is always free
              &mdash; you only pay when you run a breakdown.
            </p>
            <p className="text-sm text-slate-500 font-mono">
              Prices in ZAR.
            </p>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════ */}
        {/* SECTION 2: Card Ladder */}
        {/* ═══════════════════════════════════════════════ */}
        <div className="py-32 border-b border-slate-800">

          <p className="text-center text-2xl md:text-3xl font-bold text-slate-200 mb-12">
            Work solo. Or bring the whole crew.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto items-stretch">
            {CARDS.map((card) => (
              <div
                key={card.key}
                className={`relative border rounded-2xl overflow-hidden flex flex-col ${ACCENT_CARD_CLASSES[card.accent]}`}
              >
                {card.badgeRibbon && (
                  <div className="absolute top-0 right-0 text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-slate-900 bg-amber-500 px-3 py-1 rounded-bl-lg">
                    {card.badgeRibbon}
                  </div>
                )}

                {/* Card Header */}
                <div className="p-8 border-b border-slate-700">
                  <span
                    className={`text-[10px] font-mono font-bold uppercase tracking-[0.2em] px-3 py-1 rounded inline-block mb-6 ${ACCENT_BADGE_CLASSES[card.accent]}`}
                  >
                    {card.badge}
                  </span>

                  <h3 className="text-xl font-bold text-slate-50 mb-4">{card.name}</h3>

                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="text-4xl font-bold text-slate-50">{formatZAR(card.priceZAR)}</span>
                    <span className="text-base text-slate-500 font-mono">{card.priceUnit}</span>
                  </div>

                  {card.effectiveMonthly && (
                    <p className="text-[13px] text-slate-500 font-mono mt-1">{card.effectiveMonthly}</p>
                  )}

                  {typeof card.includedSeats === 'number' && (
                    <p className="text-[13px] text-slate-400 mt-3">
                      {card.includedSeats} seat{card.includedSeats > 1 ? 's' : ''} included
                      {card.seatPriceLabel && (
                        <span className="text-slate-500"> · extra seat {card.seatPriceLabel}</span>
                      )}
                    </p>
                  )}

                  <p className="text-slate-400 text-sm mt-4">{card.tagline}</p>
                </div>

                {/* Features */}
                <div className="p-8 space-y-3 flex-1">
                  {card.features.map((item, i) => (
                    <div key={i} className="flex items-start gap-3 text-[14px] text-slate-400">
                      <Check className="w-4 h-4 text-amber-500/50 flex-shrink-0 mt-1" />
                      {item}
                    </div>
                  ))}

                  {card.footnote && (
                    <p className="text-[13px] text-slate-500 italic pt-2">{card.footnote}</p>
                  )}
                </div>

                {/* CTA */}
                <div className="px-8 pb-8">
                  <button
                    onClick={() => setSelectedCardKey(card.key)}
                    className={`w-full font-bold py-4 px-6 rounded-lg transition-all duration-300 text-sm cursor-pointer ${ACCENT_CTA_CLASSES[card.accent]}`}
                  >
                    {card.cta}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Shared collaboration panel — applies to all Studio cards */}
          <div className="mt-10 max-w-4xl mx-auto rounded-xl border border-amber-500/20 bg-amber-500/[0.06] p-8">
            <div className="flex items-center gap-2 mb-3">
              <Users className="w-4 h-4 text-amber-500" />
              <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-amber-500">
                {COLLABORATION_BAND.eyebrow}
              </span>
            </div>
            <h4 className="text-lg font-bold text-slate-50 mb-2 leading-tight">
              {COLLABORATION_BAND.headline}
            </h4>
            <p className="text-sm text-slate-400 leading-relaxed mb-5">
              {COLLABORATION_BAND.line}
            </p>
            <div className="grid sm:grid-cols-2 gap-3">
              {COLLABORATION_BAND.features.map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-[15px] text-slate-200">
                  <Check className="w-4 h-4 text-amber-500 flex-shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          <p className="text-center text-[12px] text-slate-500 mt-6">
            Need more? Extra seats are a flat R250/month on any Studio plan
            — simple math, no surprises.
          </p>
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
        isOpen={selectedCard !== null}
        onClose={() => setSelectedCardKey(null)}
        tier={selectedCard?.tier ?? 'tier_1'}
        billingPeriod={selectedCard?.billingPeriod ?? 'annual'}
      />
    </section>
  );
};
