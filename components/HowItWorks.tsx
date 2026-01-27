import React, { useState } from 'react';
import { ChevronRight, Upload, Zap, Download } from 'lucide-react';
import { PaymentModal } from './PaymentModal';

interface HowItWorksProps {
  onSignup: (email: string) => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ onSignup }) => {
  const [email, setEmail] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState<'R49' | 'R249'>('R49');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) onSignup(email);
  };

  return (
    <section className="py-24 bg-charcoal/50 border-y border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-6">
            Three Steps to Your Breakdown
          </h2>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            From script upload to production-ready breakdown in minutes
          </p>
        </div>

        {/* Process Flow */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          
          {/* Step 1 */}
          <div className="relative">
            <div className="bg-[#161616] border border-white/10 rounded-2xl p-8 hover:border-neon/30 transition-all duration-300">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-full bg-neon/20 border-2 border-neon flex items-center justify-center text-neon font-bold text-xl flex-shrink-0">
                  1
                </div>
                <div className="w-12 h-12 rounded-xl bg-neon/10 flex items-center justify-center flex-shrink-0">
                  <Upload className="w-6 h-6 text-neon" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Upload Script</h3>
              <p className="text-white/60 text-sm leading-relaxed">
                Drop your PDF script into SlateOne. We support all standard screenplay formats.
              </p>
            </div>
            {/* Arrow for desktop */}
            <ChevronRight className="hidden md:block absolute top-1/2 -right-4 -translate-y-1/2 w-8 h-8 text-neon/30" />
          </div>

          {/* Step 2 */}
          <div className="relative">
            <div className="bg-[#161616] border border-white/10 rounded-2xl p-8 hover:border-neon/30 transition-all duration-300">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-full bg-neon/20 border-2 border-neon flex items-center justify-center text-neon font-bold text-xl flex-shrink-0">
                  2
                </div>
                <div className="w-12 h-12 rounded-xl bg-neon/10 flex items-center justify-center flex-shrink-0">
                  <Zap className="w-6 h-6 text-neon" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">AI Breakdown</h3>
              <p className="text-white/60 text-sm leading-relaxed">
                Our AI extracts cast, props, locations, FX, wardrobe, vehicles, and more in minutes.
              </p>
            </div>
            {/* Arrow for desktop */}
            <ChevronRight className="hidden md:block absolute top-1/2 -right-4 -translate-y-1/2 w-8 h-8 text-neon/30" />
          </div>

          {/* Step 3 */}
          <div className="relative">
            <div className="bg-[#161616] border border-white/10 rounded-2xl p-8 hover:border-neon/30 transition-all duration-300">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-full bg-neon/20 border-2 border-neon flex items-center justify-center text-neon font-bold text-xl flex-shrink-0">
                  3
                </div>
                <div className="w-12 h-12 rounded-xl bg-neon/10 flex items-center justify-center flex-shrink-0">
                  <Download className="w-6 h-6 text-neon" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Export & Share</h3>
              <p className="text-white/60 text-sm leading-relaxed">
                Download your breakdown as PDF or share directly with your crew. Start shooting.
              </p>
            </div>
          </div>

        </div>

        {/* Pricing Options - COMMENTED OUT 
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            
            <button
              onClick={() => {
                setSelectedTier('R49');
                setIsModalOpen(true);
              }}
              className="group bg-[#161616] border-2 border-white/10 hover:border-neon rounded-xl p-6 transition-all duration-300 hover:shadow-[0_0_30px_-5px_rgba(227,255,0,0.2)] w-full text-left"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-1">R49</h3>
                  <p className="text-sm text-white/50">One-time payment</p>
                </div>
                <ChevronRight className="w-6 h-6 text-neon group-hover:translate-x-1 transition-transform" />
              </div>
              <p className="text-white/70 text-sm mb-4">
                1 Script upload + 1 full breakdown + 1 month access
              </p>
              <div className="inline-flex items-center gap-2 text-neon text-sm font-medium">
                Try 1 Script
                <ChevronRight className="w-4 h-4" />
              </div>
            </button>

            <button
              onClick={() => {
                setSelectedTier('R249');
                setIsModalOpen(true);
              }}
              className="group bg-gradient-to-br from-neon/10 to-neon/5 border-2 border-neon rounded-xl p-6 transition-all duration-300 hover:shadow-[0_0_40px_-5px_rgba(227,255,0,0.4)] relative overflow-hidden w-full text-left"
            >
              <div className="absolute top-3 right-3">
                <span className="bg-neon text-black px-3 py-1 rounded-full text-xs font-bold uppercase">
                  Popular
                </span>
              </div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-1">R249</h3>
                  <p className="text-sm text-white/50">Beta access</p>
                </div>
                <ChevronRight className="w-6 h-6 text-neon group-hover:translate-x-1 transition-transform" />
              </div>
              <p className="text-white/70 text-sm mb-4">
                Unlimited scripts for untill we go LIVE + shape the product with your feedback
              </p>
              <div className="inline-flex items-center gap-2 text-neon text-sm font-medium">
                Join Beta
                <ChevronRight className="w-4 h-4" />
              </div>
            </button>

          </div>
        </div>
        */}

        {/* Waitlist Form */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-[#161616] border border-white/10 rounded-xl p-6">
            <p className="text-white/60 text-sm mb-4 text-center">
              Not ready yet? Join the waitlist for updates and early access opportunities.
            </p>
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
              <input 
                type="email" 
                placeholder="producer@production.co.za" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-grow bg-white/5 border border-white/10 text-white placeholder-white/40 px-4 py-3 rounded-lg focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon transition-all text-sm"
              />
              <button 
                type="submit"
                className="bg-white/10 border border-white/20 text-white font-medium px-6 py-3 rounded-lg hover:bg-white/20 transition-colors duration-300 whitespace-nowrap text-sm"
              >
                Get Updates
              </button>
            </form>
          </div>
        </div>

      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        paymentTier={selectedTier}
      />
    </section>
  );
};
