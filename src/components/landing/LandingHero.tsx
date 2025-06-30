
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface LandingHeroProps {
  t: any;
}

export function LandingHero({ t }: LandingHeroProps) {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto text-center">
        <Badge className="mb-4" variant="secondary">
          Software per l'Aviazione Commerciale
        </Badge>
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
          {t.hero.title}
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          {t.hero.subtitle}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/auth">
            <Button size="lg" className="flex items-center space-x-2">
              <span>{t.hero.cta}</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Button size="lg" variant="outline">
            {t.hero.demo}
          </Button>
        </div>
      </div>
    </section>
  );
}
