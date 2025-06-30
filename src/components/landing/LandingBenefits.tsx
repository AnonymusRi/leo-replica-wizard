
import { CheckCircle, Clock, Cloud, Settings } from 'lucide-react';

interface LandingBenefitsProps {
  t: any;
}

export function LandingBenefits({ t }: LandingBenefitsProps) {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t.benefits.title}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">{t.benefits.compliance.title}</h3>
            <p className="text-gray-600">{t.benefits.compliance.desc}</p>
          </div>

          <div className="text-center">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">{t.benefits.realtime.title}</h3>
            <p className="text-gray-600">{t.benefits.realtime.desc}</p>
          </div>

          <div className="text-center">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Cloud className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">{t.benefits.cloud.title}</h3>
            <p className="text-gray-600">{t.benefits.cloud.desc}</p>
          </div>

          <div className="text-center">
            <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Settings className="w-8 h-8 text-orange-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">{t.benefits.integration.title}</h3>
            <p className="text-gray-600">{t.benefits.integration.desc}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
