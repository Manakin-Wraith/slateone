import React from 'react';
import { Check, Zap, Users, Crown } from 'lucide-react';

export const Pricing: React.FC = () => {
  return (
    <section className="py-24 bg-charcoal border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-6">
            Start Breaking Down Scripts Today
          </h2>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            No subscriptions. No per-seat fees. Pay for what you need.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          
          {/* Try It - R49 */}
          <PricingCard
            name="Try It"
            price="R49"
            period="one-time"
            description="Test SlateOne with your next script"
            icon={<Zap className="w-6 h-6" />}
            features={[
              "1 full script breakdown",
              "30 day access to results",
              "PDF export",
              "See if it works for you"
            ]}
            ctaText="Try 1 Script"
            ctaLink="https://pay.yoco.com/r/m9jYrx"
            highlight={false}
          />

          {/* Beta Supporter - R249 */}
          <PricingCard
            name="Beta Supporter"
            price="R249"
            period="6 months beta"
            description="Unlimited scripts + shape the product"
            icon={<Users className="w-6 h-6" />}
            features={[
              "Unlimited scripts & uploads",
              "Team collaboration (unlimited seats)",
              "Early access to new features",
              "Influence the roadmap",
              "Locked-in pricing forever",
              "Direct line to dev team"
            ]}
            ctaText="Join Beta"
            ctaLink="https://pay.yoco.com/r/mEDpxp"
            highlight={true}
            badge="Most Popular"
          />

          {/* Production - R499 */}
          <PricingCard
            name="Production"
            price="R499"
            period="6 months beta"
            description="For serious productions"
            icon={<Crown className="w-6 h-6" />}
            features={[
              "Everything in Beta Supporter",
              "Custom export templates",
              "30-min onboarding call",
              "Feature requests prioritized",
              "Production-ready workflows"
            ]}
            ctaText="Go Pro"
            ctaLink="https://pay.yoco.com/r/mEDpxp"
            highlight={false}
          />

        </div>

        {/* Footer Note */}
        <div className="text-center mt-12">
          <p className="text-white/50 text-sm max-w-3xl mx-auto">
            All plans include: SA-specific formatting, unlimited team members, weekly updates, 
            and our promise to keep it affordable for the SA film industry.
          </p>
        </div>

      </div>
    </section>
  );
};

interface PricingCardProps {
  name: string;
  price: string;
  period: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
  ctaText: string;
  ctaLink: string;
  highlight: boolean;
  badge?: string;
}

const PricingCard: React.FC<PricingCardProps> = ({
  name,
  price,
  period,
  description,
  icon,
  features,
  ctaText,
  ctaLink,
  highlight,
  badge
}) => {
  return (
    <div className={`
      relative bg-[#161616] rounded-2xl p-8 border transition-all duration-300
      ${highlight 
        ? 'border-neon shadow-[0_0_30px_-5px_rgba(227,255,0,0.3)] scale-105' 
        : 'border-white/10 hover:border-white/20'
      }
    `}>
      
      {/* Badge */}
      {badge && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <span className="bg-neon text-black px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            {badge}
          </span>
        </div>
      )}

      {/* Icon & Name */}
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-3 rounded-xl ${highlight ? 'bg-neon text-black' : 'bg-white/5 text-neon'}`}>
          {icon}
        </div>
        <h3 className="text-xl font-bold text-white">{name}</h3>
      </div>

      {/* Price */}
      <div className="mb-4">
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-bold text-white">{price}</span>
          <span className="text-white/50 text-sm">/ {period}</span>
        </div>
      </div>

      {/* Description */}
      <p className="text-white/60 text-sm mb-6 min-h-[40px]">
        {description}
      </p>

      {/* CTA Button */}
      <a
        href={ctaLink}
        className={`
          block w-full py-3 px-6 rounded-lg font-bold text-center transition-all duration-300 mb-6
          ${highlight
            ? 'bg-neon text-black hover:bg-white'
            : 'bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-neon/50'
          }
        `}
      >
        {ctaText}
      </a>

      {/* Features List */}
      <ul className="space-y-3">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3 text-sm text-white/70">
            <Check className={`w-5 h-5 flex-shrink-0 ${highlight ? 'text-neon' : 'text-white/40'}`} />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

    </div>
  );
};
