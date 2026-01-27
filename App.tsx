import React, { useState } from 'react';
import { Hero } from './components/Hero';
import { HowItWorks } from './components/HowItWorks';
import { SeeItInAction } from './components/SeeItInAction';
import { Agitation } from './components/Agitation';
import { Features } from './components/Features';
import { Founder } from './components/Founder';
import { Footer } from './components/Footer';
import { Survey } from './components/Survey';
import { PrivacyPolicy } from './components/PrivacyPolicy';
import { TermsOfService } from './components/TermsOfService';
import { AppState } from './types';
import { Film } from 'lucide-react';
import { addToWaitlist } from './lib/supabase';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.LANDING);
  const [userEmail, setUserEmail] = useState<string>('');

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEmailSubmit = async (email: string) => {
    setIsSubmitting(true);
    
    const result = await addToWaitlist(email, 'landing_page');
    
    if (result.success) {
      setUserEmail(email);
      window.scrollTo(0, 0);
      setAppState(AppState.THANK_YOU);
    } else if (result.error === 'already_registered') {
      // Still show thank you - they're already on the list
      setUserEmail(email);
      window.scrollTo(0, 0);
      setAppState(AppState.THANK_YOU);
    } else {
      console.error('Waitlist signup error:', result.error);
      alert(`Something went wrong. Please try again. Error: ${result.error}`);
    }
    
    setIsSubmitting(false);
  };

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
      {/* Navigation / Header */}
      <nav className="fixed top-0 w-full z-50 bg-charcoal/90 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div 
              className="flex items-center cursor-pointer group" 
              onClick={handleLogoClick}
            >
              <Film className="h-6 w-6 text-neon mr-2 group-hover:rotate-180 transition-transform duration-500" />
              <span className="font-display font-bold text-xl tracking-tight text-white">
                Slate<span className="text-neon">One</span>
              </span>
            </div>
            <div className="flex items-center gap-4">
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
            <HowItWorks onSignup={handleEmailSubmit} />
            <SeeItInAction />
            <Agitation />
            <Features />
            <Founder />
            <Footer />
          </>
        ) : appState === AppState.PRIVACY_POLICY ? (
          <PrivacyPolicy onBack={handleBackToHome} />
        ) : appState === AppState.TERMS_OF_SERVICE ? (
          <TermsOfService onBack={handleBackToHome} />
        ) : (
          <Survey email={userEmail} />
        )}
      </main>

      <div className="bg-black text-white/30 text-xs py-4 text-center border-t border-white/5">
        <p>&copy; {new Date().getFullYear()} SlateOne. Built for the SA Film Industry.</p>
        <div className="mt-2 space-x-4">
          <button 
            onClick={handlePrivacyPolicyClick}
            className="hover:text-white transition-colors"
          >
            Privacy Policy
          </button>
          <button 
            onClick={handleTermsOfServiceClick}
            className="hover:text-white transition-colors"
          >
            Terms of Service
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;