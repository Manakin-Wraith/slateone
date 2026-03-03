import React from 'react';
import { Quote } from 'lucide-react';

export const Founder: React.FC = () => {
  return (
    <section className="py-24 bg-[#0a0a0a] border-y border-white/5">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <Quote className="w-12 h-12 text-white/10 mx-auto mb-8" />
        
        <h3 className="text-2xl md:text-3xl font-display font-medium text-white mb-8 leading-relaxed">
          "<span className="text-neon border-b border-neon/30 pb-1">SlateOne</span>  isn’t a breakdown tool. It’s the operating system for modern film production."
        </h3>

        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="w-16 h-16 rounded-full border-2 border-white/10 mb-2 overflow-hidden">
             <img 
               src="/profile_pic.png" 
               alt="The Founder" 
               className="w-full h-full object-cover"
             />
          </div>
          <div className="font-mono text-neon tracking-widest uppercase">The Founder</div>
          <div className="text-sm text-white/40">Director / Producer</div>
        </div>
      </div>
    </section>
  );
};