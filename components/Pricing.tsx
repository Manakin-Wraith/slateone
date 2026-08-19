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

interface UpgradeCallout {
  headline: string;
  sub: string;
}

interface LadderCard {
  key: string;
  tier: PricingTier;
  billingPeriod: BillingPeriod;
  badge: string;
  name: string;
  subhead: string;
  priceZAR: number;
  priceUnit: string;
  effectiveMonthly?: string;
  upgradeNote?: UpgradeCallout;
  includedSeats?: number;
  peopleLabel?: string;
  seatPriceLabel?: string;
  commitmentLabel?: string;
  tagline: string;
  features: string[];
  includesNote?: string;
  bestForNote?: string;
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
    subhead: 'Pay as you go',
    priceZAR: 2250,
    priceUnit: '/ screenplay',
    tagline: 'For one-off projects. No subscription.',
    features: [
      '1 screenplay breakdown',
      'Scene detection & parsing — free',
      'Full breakdown extraction (cast, props, wardrobe, vehicles, SFX & more)',
      'Scene & story-day management',
      'Narrative & scene intelligence',
      'Zoomable stripboard scheduling',
      'All production reports & exports',
    ],
    footnote: 'Just you — no team collaboration.',
    cta: 'Break Down a Script',
    accent: 'neutral',
  },
  {
    key: 'studio_3',
    tier: 'tier_2',
    billingPeriod: '3month',
    badge: 'Studio 3',
    name: 'Studio 3',
    subhead: 'For active development',
    priceZAR: 5500,
    priceUnit: '/ 3 months',
    includedSeats: 1,
    peopleLabel: 'You + 1 person included',
    seatPriceLabel: 'R250 / mo',
    commitmentLabel: '3-month commitment.',
    tagline: 'Unlimited screenplay breakdowns while you develop your slate.',
    features: [
      'Unlimited screenplay breakdowns',
      'Team collaboration',
      'Production reports & exports',
    ],
    includesNote: 'Includes everything in Project.',
    bestForNote: 'Best for: filmmakers developing a slate of projects.',
    cta: 'Start Studio',
    accent: 'neutral',
  },
  {
    key: 'studio_6',
    tier: 'tier_2',
    billingPeriod: '6month',
    badge: 'Studio 6',
    name: 'Studio 6',
    subhead: 'For production teams',
    priceZAR: 9500,
    priceUnit: '/ 6 months',
    includedSeats: 2,
    peopleLabel: 'You + 2 people included',
    seatPriceLabel: 'R250 / mo',
    commitmentLabel: '6-month commitment.',
    tagline: 'Bring your production team into the workflow.',
    features: [
      'Unlimited screenplay breakdowns',
      'Collaborative production workflow',
      'Production reports & exports',
    ],
    includesNote: 'Includes everything in Studio 3.',
    bestForNote: 'Best for: production teams running multiple projects.',
    cta: 'Start Studio',
    accent: 'cyan',
  },
  {
    key: 'studio_12',
    tier: 'tier_2',
    billingPeriod: 'annual',
    badge: 'Studio 12',
    name: 'Studio 12',
    subhead: 'For production companies',
    priceZAR: 18500,
    priceUnit: '/ year',
    includedSeats: 3,
    peopleLabel: 'You + 3 people included',
    seatPriceLabel: 'R250 / mo',
    commitmentLabel: '12-month commitment.',
    upgradeNote: {
      headline: 'Only R41/mo more than Studio 6',
      sub: 'Get 12 months + 3 people included.',
    },
    tagline: 'Make SlateOne part of your production workflow, year-round.',
    features: [
      'Unlimited screenplay breakdowns',
      'Full-year production workflow',
      'Lowest effective monthly price',
    ],
    includesNote: 'Includes everything in Studio 6.',
    cta: 'Choose Studio 12',
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
  neutral: 'border-slate-700 bg-slate-800 hover:bg-slate-800/70 hover:border-slate-600',
  cyan: 'border-slate-600 bg-slate-800 hover:bg-slate-800/70 hover:border-slate-500',
  amber: 'border-amber-500/40 bg-amber-500/[0.04] shadow-lg shadow-amber-500/10 lg:scale-[1.03] hover:border-amber-400/60 hover:shadow-amber-500/20',
};

const ACCENT_BADGE_CLASSES: Record<LadderCard['accent'], string> = {
  neutral: 'text-slate-400 bg-slate-700 border border-slate-600',
  cyan: 'text-slate-300 bg-slate-700 border border-slate-600',
  amber: 'text-amber-500 bg-amber-500/10 border border-amber-500/20',
};

