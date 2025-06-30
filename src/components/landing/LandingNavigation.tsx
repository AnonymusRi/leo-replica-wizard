
import { Button } from '@/components/ui/button';
import { Plane, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

interface LandingNavigationProps {
  t: any;
  language: 'it' | 'en';
  setLanguage: (lang: 'it' | 'en') => void;
}

export function LandingNavigation({ t, language, setLanguage }: LandingNavigationProps) {
  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center mr-3">
                <Plane className="w-6 h-6 text-white transform rotate-45" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                WeFly
              </span>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-700 hover:text-blue-600 transition-colors">
              {t.nav.features}
            </a>
            <Link to="/pricing" className="text-gray-700 hover:text-blue-600 transition-colors">
              {t.nav.pricing}
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-blue-600 transition-colors">
              {t.nav.about}
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLanguage(language === 'it' ? 'en' : 'it')}
              className="flex items-center space-x-1"
            >
              <Globe className="w-4 h-4" />
              <span>{language === 'it' ? 'EN' : 'IT'}</span>
            </Button>
            
            <Link to="/auth">
              <Button variant="ghost">{t.nav.login}</Button>
            </Link>
            <Link to="/auth">
              <Button>{t.nav.signup}</Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
