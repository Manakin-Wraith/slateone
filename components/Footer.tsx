import React from 'react';
import { ArrowUp } from 'lucide-react';

export const Footer: React.FC = () => {
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
      </div>
    </section>
  );
};