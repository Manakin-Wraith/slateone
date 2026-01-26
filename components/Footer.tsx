import React from 'react';
import { ArrowUp } from 'lucide-react';

interface FooterProps {
  onPrivacyPolicyClick?: () => void;
  onTermsOfServiceClick?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onPrivacyPolicyClick, onTermsOfServiceClick }) => {
  const scrollToHero = () => {
    document.getElementById('hero-cta')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="py-24 bg-charcoal relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
        <h1 className="text-[20vw] font-bold text-white leading-none select-none">SHOOT</h1>
      </div>

      <div className="max-w-3xl mx-auto px-4 text-center relative z-10">
        <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
          One Breakdown. <br/>
          <span className="text-cyan">Your Whole Team.</span>
        </h2>
        
        <p className="text-white/50 mb-10 text-lg">
          Share with your whole crew — no seat limits, no extra fees. Everyone's included.
        </p>

        <button 
          onClick={scrollToHero}
          className="bg-cyan text-black font-bold px-8 py-4 rounded-lg hover:bg-white transition-colors duration-300 inline-flex items-center gap-2 group"
        >
          Get Access
          <ArrowUp className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
        </button>

        {/* Legal Links */}
        {(onPrivacyPolicyClick || onTermsOfServiceClick) && (
          <div className="mt-12 pt-8 border-t border-white/10">
            <div className="flex justify-center gap-6 text-sm text-white/40">
              {onPrivacyPolicyClick && (
                <button
                  onClick={onPrivacyPolicyClick}
                  className="hover:text-cyan transition-colors"
                >
                  Privacy Policy
                </button>
              )}
              {onTermsOfServiceClick && (
                <button
                  onClick={onTermsOfServiceClick}
                  className="hover:text-cyan transition-colors"
                >
                  Terms of Service
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};