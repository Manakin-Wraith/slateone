import React, { useState } from 'react';
import { Hero } from './components/Hero';
import { IndustryReality } from './components/IndustryReality';
import { OperatingLayer } from './components/OperatingLayer';
import { BuiltFor } from './components/BuiltFor';
import { Pricing } from './components/Pricing';
import { Footer } from './components/Footer';
import { PrivacyPolicy } from './components/PrivacyPolicy';
import { TermsOfService } from './components/TermsOfService';
import { FAQ } from './components/FAQ';
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

  const handleFAQClick = () => {
    setAppState(AppState.FAQ);
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-amber-500 selection:text-slate-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div
              className="flex items-center cursor-pointer group"
              onClick={handleLogoClick}
            >
              <Film className="h-5 w-5 text-amber-500 mr-2" />
              <span className="font-bold text-xl tracking-tight text-slate-50">
                Slate<span className="text-amber-500">One</span>
              </span>
            </div>
            <div className="flex items-center gap-4">
              <a
                href="#pricing"
                onClick={(e) => { e.preventDefault(); document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' }); }}
                className="hidden sm:inline-block text-sm text-slate-400 hover:text-amber-500 transition-colors cursor-pointer"
              >
                Pricing
              </a>
              <a
                href="#faq"
                onClick={(e) => { e.preventDefault(); handleFAQClick(); }}
                className="hidden sm:inline-block text-sm text-slate-400 hover:text-amber-500 transition-colors cursor-pointer"
              >
                FAQ
              </a>
              <a
                href="https://app.slateone.studio/login?mode=login"
                className="text-sm font-medium bg-slate-800 border border-slate-700 px-4 py-2 rounded-lg text-slate-300 hover:text-amber-500 hover:border-amber-500/50 transition-all"
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
            <BuiltFor />
            <Pricing />
            <Footer />
          </>
        ) : appState === AppState.PRIVACY_POLICY ? (
          <PrivacyPolicy onBack={handleBackToHome} />
        ) : appState === AppState.TERMS_OF_SERVICE ? (
          <TermsOfService onBack={handleBackToHome} />
        ) : appState === AppState.FAQ ? (
          <FAQ onBack={handleBackToHome} />
        ) : null}
      </main>

      {/* Legal footer bar */}
      <div className="bg-slate-950 text-slate-600 text-xs py-4 text-center border-t border-slate-800">
        <p>&copy; {new Date().getFullYear()} SlateOne. Production Infrastructure for Film & TV.</p>
        <div className="mt-2 space-x-4">
          <button
            onClick={handlePrivacyPolicyClick}
            className="hover:text-slate-300 transition-colors"
          >
            Privacy Policy
          </button>
          <button
            onClick={handleTermsOfServiceClick}
            className="hover:text-slate-300 transition-colors"
          >
            Terms of Service
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;