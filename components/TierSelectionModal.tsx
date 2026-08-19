import React, { useState } from 'react';
import { X, Loader2, ArrowRight } from 'lucide-react';
import { BillingPeriod, createPricingLead, updatePaymentLeadStatus, PricingTier } from '../lib/supabase';

interface TierSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  tier: PricingTier;
  billingPeriod?: BillingPeriod;
}

interface TierDetail {
  name: string;
  tagline: string;
  priceLabel: string;
  price: string;
  includedSeats?: number;
  seatLabel?: string;
  seatPrice?: string;
}

const PROJECT_DETAIL: TierDetail = {
  name: 'Project',
  tagline: 'Unlimited uploads · Pay only when you run a breakdown',
  priceLabel: 'Per breakdown',
  price: 'R2,250',
};

const TIER_DETAILS: Record<PricingTier, Record<BillingPeriod, TierDetail>> = {
  tier_1: {
    '3month': PROJECT_DETAIL,
    '6month': PROJECT_DETAIL,
    annual: PROJECT_DETAIL,
  },
  tier_2: {
    '3month': {
      name: 'Studio 3',
      tagline: 'Unlimited breakdowns · Full team collaboration',
      priceLabel: '3-month commitment',
      price: 'R5,500 / 3mo',
      includedSeats: 1,
      seatLabel: '+ Extra seat',
      seatPrice: 'R750 flat',
    },
    '6month': {
      name: 'Studio 6',
      tagline: 'Unlimited breakdowns · Full team collaboration',
      priceLabel: '6-month commitment',
      price: 'R9,500 / 6mo',
      includedSeats: 2,
      seatLabel: '+ Extra seat',
      seatPrice: 'R1,500 flat',
    },
    annual: {
      name: 'Studio 12',
      tagline: 'Unlimited breakdowns · Full team collaboration',
      priceLabel: '12-month commitment',
      price: 'R18,500/yr',
      includedSeats: 3,
      seatLabel: '+ Extra seat',
      seatPrice: 'R3,000 flat',
    },
  },
};

export const TierSelectionModal: React.FC<TierSelectionModalProps> = ({ isOpen, onClose, tier, billingPeriod = 'annual' }) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const details = TIER_DETAILS[tier][billingPeriod];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const result = await createPricingLead({
        email: email.trim(),
        tier,
        billingPeriod,
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
          {typeof details.includedSeats === 'number' && (
            <div className="flex items-center justify-between py-3">
              <span className="text-sm text-slate-300">Includes</span>
              <span className="text-sm font-bold text-slate-200">
                {details.includedSeats > 0
                  ? `${details.includedSeats} seat${details.includedSeats > 1 ? 's' : ''}`
                  : 'No seats'}
              </span>
            </div>
          )}
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
