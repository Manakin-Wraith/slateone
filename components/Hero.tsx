import React from 'react';
import { ArrowRight } from 'lucide-react';

export const Hero: React.FC = () => {

  const scrollToPricing = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero-cta" className="relative overflow-hidden min-h-[100vh] flex items-end lg:items-center border-b border-white/5">
      {/* Subtle grid background */}
      <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] [background-size:60px_60px]" />
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute -top-[30%] -left-[15%] w-[50%] h-[50%] rounded-full bg-neon/3 blur-[150px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-20 pb-32 lg:py-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          
          {/* Left: Copy */}
          <div className="z-10">

            {/* Headline */}
            <h1 className="font-display text-5xl sm:text-6xl lg:text-[5.5rem] font-bold leading-[0.95] tracking-tight text-white mb-8">
              The Operating System<br/>
              for Modern Film<br/>
              <span className="text-neon">Production.</span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl md:text-2xl text-white/50 max-w-2xl leading-relaxed mb-12 font-light">
              SlateOne converts scripts into structured production intelligence and replaces fragmented workflows with a unified operating layer.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <a 
                href="#pricing"
                onClick={scrollToPricing}
                className="bg-neon text-black font-bold px-8 py-4 rounded-lg hover:bg-white transition-all duration-300 flex items-center gap-3 text-sm tracking-wide uppercase"
              >
                View Pricing
                <ArrowRight className="w-4 h-4" />
              </a>
              <a 
                href="mailto:hello@slateone.studio?subject=Production Demo Request"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/50 hover:text-neon border border-white/10 hover:border-neon/30 px-8 py-4 rounded-lg transition-all duration-300 text-sm tracking-wide uppercase font-medium"
              >
                Book a Production Demo
              </a>
            </div>
          </div>

          {/* Right: Script-to-Breakdown Animation */}
          <div className="relative h-[400px] sm:h-[500px] w-full bg-black/40 border border-white/[0.08] rounded-xl overflow-hidden shadow-2xl backdrop-blur-sm hidden lg:block">
            <div className="absolute top-0 w-full h-8 bg-[#111] flex items-center px-4 gap-2 border-b border-white/5 z-20">
              <div className="w-2.5 h-2.5 rounded-full bg-white/10"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-white/10"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-white/10"></div>
              <span className="ml-3 text-[10px] font-mono text-white/20 tracking-wider uppercase">SlateOne — Breakdown Engine</span>
            </div>
            
            <div className="flex h-full pt-8">
              {/* Script Side */}
              <div className="w-1/2 border-r border-white/5 p-5 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80 z-10 pointer-events-none"></div>
                <div className="animate-[heroScroll_12s_linear_infinite] font-mono text-[11px] text-white/40 space-y-5 leading-relaxed">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="space-y-3">
                      <p className="text-white/60 font-bold tracking-wide">EXT. MABONENG PRECINCT — DAY</p>
                      <p>A RED TAXI swerves through traffic.</p>
                      <br/>
                      <p className="text-white/60 font-bold tracking-wide">INT. JOHANNESBURG APARTMENT — DAY</p>
                      <p>THABO (30s) sits at a cluttered desk.</p>
                      <p className="pl-8 text-white/30">THABO</p>
                      <p className="pl-6 text-white/30">I can't believe I have to type<br/>this all out again.</p>
                      <p>He takes a sip of COFFEE.</p>
                      <br/>
                      <p className="text-white/60 font-bold tracking-wide">INT. JOHANNESBURG APARTMENT — DAY</p>
                      <p>THABO (30s) sits at a cluttered desk.</p>
                      <p className="pl-8 text-white/30">THABO</p>
                      <p className="pl-6 text-white/30">I can't believe I have to type<br/>this all out again.</p>
                      <p>He takes a sip of COFFEE.</p>
                      <br/>
                      <p className="text-white/60 font-bold tracking-wide">EXT. MABONENG PRECINCT — DAY</p>
                      <p>A RED TAXI swerves through traffic.</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Breakdown Side */}
              <div className="w-1/2 p-4 bg-[#0a0a0a] relative">
                <div className="space-y-3 pt-1">
                  <BreakdownCard delay="0s" title="1. INT. JHB APARTMENT" meta="D1 • 1/8 PGS • CAST: THABO" color="border-neon" />
                  <BreakdownCard delay="1.2s" title="2. EXT. MABONENG" meta="D1 • 4/8 PGS • CAST: TAXI DRIVER" color="border-cyan" />
                  <BreakdownCard delay="2.4s" title="3. INT. HOSPITAL" meta="N1 • 2/8 PGS • CAST: DOCTOR" color="border-pink-500" />
                  <BreakdownCard delay="3.6s" title="4. EXT. ROOFTOP" meta="N1 • 6/8 PGS • CAST: THABO, SARAH" color="border-purple-400" />
                </div>

                {/* Processing overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-[2px] animate-[heroFade_5s_forwards] pointer-events-none">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-neon/10 border border-neon/20 flex items-center justify-center animate-pulse">
                      <span className="text-neon text-sm font-bold">S1</span>
                    </div>
                    <span className="font-mono text-[10px] text-neon/80 tracking-[0.2em] uppercase">Processing Script</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      <style>{`
        @keyframes heroScroll {
          from { transform: translateY(0); }
          to { transform: translateY(-50%); }
        }
        @keyframes heroSlideIn {
          from { opacity: 0; transform: translateX(16px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes heroFade {
          0% { opacity: 1; }
          70% { opacity: 1; }
          100% { opacity: 0; visibility: hidden; }
        }
      `}</style>
    </section>
  );
};

const BreakdownCard = ({ delay, title, meta, color }: { delay: string; title: string; meta: string; color: string }) => (
  <div 
    className={`bg-[#111] p-3.5 rounded-lg border-l-[3px] ${color} opacity-0`}
    style={{ animation: `heroSlideIn 0.5s ease-out forwards ${delay}` }}
  >
    <div className="font-bold text-white/80 text-xs mb-1 tracking-wide">{title}</div>
    <div className="text-[10px] text-white/30 font-mono tracking-wider">{meta}</div>
  </div>
);