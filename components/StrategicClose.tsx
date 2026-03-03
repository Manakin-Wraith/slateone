import React, { useState } from 'react';
import { ArrowRight, Loader2, CheckCircle } from 'lucide-react';
import { addToWaitlist } from '../lib/supabase';

export const StrategicClose: React.FC = () => {
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsSubmitting(true);
    const source = company ? `landing_request_access:${company}` : 'landing_request_access';
    const result = await addToWaitlist(email, source);
    
    if (result.success || result.error === 'already_registered') {
      setIsSuccess(true);
    } else {
      console.error('Request access error:', result.error);
    }
    setIsSubmitting(false);
  };

  return (
    <section id="request-access" className="py-32 bg-black relative overflow-hidden">
      {/* Subtle gradient */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-neon/[0.03] blur-[150px]" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">

        {/* Statement */}
        <p className="text-sm font-mono text-white/20 tracking-[0.2em] uppercase mb-8">
          Production Infrastructure
        </p>
        
        <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-6 leading-[1.1]">
          Every serious production<br/>runs on systems.
        </h2>
        
        <p className="text-xl text-white/40 mb-4 leading-relaxed">
          SlateOne is the system layer film sets have been missing.
        </p>

        <div className="h-px w-16 bg-neon/30 mx-auto my-10" />

        {/* Request Access Form */}
        {isSuccess ? (
          <div className="inline-flex flex-col items-center space-y-4 py-8">
            <div className="w-14 h-14 rounded-full bg-neon/10 border border-neon/20 flex items-center justify-center">
              <CheckCircle className="w-7 h-7 text-neon" />
            </div>
            <p className="text-white font-display text-xl font-bold">Access Requested</p>
            <p className="text-white/40 text-sm max-w-md">
              Our team will be in touch to schedule your production walkthrough.
            </p>
          </div>
        ) : (
          <div className="max-w-md mx-auto">
            <p className="text-sm text-white/30 mb-6 font-mono uppercase tracking-wider">
              Request Access
            </p>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input 
                type="email" 
                placeholder="producer@production.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
                className="w-full bg-white/[0.03] border border-white/[0.08] text-white placeholder-white/25 px-5 py-4 rounded-lg focus:outline-none focus:border-neon/40 focus:ring-1 focus:ring-neon/20 transition-all text-sm disabled:opacity-50"
              />
              <input 
                type="text" 
                placeholder="Production Company (optional)"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                disabled={isSubmitting}
                className="w-full bg-white/[0.03] border border-white/[0.08] text-white placeholder-white/25 px-5 py-4 rounded-lg focus:outline-none focus:border-neon/40 focus:ring-1 focus:ring-neon/20 transition-all text-sm disabled:opacity-50"
              />
              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-neon text-black font-bold px-8 py-4 rounded-lg hover:bg-white transition-all duration-300 flex items-center justify-center gap-3 text-sm tracking-wide uppercase disabled:opacity-50"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    Request Access
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
            <p className="text-xs text-white/15 mt-4">
              High-touch onboarding. No self-serve trial.
            </p>
          </div>
        )}

      </div>
    </section>
  );
};
