import React, { useState, useEffect } from 'react';
import { ChevronRight, Zap } from 'lucide-react';

interface HeroProps {
  onSignup: (email: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onSignup }) => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) onSignup(email);
  };

  return (
    <section id="hero-cta" className="relative overflow-hidden min-h-[90vh] flex items-center border-b border-white/5">
      {/* Background Gradient Mesh */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-neon/5 blur-[120px]" />
        <div className="absolute top-[40%] -right-[10%] w-[40%] h-[60%] rounded-full bg-cyan/5 blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12 lg:py-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          
          {/* Left: Copy */}
          <div className="space-y-8 z-10">
            <div className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 backdrop-blur-sm">
              <span className="flex h-2 w-2 rounded-full bg-neon animate-pulse"></span>
              <span className="text-xs font-medium text-white/80 tracking-wide uppercase">Beta Access: SA Productions Only</span>
            </div>

            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold leading-[0.95] tracking-tight text-white">
              Stop Highlighting. <br/>
              <span className="text-neon neon-glow">Start Shooting.</span>
            </h1>

            <p className="text-xl text-white/60 max-w-lg leading-relaxed">
              The first AI script breakdown tool built for the SA industry. Turn your PDF into a shooting schedule in seconds — and share it with your whole team instantly.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md">
              <input 
                type="email" 
                placeholder="producer@production.co.za" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-grow bg-white/5 border border-white/10 text-white placeholder-white/40 px-6 py-4 rounded-lg focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon transition-all"
              />
              <button 
                type="submit"
                className="bg-neon text-black font-bold px-8 py-4 rounded-lg hover:bg-white transition-colors duration-300 flex items-center justify-center gap-2 whitespace-nowrap"
              >
                Get Access
                <ChevronRight className="w-5 h-5" />
              </button>
            </form>
            
            <p className="text-sm text-white/40">
              *6 months Beta access for the first 50 SA productions. Invite your whole crew.
            </p>
          </div>

          {/* Right: The "Magic" Animation */}
          <div className="relative h-[400px] sm:h-[500px] w-full bg-black/40 border border-white/10 rounded-xl overflow-hidden shadow-2xl backdrop-blur-sm">
            <div className="absolute top-0 w-full h-8 bg-[#1a1a1a] flex items-center px-4 gap-2 border-b border-white/5 z-20">
              <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
            </div>
            
            <div className="flex h-full pt-8">
              {/* Animated Script Side */}
              <div className="w-1/2 border-r border-white/5 p-6 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-charcoal z-10"></div>
                <div className="animate-[scrollUp_8s_linear_infinite] font-mono text-xs text-white/50 space-y-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="space-y-2 opacity-60">
                      <p className="text-white/80 font-bold">INT. JOHANNESBURG APARTMENT - DAY</p>
                      <p>THABO (30s) sits at a cluttered desk.</p>
                      <p className="pl-8">THABO</p>
                      <p className="pl-4">I can't believe I have to type this all out again.</p>
                      <p>He takes a sip of COFFEE.</p>
                      <br/>
                      <p className="text-white/80 font-bold">EXT. MABONENG PRECINCT - DAY</p>
                      <p>A RED TAXI swerves through traffic.</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Animated Schedule Side */}
              <div className="w-1/2 p-4 bg-[#0F0F0F] relative">
                 <div className="space-y-3">
                   {/* Simulating items popping in */}
                   <ScheduleCard delay="0s" title="1. INT. JHB APARTMENT" meta="D1 • 1/8 Pgs • Cast: Thabo" color="border-neon" />
                   <ScheduleCard delay="1s" title="2. EXT. MABONENG" meta="D1 • 4/8 Pgs • Cast: Taxi Driver" color="border-cyan" />
                   <ScheduleCard delay="2s" title="3. INT. HOSPITAL" meta="N1 • 2/8 Pgs • Cast: Doctor" color="border-pink-500" />
                   <ScheduleCard delay="3s" title="4. EXT. ROOFTOP" meta="N1 • 6/8 Pgs • Cast: Thabo, Sarah" color="border-purple-500" />
                 </div>
                 
                 {/* Processing Overlay */}
                 <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-[1px] animate-[fadeOut_4s_forwards]">
                    <div className="flex flex-col items-center">
                      <Zap className="w-10 h-10 text-neon animate-bounce mb-2" />
                      <span className="font-mono text-neon text-xs">AI BREAKDOWN...</span>
                    </div>
                 </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      <style>{`
        @keyframes scrollUp {
          from { transform: translateY(0); }
          to { transform: translateY(-50%); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeOut {
          0% { opacity: 1; visibility: visible; }
          80% { opacity: 1; visibility: visible; }
          100% { opacity: 0; visibility: hidden; }
        }
      `}</style>
    </section>
  );
};

const ScheduleCard = ({ delay, title, meta, color }: { delay: string; title: string; meta: string; color: string }) => (
  <div 
    className={`bg-[#1a1a1a] p-3 rounded border-l-4 ${color} shadow-lg opacity-0`}
    style={{ animation: `slideIn 0.5s ease-out forwards ${delay}` }}
  >
    <div className="font-bold text-white text-xs mb-1">{title}</div>
    <div className="text-[10px] text-white/50 font-mono uppercase">{meta}</div>
  </div>
);