
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface LandingCTAProps {
  t: any;
}

export function LandingCTA({ t }: LandingCTAProps) {
  return (
    <section className="py-20 bg-blue-600 text-white">
      <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          {t.cta.title}
        </h2>
        <p className="text-xl mb-8 opacity-90">
          {t.cta.subtitle}
        </p>
        <Link to="/auth">
          <Button size="lg" variant="secondary" className="flex items-center space-x-2">
            <span>{t.cta.button}</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    </section>
  );
}
