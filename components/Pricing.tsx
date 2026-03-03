import React, { useState } from 'react';
import { Check, Zap, Users, Crown } from 'lucide-react';
import { TierSelectionModal } from './TierSelectionModal';
import { SubscriptionTier } from '../lib/supabase';

export const Pricing: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState<SubscriptionTier>('development_os');

  const handleTierSelect = (tier: SubscriptionTier) => {
    setSelectedTier(tier);
    setModalOpen(true);
  };

  return (
    <section id="pricing" className="py-32 bg-black border-b border-white/5 relative overflow-hidden">
      {/* Subtle grid */}
      <div className="absolute inset-0 opacity-[0.02] bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] [background-size:40px_40px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section label */}
        <div className="inline-flex items-center space-x-3 mb-6">
          <span className="h-px w-12 bg-neon/50"></span>
          <span className="text-xs font-mono text-neon/80 tracking-[0.2em] uppercase">Production Tiers</span>
        </div>

        {/* Header */}
        <div className="max-w-3xl mb-20">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-6 leading-[1.1]">
            Select Your<br/>Operating Layer
          </h2>
          <p className="text-lg text-white/40 leading-relaxed">
            From development to delivery. Each tier scales with the operational 
            demands of your production.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-px bg-white/[0.04] border border-white/[0.06] rounded-xl overflow-hidden mb-16">

          {/* Development OS */}
          <PricingCard
            name="Development OS"
            price="R499"
            period="mo"
            targetAudience="Writers & Pre-Production"
            icon={<Zap className="w-5 h-5" />}
            highlights={[
              '1 active project',
              '2 users',
              'Full script breakdown',
              '3 report types',
              'No scheduling',
            ]}
            activationNote="No activations included"
            activationPricing={[
              'Feature film — R3,000',
              'TV episode — R2,000',
              'Short film — R1,000',
            ]}
            ctaText="Start Development"
            onSelect={() => handleTierSelect('development_os')}
            highlight={false}
          />

          {/* Producer OS */}
          <PricingCard
            name="Producer OS"
            price="R1,999"
            period="mo"
            targetAudience="Indie Features & Funded Productions"
            icon={<Users className="w-5 h-5" />}
            highlights={[
              '3 active projects',
              '10 users',
              'Full scheduling',
              'All 7 report types',
              '3 custom reports',
              '1 activation included per month',
            ]}
            activationNote="Additional activations"
            activationPricing={['R3,000 each']}
            ctaText="Go Producer"
            onSelect={() => handleTierSelect('producer_os')}
            highlight={true}
            badge="Recommended"
          />

          {/* Studio OS */}
          <PricingCard
            name="Studio OS"
            price="R3,499"
            period="mo"
            targetAudience="Established Production Companies"
            icon={<Crown className="w-5 h-5" />}
            highlights={[
              'Unlimited active projects',
              '25 users',
              'Full scheduling & Kanban',
              'All 7 report types',
              'Unlimited custom reports',
              'Role-based permissions',
              '2 activations included per month',
              { text: 'Daily Progress Reports (DPRs)', tag: 'Roadmap' },
              { text: 'Telegram production integration', tag: 'Roadmap' },
            ]}
            activationNote="Additional activations"
            activationPricing={['R2,500 each']}
            ctaText="Contact Sales"
            onSelect={() => handleTierSelect('studio_os')}
            highlight={false}
          />

        </div>

        {/* What is Project Intelligence Activation */}
        <div className="max-w-2xl mx-auto text-center">
          <div className="border border-white/[0.06] rounded-xl p-8 bg-white/[0.01]">
            <p className="text-[10px] font-mono text-white/30 uppercase tracking-[0.2em] mb-3">Activation Definition</p>
            <h3 className="font-display text-lg font-bold text-white mb-3">
              What is a Project Intelligence Activation?
            </h3>
            <p className="text-sm text-white/40 leading-relaxed">
              An activation transforms your script into operational production infrastructure —
              full breakdown, scene detection, entity extraction, and scheduling intelligence.
              It's not an upload. It's ignition.
            </p>
          </div>
        </div>

        {/* Strategic close line */}
        <div className="mt-20 text-center">
          <p className="text-xl text-white/50 font-display font-medium mb-2">
            Every serious production runs on systems.
          </p>
          <p className="text-sm text-white/20 font-mono tracking-widest uppercase">
            SlateOne is the system layer film sets have been missing.
          </p>
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

interface PricingCardProps {
  name: string;
  price: string;
  period: string;
  targetAudience: string;
  icon: React.ReactNode;
  highlights: (string | { text: string; tag: string })[];
  activationNote: string;
  activationPricing: string[];
  ctaText: string;
  onSelect: () => void;
  highlight: boolean;
  badge?: string;
}

const PricingCard: React.FC<PricingCardProps> = ({
  name,
  price,
  period,
  targetAudience,
  icon,
  highlights,
  activationNote,
  activationPricing,
  ctaText,
  onSelect,
  highlight,
  badge,
}) => {
  return (
    <div
      className={`
        relative bg-black p-8 lg:p-10 flex flex-col transition-all duration-300
        ${highlight ? 'bg-white/[0.02]' : ''}
      `}
    >
      {/* Badge */}
      {badge && (
        <div className="mb-6">
          <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-neon bg-neon/10 border border-neon/20 px-3 py-1 rounded">
            {badge}
          </span>
        </div>
      )}

      {/* Icon & Name */}
      <div className="flex items-center gap-3 mb-1">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${highlight ? 'bg-neon/15 text-neon' : 'bg-white/5 text-white/50'}`}>
          {icon}
        </div>
        <h3 className="text-lg font-display font-bold text-white">{name}</h3>
      </div>

      {/* Target Audience */}
      <p className="text-xs text-white/30 mb-6 pl-12 font-mono">{targetAudience}</p>

      {/* Price */}
      <div className="mb-6">
        <div className="flex items-baseline gap-1">
          <span className={`text-4xl font-bold ${highlight ? 'text-neon' : 'text-white'}`}>{price}</span>
          <span className="text-white/30 text-sm font-mono">/{period}</span>
        </div>
      </div>

      {/* CTA Button */}
      <button
        onClick={onSelect}
        className={`
          block w-full py-3.5 px-6 rounded-lg font-bold text-center text-sm tracking-wide uppercase transition-all duration-300 mb-8 cursor-pointer
          ${highlight
            ? 'bg-neon text-black hover:bg-white'
            : 'bg-white/[0.04] border border-white/[0.08] text-white/70 hover:bg-white/[0.08] hover:border-neon/30 hover:text-white'
          }
        `}
      >
        {ctaText}
      </button>

      {/* Highlights List */}
      <ul className="space-y-3 flex-grow">
        {highlights.map((item, index) => {
          const text = typeof item === 'string' ? item : item.text;
          const tag = typeof item === 'string' ? null : item.tag;
          return (
            <li key={index} className="flex items-start gap-3 text-sm text-white/50">
              <Check className={`w-4 h-4 mt-0.5 flex-shrink-0 ${highlight ? 'text-neon' : 'text-white/20'}`} />
              <span className="flex items-center gap-2 flex-wrap">
                {text}
                {tag && (
                  <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-cyan bg-cyan/5 border border-cyan/15 px-2 py-0.5 rounded">
                    {tag}
                  </span>
                )}
              </span>
            </li>
          );
        })}
      </ul>

      {/* Activation Pricing */}
      <div className="mt-8 pt-4 border-t border-white/[0.05]">
        <p className="text-[10px] font-mono font-semibold uppercase tracking-[0.15em] text-white/20 mb-2">
          {activationNote}
        </p>
        {activationPricing.map((line, i) => (
          <p key={i} className="text-xs text-white/35">{line}</p>
        ))}
      </div>
    </div>
  );
};
