import React, { useState } from 'react';
import { X, Loader2, ArrowRight } from 'lucide-react';
import { createSubscriptionLead, updatePaymentLeadStatus, SubscriptionTier } from '../lib/supabase';

interface TierSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  tier: SubscriptionTier;
}

const TIER_DISPLAY: Record<SubscriptionTier, { name: string; price: string; description: string }> = {
  single_script: {
    name: '1 Breakdown',
    price: 'R500',
    description: 'Single breakdown • Full production workspace • 6 months active',
  },
  pack_5: {
    name: '5 Breakdown Pack',
    price: 'R2,000',
    description: '5 breakdowns • R400/breakdown • 12 months credit validity',
  },
  pack_10: {
    name: '10 Breakdown Pack',
    price: 'R3,500',
    description: '10 breakdowns • R350/breakdown • 12 months credit validity',
  },
  pack_25: {
    name: '25 Breakdown Pack',
    price: 'R7,500',
    description: '25 breakdowns • R300/breakdown • 12 months credit validity',
  },
};

export const TierSelectionModal: React.FC<TierSelectionModalProps> = ({ isOpen, onClose, tier }) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const tierInfo = TIER_DISPLAY[tier];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const result = await createSubscriptionLead({
        email: email.trim(),
        payment_tier: tier,
        source: 'pricing_section',
      });

      if (result.success && result.yocoUrl && result.trackingId) {
        await updatePaymentLeadStatus(result.trackingId, 'redirected');
        window.location.href = result.yocoUrl;
      } else {
        setError('Something went wrong. Please try again.');
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error('Payment redirect error:', err);
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

        <>
          {/* Header */}
          <div className="mb-6">
            <p className="text-[10px] font-mono text-neon/60 uppercase tracking-[0.2em] mb-3">
              Continue to Payment
            </p>
            <h2 className="text-xl font-display font-bold text-white mb-1">{tierInfo.name}</h2>
            <p className="text-sm text-white/30">{tierInfo.description}</p>
          </div>

          {/* Tier price */}
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-lg p-4 mb-6 flex items-center justify-between">
            <span className="text-sm text-white/50">Pack price</span>
            <span className="text-lg font-bold text-neon">{tierInfo.price}</span>
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
                  Continue to Payment
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <p className="text-[10px] text-white/15 text-center pt-1">
              You'll be redirected to our secure payment page.
            </p>
          </form>
        </>
      </div>
    </div>
  );
};
