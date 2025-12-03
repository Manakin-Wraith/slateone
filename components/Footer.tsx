import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';

interface FooterProps {
  onSignup: (email: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSignup }) => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) onSignup(email);
  };

  return (
    <section id="footer-cta" className="py-24 bg-charcoal relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
        <h1 className="text-[20vw] font-bold text-white leading-none select-none">SHOOT</h1>
      </div>

      <div className="max-w-3xl mx-auto px-4 text-center relative z-10">
        <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
          Ready to fast-track your <br/>
          <span className="text-cyan">Pre-Prod?</span>
        </h2>
        
        <p className="text-white/50 mb-10 text-lg">
          Join the waitlist. 
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
          <input 
            type="email" 
            placeholder="Enter your email address" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-grow bg-white/5 border border-white/10 text-white placeholder-white/30 px-6 py-4 rounded-lg focus:outline-none focus:border-cyan focus:ring-1 focus:ring-cyan transition-all"
            required
          />
          <button 
            type="submit"
            className="bg-cyan text-black font-bold px-8 py-4 rounded-lg hover:bg-white transition-colors duration-300 flex items-center justify-center gap-2"
          >
            Request Access
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>
      </div>
    </section>
  );
};