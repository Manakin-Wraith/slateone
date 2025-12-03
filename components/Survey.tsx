import React, { useState } from 'react';
import { CheckCircle, Loader2 } from 'lucide-react';

interface SurveyProps {
  email: string;
}

export const Survey: React.FC<SurveyProps> = ({ email }) => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    role: '',
    volume: '',
    tool: ''
  });

  const handleOptionSelect = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    // Auto advance after short delay
    setTimeout(() => {
        if (step < 3) setStep(step + 1);
        else handleSubmit();
    }, 300);
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    // Logic to determine VIP status based on prompt: Producer + 3+ scripts + Excel
    const isVIP = 
        formData.role === 'Producer' && 
        (formData.volume === '3-5' || formData.volume === '6+') && 
        formData.tool === 'Excel';

    setTimeout(() => {
        setIsSubmitting(false);
        setStep(4); // Success state
        console.log("Survey Data:", formData, "VIP Status:", isVIP);
    }, 1500);
  };

  if (step === 4) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="text-center max-w-md animate-[slideIn_0.5s_ease-out]">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-neon/10 rounded-full mb-6">
            <CheckCircle className="w-10 h-10 text-neon" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">You're on the list!</h2>
          <p className="text-white/60 mb-8">
            We've sent a confirmation to <span className="text-white">{email}</span>. 
            We'll be in touch shortly with your beta access key.
          </p>
          <button 
             onClick={() => window.location.reload()}
             className="text-neon hover:text-white underline underline-offset-4 transition-colors"
          >
            Return to Homepage
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-12">
      <div className="max-w-xl w-full">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-2">Want to skip the queue?</h2>
          <p className="text-white/50">Help us customize SlateOne for your workflow.</p>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1 bg-white/10 rounded-full mb-12 overflow-hidden">
            <div 
                className="h-full bg-neon transition-all duration-500 ease-out" 
                style={{ width: `${(step / 3) * 100}%` }}
            ></div>
        </div>

        {isSubmitting ? (
             <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <Loader2 className="w-10 h-10 text-neon animate-spin" />
                <span className="text-white/60 text-sm tracking-widest uppercase">Analyzing Profile...</span>
             </div>
        ) : (
            <div className="bg-[#1a1a1a] border border-white/5 rounded-2xl p-8 shadow-2xl">
            {step === 1 && (
                <div className="space-y-6 animate-[slideIn_0.3s_ease-out]">
                <h3 className="text-xl font-medium text-white">What is your primary role?</h3>
                <div className="space-y-3">
                    {['Producer', '1st AD', 'Line Manager', 'Student', 'Other'].map(opt => (
                    <OptionButton key={opt} label={opt} onClick={() => handleOptionSelect('role', opt)} />
                    ))}
                </div>
                </div>
            )}

            {step === 2 && (
                <div className="space-y-6 animate-[slideIn_0.3s_ease-out]">
                <h3 className="text-xl font-medium text-white">How many scripts do you break down per year?</h3>
                <div className="space-y-3">
                    {['1-2', '3-5', '6+'].map(opt => (
                    <OptionButton key={opt} label={opt} onClick={() => handleOptionSelect('volume', opt)} />
                    ))}
                </div>
                </div>
            )}

            {step === 3 && (
                <div className="space-y-6 animate-[slideIn_0.3s_ease-out]">
                <h3 className="text-xl font-medium text-white">What tool do you currently use?</h3>
                <div className="space-y-3">
                    {['Excel / Google Sheets', 'Movie Magic Scheduling', 'Pen & Paper', 'Gorilla / Other'].map(opt => (
                    <OptionButton key={opt} label={opt} onClick={() => handleOptionSelect('tool', opt)} />
                    ))}
                </div>
                </div>
            )}
            </div>
        )}
      </div>
    </div>
  );
};

const OptionButton: React.FC<{ label: string, onClick: () => void }> = ({ label, onClick }) => (
  <button 
    onClick={onClick}
    className="w-full text-left p-4 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 hover:border-neon/50 hover:text-neon transition-all duration-200 text-white/80"
  >
    {label}
  </button>
);