
import { useState } from 'react';
import { landingContent } from '../components/landing/landingContent';
import { LandingNavigation } from '../components/landing/LandingNavigation';
import { LandingHero } from '../components/landing/LandingHero';
import { LandingFeatures } from '../components/landing/LandingFeatures';
import { LandingBenefits } from '../components/landing/LandingBenefits';
import { LandingTestimonials } from '../components/landing/LandingTestimonials';
import { LandingCTA } from '../components/landing/LandingCTA';
import { LandingAdminAccess } from '../components/landing/LandingAdminAccess';
import { LandingFooter } from '../components/landing/LandingFooter';

export default function Landing() {
  const [language, setLanguage] = useState<'it' | 'en'>('it');
  const t = landingContent[language];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <LandingNavigation t={t} language={language} setLanguage={setLanguage} />
      <LandingHero t={t} />
      <LandingFeatures t={t} />
      <LandingBenefits t={t} />
      <LandingTestimonials t={t} />
      <LandingCTA t={t} />
      <LandingAdminAccess t={t} />
      <LandingFooter />
    </div>
  );
}
