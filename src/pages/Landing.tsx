
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plane, Shield, Users, Calendar, Wrench, BarChart3, Phone, MapPin, Star, CheckCircle, ArrowRight, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Landing() {
  const [language, setLanguage] = useState<'it' | 'en'>('it');

  const content = {
    it: {
      nav: {
        features: 'Funzionalità',
        pricing: 'Prezzi',
        about: 'Chi Siamo',
        login: 'Accedi',
        signup: 'Registrati'
      },
      hero: {
        title: 'AlidaSoft - La Suite Completa per la Gestione dell\'Aviazione',
        subtitle: 'Software professionale per operatori di volo, compagnie aeree e servizi charter. Gestisci flotte, equipaggi, manutenzione e operazioni in un\'unica piattaforma.',
        cta: 'Inizia Prova Gratuita',
        demo: 'Richiedi Demo'
      },
      features: {
        title: 'Moduli Integrati per Ogni Esigenza',
        subtitle: 'Una suite completa di strumenti specializzati per l\'aviazione commerciale',
        schedule: {
          title: 'Pianificazione Voli',
          desc: 'Gestione completa dei programmi di volo con ottimizzazione automatica'
        },
        sales: {
          title: 'Vendite e Quotazioni',
          desc: 'Sistema CRM integrato per gestire clienti e preventivi'
        },
        ops: {
          title: 'Operazioni di Volo',
          desc: 'Controllo operativo in tempo reale con notifiche automatiche'
        },
        aircraft: {
          title: 'Gestione Flotta',
          desc: 'Monitoraggio completo degli aeromobili e documenti'
        },
        crew: {
          title: 'Gestione Equipaggi',
          desc: 'Pianificazione turni e controllo limiti di volo (FTL)'
        },
        maintenance: {
          title: 'Manutenzione',
          desc: 'Tracciamento manutenzioni e scadenze certificate'
        },
        reports: {
          title: 'Report e Analytics',
          desc: 'Dashboard e report personalizzati per il business'
        },
        phonebook: {
          title: 'Rubrica Aeroportuale',
          desc: 'Database completo di aeroporti e servizi di handling'
        }
      },
      benefits: {
        title: 'Perché Scegliere AlidaSoft',
        compliance: {
          title: 'Conformità EASA/ENAC',
          desc: 'Rispetta tutti i regolamenti europei per l\'aviazione civile'
        },
        realtime: {
          title: 'Tempo Reale',
          desc: 'Sincronizzazione istantanea tra tutti i moduli e utenti'
        },
        cloud: {
          title: 'Cloud Sicuro',
          desc: 'Infrastruttura sicura con backup automatici e alta disponibilità'
        }
      },
      testimonials: {
        title: 'Cosa Dicono i Nostri Clienti',
        testimonial1: {
          text: 'AlidaSoft ha rivoluzionato la nostra gestione operativa. Risparmio di tempo incredibile.',
          author: 'Marco Rossi',
          role: 'Operations Manager - SkyItaly Charter'
        },
        testimonial2: {
          text: 'La conformità FTL automatica ci ha evitato molti problemi normativi.',
          author: 'Laura Bianchi',
          role: 'Chief Pilot - Mediterranean Air'
        }
      },
      cta: {
        title: 'Pronto a Decollare?',
        subtitle: 'Inizia oggi la tua prova gratuita di 30 giorni',
        button: 'Inizia Subito'
      }
    },
    en: {
      nav: {
        features: 'Features',
        pricing: 'Pricing',
        about: 'About',
        login: 'Login',
        signup: 'Sign Up'
      },
      hero: {
        title: 'AlidaSoft - Complete Aviation Management Suite',
        subtitle: 'Professional software for flight operators, airlines and charter services. Manage fleets, crews, maintenance and operations in one platform.',
        cta: 'Start Free Trial',
        demo: 'Request Demo'
      },
      features: {
        title: 'Integrated Modules for Every Need',
        subtitle: 'A complete suite of specialized tools for commercial aviation',
        schedule: {
          title: 'Flight Scheduling',
          desc: 'Complete flight program management with automatic optimization'
        },
        sales: {
          title: 'Sales & Quotes',
          desc: 'Integrated CRM system to manage clients and quotations'
        },
        ops: {
          title: 'Flight Operations',
          desc: 'Real-time operational control with automatic notifications'
        },
        aircraft: {
          title: 'Fleet Management',
          desc: 'Complete aircraft monitoring and document management'
        },
        crew: {
          title: 'Crew Management',
          desc: 'Shift planning and flight time limitations (FTL) control'
        },
        maintenance: {
          title: 'Maintenance',
          desc: 'Maintenance tracking and certificate expiration management'
        },
        reports: {
          title: 'Reports & Analytics',
          desc: 'Custom dashboards and business reports'
        },
        phonebook: {
          title: 'Airport Directory',
          desc: 'Complete database of airports and handling services'
        }
      },
      benefits: {
        title: 'Why Choose AlidaSoft',
        compliance: {
          title: 'EASA/ENAC Compliance',
          desc: 'Meets all European civil aviation regulations'
        },
        realtime: {
          title: 'Real-Time',
          desc: 'Instant synchronization between all modules and users'
        },
        cloud: {
          title: 'Secure Cloud',
          desc: 'Secure infrastructure with automatic backups and high availability'
        }
      },
      testimonials: {
        title: 'What Our Customers Say',
        testimonial1: {
          text: 'AlidaSoft has revolutionized our operational management. Incredible time savings.',
          author: 'Marco Rossi',
          role: 'Operations Manager - SkyItaly Charter'
        },
        testimonial2: {
          text: 'Automatic FTL compliance has saved us from many regulatory issues.',
          author: 'Laura Bianchi',
          role: 'Chief Pilot - Mediterranean Air'
        }
      },
      cta: {
        title: 'Ready to Take Off?',
        subtitle: 'Start your 30-day free trial today',
        button: 'Get Started'
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
              <Plane className="w-8 h-8 text-blue-600 mr-2" />
              <span className="text-2xl font-bold text-gray-900">AlidaSoft</span>
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

      {/* Hero Section */}
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

      {/* Features Section */}
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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
                <BarChart3 className="w-8 h-8 text-green-600 mb-2" />
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
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t.benefits.title}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t.benefits.compliance.title}</h3>
              <p className="text-gray-600">{t.benefits.compliance.desc}</p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t.benefits.realtime.title}</h3>
              <p className="text-gray-600">{t.benefits.realtime.desc}</p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t.benefits.cloud.title}</h3>
              <p className="text-gray-600">{t.benefits.cloud.desc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t.testimonials.title}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center">
                    <Star className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-gray-600 mb-4">"{t.testimonials.testimonial1.text}"</p>
                    <div>
                      <p className="font-semibold">{t.testimonials.testimonial1.author}</p>
                      <p className="text-sm text-gray-500">{t.testimonials.testimonial1.role}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center">
                    <Star className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-gray-600 mb-4">"{t.testimonials.testimonial2.text}"</p>
                    <div>
                      <p className="font-semibold">{t.testimonials.testimonial2.author}</p>
                      <p className="text-sm text-gray-500">{t.testimonials.testimonial2.role}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
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

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Plane className="w-6 h-6 text-blue-400 mr-2" />
                <span className="text-xl font-bold">AlidaSoft</span>
              </div>
              <p className="text-gray-400">
                Software professionale per l'aviazione commerciale
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Prodotto</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className="hover:text-white transition-colors">Funzionalità</a></li>
                <li><Link to="/pricing" className="hover:text-white transition-colors">Prezzi</Link></li>
                <li><a href="#" className="hover:text-white transition-colors">Demo</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Azienda</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/about" className="hover:text-white transition-colors">Chi Siamo</Link></li>
                <li><a href="#" className="hover:text-white transition-colors">Contatti</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Supporto</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Contatti</h4>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  Italia
                </li>
                <li className="flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  +39 393 337 4430
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 AlidaSoft. Tutti i diritti riservati.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
