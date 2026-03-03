import React, { useState } from 'react';
import { X, Loader2, ArrowRight, CheckCircle } from 'lucide-react';
import { createSubscriptionLead, SubscriptionTier } from '../lib/supabase';

interface TierSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  tier: SubscriptionTier;
}

const TIER_DISPLAY: Record<SubscriptionTier, { name: string; price: string; description: string }> = {
  development_os: {
    name: 'Development OS',
    price: 'R499/mo',
    description: '1 active project • 2 users • Full script breakdown',
  },
  producer_os: {
    name: 'Producer OS',
    price: 'R1,999/mo',
    description: '3 active projects • 10 users • Full scheduling',
  },
  studio_os: {
    name: 'Studio OS',
    price: 'R3,499/mo',
    description: 'Unlimited projects • 25 users • Full suite',
  },
};

export const TierSelectionModal: React.FC<TierSelectionModalProps> = ({ isOpen, onClose, tier }) => {
  const [formData, setFormData] = useState({ email: '', name: '', phone: '', company: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const tierInfo = TIER_DISPLAY[tier];
  const isStudio = tier === 'studio_os';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    // Save lead to DB (best-effort, non-blocking)
    const result = await createSubscriptionLead({
      email: formData.email.trim(),
      name: formData.name.trim(),
      phone: formData.phone.trim() || undefined,
      company: formData.company.trim() || undefined,
      payment_tier: tier,
      source: 'pricing_section',
    });

    if (isStudio) {
      // Studio OS: show confirmation (no Yoco redirect)
      setIsSuccess(true);
      setIsSubmitting(false);
    } else if (result.yocoUrl) {
      // Dev/Producer OS: redirect straight to Yoco payment
      window.location.href = result.yocoUrl;
    } else {
      setError('Could not generate payment link. Please try again.');
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleClose = () => {
    setFormData({ email: '', name: '', phone: '', company: '' });
    setError(null);
    setIsSuccess(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative bg-[#111] border border-white/[0.08] rounded-xl max-w-md w-full p-8 shadow-2xl">
        
        {/* Close */}
        <button
          onClick={handleClose}
          disabled={isSubmitting}
          className="absolute top-4 right-4 text-white/30 hover:text-white transition-colors disabled:opacity-50"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="text-center py-6">
            <div className="w-14 h-14 rounded-full bg-neon/10 border border-neon/20 flex items-center justify-center mx-auto mb-5">
              <CheckCircle className="w-7 h-7 text-neon" />
            </div>
            <h2 className="text-xl font-display font-bold text-white mb-2">Request Received</h2>
            <p className="text-sm text-white/40 mb-6">
              Our team will reach out to schedule your Studio OS onboarding.
            </p>
            <button onClick={handleClose} className="text-sm text-neon hover:text-white transition-colors font-mono uppercase tracking-wider">
              Close
            </button>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="mb-6">
              <p className="text-[10px] font-mono text-neon/60 uppercase tracking-[0.2em] mb-3">
                {isStudio ? 'Contact Sales' : 'Continue to Payment'}
              </p>
              <h2 className="text-xl font-display font-bold text-white mb-1">{tierInfo.name}</h2>
              <p className="text-sm text-white/30">{tierInfo.description}</p>
            </div>

            {/* Tier price */}
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-lg p-4 mb-6 flex items-center justify-between">
              <span className="text-sm text-white/50">Monthly subscription</span>
              <span className="text-lg font-bold text-neon">{tierInfo.price}</span>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="Email address *"
                disabled={isSubmitting}
                className="w-full bg-white/[0.03] border border-white/[0.08] text-white placeholder-white/25 px-4 py-3 rounded-lg focus:outline-none focus:border-neon/40 focus:ring-1 focus:ring-neon/20 transition-all text-sm disabled:opacity-50"
              />
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Full name *"
                disabled={isSubmitting}
                className="w-full bg-white/[0.03] border border-white/[0.08] text-white placeholder-white/25 px-4 py-3 rounded-lg focus:outline-none focus:border-neon/40 focus:ring-1 focus:ring-neon/20 transition-all text-sm disabled:opacity-50"
              />
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="Production company (optional)"
                disabled={isSubmitting}
                className="w-full bg-white/[0.03] border border-white/[0.08] text-white placeholder-white/25 px-4 py-3 rounded-lg focus:outline-none focus:border-neon/40 focus:ring-1 focus:ring-neon/20 transition-all text-sm disabled:opacity-50"
              />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone (optional)"
                disabled={isSubmitting}
                className="w-full bg-white/[0.03] border border-white/[0.08] text-white placeholder-white/25 px-4 py-3 rounded-lg focus:outline-none focus:border-neon/40 focus:ring-1 focus:ring-neon/20 transition-all text-sm disabled:opacity-50"
              />

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-neon text-black font-bold px-6 py-3.5 rounded-lg hover:bg-white transition-all duration-300 flex items-center justify-center gap-2 text-sm tracking-wide uppercase disabled:opacity-50"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    {isStudio ? 'Request Access' : 'Continue to Payment'}
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <p className="text-[10px] text-white/15 text-center pt-1">
                {isStudio
                  ? 'Our team will contact you within 24 hours.'
                  : 'You will be redirected to our secure payment provider.'}
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
