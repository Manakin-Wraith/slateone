import React, { useState } from 'react';
import { X, Loader2, ArrowRight } from 'lucide-react';
import { createPricingLead, updatePaymentLeadStatus, PricingTier } from '../lib/supabase';

interface TierSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  tier: PricingTier;
}

const TIER_DETAILS: Record<PricingTier, { name: string; tagline: string; priceLabel: string; price: string; seatLabel?: string; seatPrice?: string }> = {
  tier_1: {
    name: 'Pay-Per-Breakdown',
    tagline: 'Unlimited uploads · Pay only when you run a breakdown',
    priceLabel: 'Per breakdown',
    price: 'R450',
  },
  tier_2: {
    name: 'Annual Team License',
    tagline: 'Unlimited breakdowns · Full team collaboration',
    priceLabel: 'Annual license',
    price: 'R1,850/yr',
    seatLabel: '+ Per seat',
    seatPrice: 'R150/seat',
  },
};

export const TierSelectionModal: React.FC<TierSelectionModalProps> = ({ isOpen, onClose, tier }) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const details = TIER_DETAILS[tier];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const result = await createPricingLead({
        email: email.trim(),
        tier,
        source: 'pricing_section',
      });

      if (result.success && result.signupUrl && result.trackingId) {
        await updatePaymentLeadStatus(result.trackingId, 'redirected');
        window.location.href = result.signupUrl;
      } else {
        setError('Something went wrong. Please try again.');
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error('Signup redirect error:', err);
      setError('An unexpected error occurred. Please try again.');
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setEmail('');
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="relative bg-slate-800 border border-slate-700 rounded-xl max-w-md w-full p-8 shadow-2xl">

        {/* Close */}
        <button
          onClick={handleClose}
          disabled={isSubmitting}
          className="absolute top-4 right-4 text-slate-500 hover:text-slate-200 transition-colors disabled:opacity-50"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <p className="text-[10px] font-mono text-amber-500/70 uppercase tracking-[0.2em] mb-3">
            Continue to Signup
          </p>
          <h2 className="text-xl font-bold text-slate-50 mb-1">{details.name}</h2>
          <p className="text-sm text-slate-500">{details.tagline}</p>
        </div>

        {/* Price */}
        <div className="bg-slate-700 border border-slate-600 rounded-lg p-4 mb-6 divide-y divide-slate-600/70">
          <div className="flex items-center justify-between pb-3">
            <span className="text-sm text-slate-300">{details.priceLabel}</span>
            <span className="text-lg font-bold text-slate-50">{details.price}</span>
          </div>
          {details.seatLabel && details.seatPrice && (
            <div className="flex items-center justify-between pt-3">
              <span className="text-sm text-slate-300">{details.seatLabel}</span>
              <span className="text-lg font-bold text-amber-500">{details.seatPrice}</span>
            </div>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="email"
            name="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            disabled={isSubmitting}
            className="w-full bg-slate-700 border border-slate-600 text-slate-50 placeholder-slate-500 px-4 py-3 rounded-lg focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 transition-all text-sm disabled:opacity-50"
          />

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-amber-500 text-slate-900 font-bold px-6 py-3.5 rounded-lg hover:bg-amber-400 transition-all duration-300 flex items-center justify-center gap-2 text-sm disabled:opacity-50"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                Continue to Signup
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <p className="text-[10px] text-slate-600 text-center pt-1">
            You'll be taken to app.slateone.studio to create your account.
          </p>
        </form>
      </div>
    </div>
  );
};
