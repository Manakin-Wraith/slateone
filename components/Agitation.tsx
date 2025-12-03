import React from 'react';
import { Clock, AlertTriangle, Wallet } from 'lucide-react';

export const Agitation: React.FC = () => {
  return (
    <section className="py-24 bg-slate-black relative border-b border-white/5 overflow-hidden">
      {/* Background noise/grid */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center mb-20">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-6">
            It’s Sunday night. <br/>
            The director just sent a <span className="text-red-400 bg-red-500/10 px-3 py-1 border border-red-500/30 rounded inline-block transform -rotate-1 shadow-[0_0_15px_rgba(239,68,68,0.2)]">Revised White</span> draft.
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto leading-relaxed">
            Do you really want to re-type your Excel sheet manually? Again?
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          <EnhancedCard 
            icon={<Clock className="w-8 h-8 text-amber-400" />}
            title="The Time Sink"
            desc="Stop losing 12+ hours to data entry. You didn't go to film school to copy-paste into spreadsheets."
            badge="-12 Hours"
            badgeColor="bg-amber-500/10 text-amber-400 border-amber-500/20"
            borderColor="group-hover:border-amber-500/50"
            glowColor="group-hover:shadow-[0_0_30px_-5px_rgba(251,191,36,0.15)]"
            animation="group-hover:rotate-180 transition-transform duration-700 ease-in-out"
          />
          <EnhancedCard 
            icon={<AlertTriangle className="w-8 h-8 text-red-500" />}
            title="The Human Error"
            desc="Missed a prop in the breakdown? You miss it on set. Manual errors cost production thousands."
            badge="Risk: High"
            badgeColor="bg-red-500/10 text-red-500 border-red-500/20"
            borderColor="group-hover:border-red-500/50"
            glowColor="group-hover:shadow-[0_0_30px_-5px_rgba(239,68,68,0.15)]"
            animation="group-hover:animate-pulse"
          />
          <EnhancedCard 
            icon={<Wallet className="w-8 h-8 text-cyan" />}
            title="The Budget Cap"
            desc="Can't afford Movie Magic? We price in Rands, not Dollars. Built for the local economy."
            badge="ZAR vs USD"
            badgeColor="bg-cyan/10 text-cyan border-cyan/20"
            borderColor="group-hover:border-cyan/50"
            glowColor="group-hover:shadow-[0_0_30px_-5px_rgba(0,255,255,0.15)]"
            animation="group-hover:scale-110 transition-transform duration-300"
          />
        </div>

        {/* Visual of the "Old Way" */}
        <div className="mt-20 relative rounded-xl overflow-hidden border border-white/10 group">
            <div className="absolute inset-0 bg-black/70 group-hover:bg-black/50 transition-colors duration-500 z-10 flex flex-col items-center justify-center space-y-4">
                <span className="bg-red-500 text-white px-6 py-2 font-bold transform -rotate-2 uppercase tracking-widest border-2 border-white shadow-xl">
                    The Old Way
                </span>
                <p className="text-white/60 text-sm font-mono opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                   System Overload // Manual Entry Detected
                </p>
            </div>
            <img 
                src="https://picsum.photos/id/447/1200/400" 
                alt="Messy desk with scripts" 
                className="w-full h-72 object-cover filter grayscale sepia-[0.5] contrast-125 opacity-40 scale-105 group-hover:scale-100 transition-transform duration-1000"
            />
        </div>

      </div>
    </section>
  );
};

interface CardProps { 
    icon: React.ReactNode; 
    title: string; 
    desc: string; 
    badge: string;
    badgeColor: string;
    borderColor: string;
    glowColor: string;
    animation: string;
}

const EnhancedCard: React.FC<CardProps> = ({ icon, title, desc, badge, badgeColor, borderColor, glowColor, animation }) => (
  <div className={`
    bg-[#151515] p-8 rounded-2xl border border-white/5 
    relative group overflow-hidden transition-all duration-300
    ${borderColor} ${glowColor}
  `}>
    
    {/* Texture: Dot Grid */}
    <div className="absolute inset-0 opacity-[0.07] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] transition-opacity duration-500 group-hover:opacity-[0.15] pointer-events-none z-0" />
    
    {/* Texture: Noise */}
    <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay pointer-events-none z-0" />

    {/* Gradient Overlay on Hover */}
    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10" />

    {/* Header Section */}
    <div className="flex justify-between items-start mb-6 relative z-20">
        <div className={`p-3 bg-[#0a0a0a] border border-white/10 rounded-xl ${animation} relative overflow-hidden`}>
            {/* Inner gloss for icon box */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-50"></div>
            <div className="relative z-10">{icon}</div>
        </div>
        <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border backdrop-blur-sm ${badgeColor}`}>
            {badge}
        </div>
    </div>

    {/* Content */}
    <div className="relative z-20">
        <h3 className="text-xl font-bold text-white mb-3 font-display group-hover:text-white transition-colors">
            {title}
        </h3>
        <p className="text-white/50 leading-relaxed group-hover:text-white/70 transition-colors">
            {desc}
        </p>
    </div>
  </div>
);