const ACCENT_CTA_CLASSES: Record<LadderCard['accent'], string> = {
  neutral: 'bg-slate-700 text-slate-50 border border-slate-600 hover:bg-slate-600',
  cyan: 'bg-slate-700 text-slate-50 border border-slate-600 hover:bg-slate-600',
  amber: 'bg-amber-600 text-slate-950 hover:bg-amber-500',
};

const ACCENT_CHECK_CLASSES: Record<LadderCard['accent'], string> = {
  neutral: 'text-amber-500/40',
  cyan: 'text-amber-500/40',
  amber: 'text-amber-500/70',
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
            <p className="text-sm text-slate-500 leading-relaxed mb-6">
              A manual breakdown typically takes 2&ndash;5 days of line-by-line
              highlighting and data entry. SlateOne turns that into a
              structured digital workflow &mdash; in minutes.
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

          <div className="grid md:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_1.05fr] gap-6 max-w-7xl mx-auto items-stretch">
            {CARDS.map((card) => (
              <div
                key={card.key}
                onClick={() => setSelectedCardKey(card.key)}
                className={`relative border rounded-2xl overflow-hidden flex flex-col cursor-pointer transition-all duration-300 ${ACCENT_CARD_CLASSES[card.accent]}`}
              >
                {card.badgeRibbon && (
                  <div className="absolute top-4 right-4 text-[9px] font-mono font-bold uppercase tracking-[0.15em] text-amber-500 bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 rounded-full">
                    {card.badgeRibbon}
                  </div>
                )}

                {/* Card Header */}
                <div className="p-8 border-b border-slate-800/70">
                  <span
                    className={`text-[10px] font-mono font-bold uppercase tracking-[0.2em] px-3 py-1 rounded inline-block mb-6 ${ACCENT_BADGE_CLASSES[card.accent]}`}
                  >
                    {card.badge}
                  </span>

                  <h3 className="text-[17px] font-bold text-slate-50 mb-1">{card.name}</h3>
                  <p className="text-[11px] text-slate-500 font-mono uppercase tracking-[0.1em] mb-4">{card.subhead}</p>

                  <div className="flex items-baseline gap-1 mb-1">
                    <span
                      className={`font-extrabold text-slate-50 tracking-tight ${card.accent === 'amber' ? 'text-[36px]' : 'text-[30px]'}`}
                    >
                      {formatZAR(card.priceZAR)}
                    </span>
                    <span className="text-sm text-slate-500 font-mono">{card.priceUnit}</span>
                  </div>

                  {card.effectiveMonthly && (
                    <p className="text-[12px] text-slate-400 font-mono mt-1">{card.effectiveMonthly}</p>
                  )}

                  {card.upgradeNote && (
                    <div className="mt-3 rounded-lg border border-amber-500/25 bg-amber-500/[0.08] px-3 py-2">
                      <p className="text-[10px] font-mono font-bold uppercase tracking-wide text-amber-500 mb-0.5">
                        {card.upgradeNote.headline}
                      </p>
                      <p className="text-[11px] text-slate-400">{card.upgradeNote.sub}</p>
                    </div>
                  )}

                  {card.peopleLabel && (
                    <p className="text-[13px] text-slate-400 mt-3">
                      {card.peopleLabel}
                      {card.seatPriceLabel && (
                        <span className="text-slate-500"> · add people for {card.seatPriceLabel}</span>
                      )}
                    </p>
                  )}

                  <p className="text-slate-300 text-[13px] leading-relaxed mt-4">{card.tagline}</p>
                  {card.commitmentLabel && (
                    <p className="text-[11px] text-slate-500 mt-2">{card.commitmentLabel}</p>
                  )}
                </div>

                {/* Features */}
                <div className="p-8 flex-1 flex flex-col">
                  <div className="space-y-3">
                    {card.features.map((item, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-[13px]">
                        <Check className={`w-3.5 h-3.5 flex-shrink-0 mt-[3px] ${ACCENT_CHECK_CLASSES[card.accent]}`} />
                        <span className={i === 0 ? 'text-slate-200 font-medium' : 'text-slate-400'}>{item}</span>
                      </div>
                    ))}
                  </div>

                  {card.includesNote && (
                    <p className="text-[11px] text-slate-500 italic mt-4">{card.includesNote}</p>
                  )}

                  {card.bestForNote && (
                    <p className="text-[12px] text-slate-400 mt-4 pt-4 border-t border-slate-800/70">
                      {card.bestForNote}
                    </p>
                  )}

                  {card.footnote && (
                    <p className="text-[11px] text-slate-500 italic mt-auto pt-4">{card.footnote}</p>
                  )}
                </div>

                {/* CTA */}
                <div className="px-8 pb-8">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedCardKey(card.key);
                    }}
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
