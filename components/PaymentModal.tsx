import React, { useState } from 'react';
import { X, Loader2, CreditCard } from 'lucide-react';
import { createPaymentLead, updatePaymentLeadStatus, PaymentLeadData } from '../lib/supabase';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  paymentTier: 'R49' | 'R249';
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, paymentTier }) => {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    phone: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const leadData: PaymentLeadData = {
        email: formData.email.trim(),
        name: formData.name.trim(),
        phone: formData.phone.trim() || undefined,
        payment_tier: paymentTier,
        source: 'how_it_works_section'
      };

      const result = await createPaymentLead(leadData);

      if (result.success && result.yocoUrl && result.trackingId) {
        // Update status to redirected
        await updatePaymentLeadStatus(result.trackingId, 'redirected');
        
        // Redirect to Yoco payment page
        window.location.href = result.yocoUrl;
      } else {
        setError(result.error || 'Failed to process your request. Please try again.');
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error('Payment modal error:', err);
      setError('An unexpected error occurred. Please try again.');
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (!isOpen) return null;

  const tierInfo = paymentTier === 'R49' 
    ? { name: 'Try 1 Script', description: '1 Script upload + 1 full breakdown + 1 month access' }
    : { name: 'Join Beta', description: 'Unlimited scripts until we go LIVE + shape the product with your feedback' };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative bg-[#161616] border border-white/10 rounded-2xl max-w-md w-full p-8 shadow-2xl">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isSubmitting}
          className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors disabled:opacity-50"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <div className="w-12 h-12 rounded-xl bg-neon/10 flex items-center justify-center mb-4">
            <CreditCard className="w-6 h-6 text-neon" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Almost there!</h2>
          <p className="text-white/60 text-sm">
            Where should we send your receipt and breakdown access?
          </p>
        </div>

        {/* Tier Info */}
        <div className="bg-neon/5 border border-neon/20 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white font-bold">{tierInfo.name}</span>
            <span className="text-neon font-bold text-xl">{paymentTier}</span>
          </div>
          <p className="text-white/60 text-xs">{tierInfo.description}</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-2">
              Email Address <span className="text-neon">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="producer@production.co.za"
              disabled={isSubmitting}
              className="w-full bg-white/5 border border-white/10 text-white placeholder-white/40 px-4 py-3 rounded-lg focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon transition-all disabled:opacity-50"
            />
          </div>

          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-white/80 mb-2">
              Full Name <span className="text-neon">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              disabled={isSubmitting}
              className="w-full bg-white/5 border border-white/10 text-white placeholder-white/40 px-4 py-3 rounded-lg focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon transition-all disabled:opacity-50"
            />
          </div>

          {/* Phone (Optional for R249) */}
          {paymentTier === 'R249' && (
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-white/80 mb-2">
                Phone Number <span className="text-white/40 text-xs">(Optional)</span>
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+27 82 123 4567"
                disabled={isSubmitting}
                className="w-full bg-white/5 border border-white/10 text-white placeholder-white/40 px-4 py-3 rounded-lg focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon transition-all disabled:opacity-50"
              />
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-neon text-black font-bold px-8 py-4 rounded-lg hover:bg-white transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_30px_-5px_rgba(227,255,0,0.5)]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                Continue to Payment
              </>
            )}
          </button>

          {/* Privacy Note */}
          <p className="text-white/40 text-xs text-center">
            Your information is secure and will only be used for order processing and product updates.
          </p>
        </form>

      </div>
    </div>
  );
};
