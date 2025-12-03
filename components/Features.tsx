import React from 'react';
import { Bot, CloudLightning, FileCheck } from 'lucide-react';
import { FeatureProps } from '../types';

export const Features: React.FC = () => {
  return (
    <section className="py-24 bg-charcoal overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
            <FeatureStrip 
                title="The AI Engine"
                description="Upload PDF or FDX. We auto-tag Cast, Props, Vehicles, and Locations. You just verify. It learns SA formatting quirks that US software misses."
                icon={<Bot className="w-6 h-6 text-black" />}
                align="left"
                imageSrc="https://picsum.photos/id/2/800/600"
                accent="neon"
            />
            <FeatureStrip 
                title="Load Shedding Proof"
                description="We are cloud-native. Your work auto-saves every keystroke. Power cuts won't kill your schedule. Access your breakdown from your phone on the scout."
                icon={<CloudLightning className="w-6 h-6 text-black" />}
                align="right"
                imageSrc="https://picsum.photos/id/532/800/600"
                accent="cyan"
            />
            <FeatureStrip 
                title="International Standard"
                description="Service work ready. Export PDFs that look identical to US industry standards. The bond company won't know the difference, but your budget will."
                icon={<FileCheck className="w-6 h-6 text-black" />}
                align="left"
                imageSrc="https://picsum.photos/id/358/800/600"
                accent="neon"
            />
        </div>
    </section>
  );
};

interface ExtendedFeatureProps extends FeatureProps {
    accent: 'neon' | 'cyan';
}

const FeatureStrip: React.FC<Omit<ExtendedFeatureProps, 'icon'> & { icon: React.ReactNode }> = ({ 
    title, description, icon, align, imageSrc, accent 
}) => {
    const isLeft = align === 'left';
    const accentColor = accent === 'neon' ? 'bg-neon' : 'bg-cyan';
    const textColor = accent === 'neon' ? 'text-neon' : 'text-cyan';

    return (
        <div className={`flex flex-col lg:flex-row items-center gap-12 ${isLeft ? '' : 'lg:flex-row-reverse'}`}>
            <div className="flex-1 space-y-6">
                <div className={`inline-flex items-center justify-center p-3 rounded-xl ${accentColor}`}>
                    {icon}
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