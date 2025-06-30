
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, X, ArrowLeft, Globe, Plane } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Pricing() {
  const [language, setLanguage] = useState<'it' | 'en'>('it');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const content = {
    it: {
      title: 'Prezzi Semplici e Trasparenti',
      subtitle: 'Scegli il piano perfetto per la tua operazione aerea',
      monthly: 'Mensile',
      yearly: 'Annuale',
      yearlyDiscount: 'Risparmia 20%',
      getStarted: 'Inizia Ora',
      mostPopular: 'Più Popolare',
      contactUs: 'Contattaci',
      features: 'Funzionalità incluse',
      plans: {
        starter: {
          name: 'Starter',
          desc: 'Perfetto per piccole operazioni charter',
          monthlyPrice: '299',
          yearlyPrice: '239',
          features: [
            'Fino a 2 aeromobili',
            'Gestione voli base',
            'Equipaggio (max 10)',
            'Supporto email',
            'Dashboard base'
          ],
          notIncluded: [
            'Manutenzione avanzata',
            'Report personalizzati',
            'Integrazione API'
          ]
        },
        professional: {
          name: 'Professional',
          desc: 'Ideale per operatori di medie dimensioni',
          monthlyPrice: '599',
          yearlyPrice: '479',
          features: [
            'Fino a 10 aeromobili',
            'Tutti i moduli inclusi',
            'Equipaggio illimitato',
            'Supporto prioritario',
            'Report avanzati',
            'Conformità FTL completa',
            'Integrazione API',
            'Backup automatici'
          ],
          notIncluded: [
            'Personalizzazioni avanzate',
            'Supporto dedicato'
          ]
        },
        enterprise: {
          name: 'Enterprise',
          desc: 'Per grandi flotte e operazioni complesse',
          price: 'Personalizzato',
          features: [
            'Aeromobili illimitati',
            'Tutti i moduli premium',
            'Personalizzazioni complete',
            'Supporto dedicato 24/7',
            'Training on-site',
            'Integrazione sistemi esistenti',
            'SLA garantito',
            'Implementazione assistita'
          ]
        }
      }
    },
    en: {
      title: 'Simple and Transparent Pricing',
      subtitle: 'Choose the perfect plan for your aviation operation',
      monthly: 'Monthly',
      yearly: 'Yearly',
      yearlyDiscount: 'Save 20%',
      getStarted: 'Get Started',
      mostPopular: 'Most Popular',
      contactUs: 'Contact Us',
      features: 'Included features',
      plans: {
        starter: {
          name: 'Starter',
          desc: 'Perfect for small charter operations',
          monthlyPrice: '299',
          yearlyPrice: '239',
          features: [
            'Up to 2 aircraft',
            'Basic flight management',
            'Crew management (max 10)',
            'Email support',
            'Basic dashboard'
          ],
          notIncluded: [
            'Advanced maintenance',
            'Custom reports',
            'API integration'
          ]
        },
        professional: {
          name: 'Professional',
          desc: 'Ideal for medium-sized operators',
          monthlyPrice: '599',
          yearlyPrice: '479',
          features: [
            'Up to 10 aircraft',
            'All modules included',
            'Unlimited crew',
            'Priority support',
            'Advanced reports',
            'Complete FTL compliance',
            'API integration',
            'Automatic backups'
          ],
          notIncluded: [
            'Advanced customizations',
            'Dedicated support'
          ]
        },
        enterprise: {
          name: 'Enterprise',
          desc: 'For large fleets and complex operations',
          price: 'Custom',
          features: [
            'Unlimited aircraft',
            'All premium modules',
            'Complete customizations',
            '24/7 dedicated support',
            'On-site training',
            'Existing systems integration',
            'Guaranteed SLA',
            'Assisted implementation'
          ]
        }
      }
    }
  };

  const t = content[language];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center hover:opacity-80 transition-opacity">
                <ArrowLeft className="w-5 h-5 mr-2 text-gray-600" />
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center mr-2">
                  <Plane className="w-5 h-5 text-white transform rotate-45" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  WeFly
                </span>
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
                <Button>{language === 'it' ? 'Accedi' : 'Login'}</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {t.title}
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              {t.subtitle}
            </p>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center space-x-4 mb-8">
              <span className={billingCycle === 'monthly' ? 'font-semibold' : 'text-gray-500'}>
                {t.monthly}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                className="relative"
              >
                <div className={`w-12 h-6 rounded-full transition-colors ${
                  billingCycle === 'yearly' ? 'bg-blue-600' : 'bg-gray-300'
                }`}>
                  <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${
                    billingCycle === 'yearly' ? 'translate-x-7' : 'translate-x-1'
                  } top-1 absolute`} />
                </div>
              </Button>
              <span className={billingCycle === 'yearly' ? 'font-semibold' : 'text-gray-500'}>
                {t.yearly}
              </span>
              {billingCycle === 'yearly' && (
                <Badge variant="secondary" className="ml-2">
                  {t.yearlyDiscount}
                </Badge>
              )}
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Starter Plan */}
            <Card className="relative">
              <CardHeader>
                <CardTitle className="text-2xl">{t.plans.starter.name}</CardTitle>
                <CardDescription>{t.plans.starter.desc}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">
                    €{billingCycle === 'monthly' ? t.plans.starter.monthlyPrice : t.plans.starter.yearlyPrice}
                  </span>
                  <span className="text-gray-500 ml-2">
                    /{language === 'it' ? 'mese' : 'month'}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <Button className="w-full mb-6">
                  {t.getStarted}
                </Button>
                
                <div className="space-y-4">
                  <h4 className="font-semibold">{t.features}:</h4>
                  <ul className="space-y-2">
                    {t.plans.starter.features.map((feature, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                    {t.plans.starter.notIncluded.map((feature, index) => (
                      <li key={index} className="flex items-center space-x-2 text-gray-400">
                        <X className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Professional Plan */}
            <Card className="relative border-2 border-blue-500 shadow-lg">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-blue-500 text-white">
                  {t.mostPopular}
                </Badge>
              </div>
              <CardHeader>
                <CardTitle className="text-2xl">{t.plans.professional.name}</CardTitle>
                <CardDescription>{t.plans.professional.desc}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">
                    €{billingCycle === 'monthly' ? t.plans.professional.monthlyPrice : t.plans.professional.yearlyPrice}
                  </span>
                  <span className="text-gray-500 ml-2">
                    /{language === 'it' ? 'mese' : 'month'}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <Button className="w-full mb-6">
                  {t.getStarted}
                </Button>
                
                <div className="space-y-4">
                  <h4 className="font-semibold">{t.features}:</h4>
                  <ul className="space-y-2">
                    {t.plans.professional.features.map((feature, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                    {t.plans.professional.notIncluded.map((feature, index) => (
                      <li key={index} className="flex items-center space-x-2 text-gray-400">
                        <X className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Enterprise Plan */}
            <Card className="relative">
              <CardHeader>
                <CardTitle className="text-2xl">{t.plans.enterprise.name}</CardTitle>
                <CardDescription>{t.plans.enterprise.desc}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">
                    {t.plans.enterprise.price}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full mb-6">
                  {t.contactUs}
                </Button>
                
                <div className="space-y-4">
                  <h4 className="font-semibold">{t.features}:</h4>
                  <ul className="space-y-2">
                    {t.plans.enterprise.features.map((feature, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* FAQ Section */}
          <div className="mt-20 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              {language === 'it' ? 'Domande Frequenti' : 'Frequently Asked Questions'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="text-left">
                <h3 className="font-semibold mb-2">
                  {language === 'it' ? 'Posso cambiare piano in qualsiasi momento?' : 'Can I change plans anytime?'}
                </h3>
                <p className="text-gray-600 text-sm">
                  {language === 'it' 
                    ? 'Sì, puoi aggiornare o ridurre il tuo piano in qualsiasi momento. Le modifiche avranno effetto dal ciclo di fatturazione successivo.'
                    : 'Yes, you can upgrade or downgrade your plan at any time. Changes will take effect from the next billing cycle.'
                  }
                </p>
              </div>
              <div className="text-left">
                <h3 className="font-semibold mb-2">
                  {language === 'it' ? 'È disponibile una prova gratuita?' : 'Is there a free trial?'}
                </h3>
                <p className="text-gray-600 text-sm">
                  {language === 'it' 
                    ? 'Sì, offriamo una prova gratuita di 30 giorni per tutti i piani. Nessuna carta di credito richiesta.'
                    : 'Yes, we offer a 30-day free trial for all plans. No credit card required.'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
