
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, CreditCard, Shield, Plane, Users, Wrench, BarChart3, Phone, FileText, AlertTriangle } from 'lucide-react';

interface LandingFeaturesProps {
  t: any;
}

export function LandingFeatures({ t }: LandingFeaturesProps) {
  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t.features.title}
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t.features.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Calendar className="w-8 h-8 text-blue-600 mb-2" />
              <CardTitle className="text-lg">{t.features.schedule.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>{t.features.schedule.desc}</CardDescription>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CreditCard className="w-8 h-8 text-green-600 mb-2" />
              <CardTitle className="text-lg">{t.features.sales.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>{t.features.sales.desc}</CardDescription>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Shield className="w-8 h-8 text-red-600 mb-2" />
              <CardTitle className="text-lg">{t.features.ops.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>{t.features.ops.desc}</CardDescription>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Plane className="w-8 h-8 text-purple-600 mb-2" />
              <CardTitle className="text-lg">{t.features.aircraft.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>{t.features.aircraft.desc}</CardDescription>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Users className="w-8 h-8 text-indigo-600 mb-2" />
              <CardTitle className="text-lg">{t.features.crew.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>{t.features.crew.desc}</CardDescription>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Wrench className="w-8 h-8 text-orange-600 mb-2" />
              <CardTitle className="text-lg">{t.features.maintenance.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>{t.features.maintenance.desc}</CardDescription>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <BarChart3 className="w-8 h-8 text-teal-600 mb-2" />
              <CardTitle className="text-lg">{t.features.reports.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>{t.features.reports.desc}</CardDescription>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Phone className="w-8 h-8 text-pink-600 mb-2" />
              <CardTitle className="text-lg">{t.features.phonebook.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>{t.features.phonebook.desc}</CardDescription>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <FileText className="w-8 h-8 text-cyan-600 mb-2" />
              <CardTitle className="text-lg">{t.features.documents.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>{t.features.documents.desc}</CardDescription>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <AlertTriangle className="w-8 h-8 text-yellow-600 mb-2" />
              <CardTitle className="text-lg">{t.features.compliance.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>{t.features.compliance.desc}</CardDescription>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <BarChart3 className="w-8 h-8 text-emerald-600 mb-2" />
              <CardTitle className="text-lg">{t.features.finance.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>{t.features.finance.desc}</CardDescription>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Phone className="w-8 h-8 text-violet-600 mb-2" />
              <CardTitle className="text-lg">{t.features.mobile.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>{t.features.mobile.desc}</CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
