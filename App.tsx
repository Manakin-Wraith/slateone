import React, { useState } from 'react';
import { Hero } from './components/Hero';
import { IndustryReality } from './components/IndustryReality';
import { OperatingLayer } from './components/OperatingLayer';
import { SystemArchitecture } from './components/SystemArchitecture';
import { BuiltFor } from './components/BuiltFor';
import { Pricing } from './components/Pricing';
import { Footer } from './components/Footer';
import { PrivacyPolicy } from './components/PrivacyPolicy';
import { TermsOfService } from './components/TermsOfService';
import { AppState } from './types';
import { Film } from 'lucide-react';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.LANDING);

  const handleLogoClick = () => {
    setAppState(AppState.LANDING);
    window.scrollTo(0, 0);
  };

  const handlePrivacyPolicyClick = () => {
    setAppState(AppState.PRIVACY_POLICY);
    window.scrollTo(0, 0);
  };

  const handleTermsOfServiceClick = () => {
    setAppState(AppState.TERMS_OF_SERVICE);
    window.scrollTo(0, 0);
  };

  const handleBackToHome = () => {
    setAppState(AppState.LANDING);
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-neon selection:text-black">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-charcoal/90 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div 
              className="flex items-center cursor-pointer group" 
              onClick={handleLogoClick}
            >
              <Film className="h-5 w-5 text-neon mr-2" />
              <span className="font-display font-bold text-xl tracking-tight text-white">
                Slate<span className="text-neon">One</span>
              </span>
            </div>
            <div className="flex items-center gap-4">
              <a 
                href="#pricing"
                onClick={(e) => { e.preventDefault(); document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' }); }}
                className="hidden sm:inline-block text-xs font-mono text-white/40 hover:text-neon transition-colors tracking-wider uppercase cursor-pointer"
              >
                Pricing
              </a>
              <a 
                href="https://app.slateone.studio/login?mode=login"
                className="text-sm font-medium bg-white/5 border border-white/10 px-4 py-2 rounded-lg text-white/70 hover:text-neon hover:border-neon/50 transition-all"
              >
                Login
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow pt-16">
        {appState === AppState.LANDING ? (
          <>
            <Hero />
            <IndustryReality />
            <OperatingLayer />
            <SystemArchitecture />
            <BuiltFor />
            <Pricing />
            <Footer />
          </>
        ) : appState === AppState.PRIVACY_POLICY ? (
          <PrivacyPolicy onBack={handleBackToHome} />
        ) : appState === AppState.TERMS_OF_SERVICE ? (
          <TermsOfService onBack={handleBackToHome} />
        ) : null}
      </main>

      {/* Legal footer bar */}
      <div className="bg-black text-white/20 text-xs py-4 text-center border-t border-white/5">
        <p>&copy; {new Date().getFullYear()} SlateOne. Production Infrastructure for Film & TV.</p>
        <div className="mt-2 space-x-4">
          <button 
            onClick={handlePrivacyPolicyClick}
            className="hover:text-white/50 transition-colors"
          >
            Privacy Policy
          </button>
          <button 
            onClick={handleTermsOfServiceClick}
            className="hover:text-white/50 transition-colors"
          >
            Terms of Service
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;