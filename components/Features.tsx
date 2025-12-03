import React from 'react';
import { Bot, Users, FileCheck } from 'lucide-react';
import { FeatureProps } from '../types';

export const Features: React.FC = () => {
  return (
    <section className="py-24 bg-charcoal overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
            <FeatureStrip 
                title="The AI Engine"
                description="Upload PDF. We auto-tag Cast, Props, Vehicles, and Locations. You just verify. It learns SA formatting quirks that US software misses."
                icon={<Bot className="w-6 h-6 text-black" />}
                align="left"
                imageSrc="https://picsum.photos/id/2/800/600"
                accent="neon"
            />
            <FeatureStrip 
                title="Unlimited Team Access"
                description="Invite your HODs, ADs, and department heads — no extra seats, no paywalls. Other tools charge per user. We don't. Your whole crew gets access, included."
                icon={<Users className="w-6 h-6 text-black" />}
                align="right"
                imageSrc="https://picsum.photos/id/532/800/600"
                accent="cyan"
                badge="$0/seat"
            />
            <FeatureStrip 
                title="No Per-Seat Pricing"
                description="Other tools charge $50/user/month. Your props master just wants to see the breakdown — not take out a loan. We believe your whole team should have access. Period."
                icon={<FileCheck className="w-6 h-6 text-black" />}
                align="left"
                imageSrc="https://picsum.photos/id/358/800/600"
                accent="neon"
                badge="Community First"
            />
        </div>
    </section>
  );
};

interface ExtendedFeatureProps extends FeatureProps {
    accent: 'neon' | 'cyan';
    badge?: string;
}

const FeatureStrip: React.FC<Omit<ExtendedFeatureProps, 'icon'> & { icon: React.ReactNode }> = ({ 
    title, description, icon, align, imageSrc, accent, badge 
}) => {
    const isLeft = align === 'left';
    const accentColor = accent === 'neon' ? 'bg-neon' : 'bg-cyan';
    const textColor = accent === 'neon' ? 'text-neon' : 'text-cyan';

    return (
        <div className={`flex flex-col lg:flex-row items-center gap-12 ${isLeft ? '' : 'lg:flex-row-reverse'}`}>
            <div className="flex-1 space-y-6">
                <div className="flex items-center gap-4">
                    <div className={`inline-flex items-center justify-center p-3 rounded-xl ${accentColor}`}>
                        {icon}
                    </div>
                    {badge && (
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${accent === 'cyan' ? 'bg-cyan/10 text-cyan border-cyan/30' : 'bg-neon/10 text-neon border-neon/30'}`}>
                            {badge}
                        </span>
                    )}
                </div>
                <h3 className="text-3xl md:text-4xl font-display font-bold text-white">
                    {title}
                </h3>
                <p className="text-lg text-white/60 leading-relaxed">
                    {description}
                </p>
                <div className={`h-1 w-20 ${accentColor}`}></div>
            </div>
            
            <div className="flex-1 w-full">
                <div className="relative group">
                    <div className={`absolute -inset-2 ${accentColor} opacity-20 blur-lg group-hover:opacity-40 transition-opacity duration-500`}></div>
                    <div className="relative aspect-video rounded-lg overflow-hidden border border-white/10 bg-[#1a1a1a]">
                        <img 
                            src={imageSrc} 
                            alt={title} 
                            className="w-full h-full object-cover filter grayscale hover:grayscale-0 transition-all duration-700"
                        />
                        {/* UI Overlay simulation */}
                        <div className="absolute bottom-4 left-4 right-4 bg-black/80 backdrop-blur p-3 rounded border border-white/10 flex items-center justify-between">
                            <div className="flex space-x-2">
                                <div className="h-2 w-12 bg-white/20 rounded"></div>
                                <div className="h-2 w-8 bg-white/20 rounded"></div>
                            </div>
                            <div className={`text-xs font-bold ${textColor} uppercase tracking-wider`}>Processing...</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}