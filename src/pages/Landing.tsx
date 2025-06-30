import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plane, Shield, Users, Calendar, Wrench, BarChart3, Phone, MapPin, Star, CheckCircle, ArrowRight, Globe, FileText, Clock, CreditCard, AlertTriangle, Settings, Database, Cloud, Lock, UserCog } from 'lucide-react';
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
        title: 'WeFly - La Suite Completa per la Gestione dell\'Aviazione',
        subtitle: 'Software professionale per operatori di volo, compagnie aeree e servizi charter. Gestisci flotte, equipaggi, manutenzione e operazioni in un\'unica piattaforma.',
        cta: 'Inizia Prova Gratuita',
        demo: 'Richiedi Demo'
      },
      features: {
        title: 'Moduli Integrati per Ogni Esigenza',
        subtitle: 'Una suite completa di strumenti specializzati per l\'aviazione commerciale',
        schedule: {
          title: 'Pianificazione Voli',
          desc: 'Sistema completo di schedulazione con gestione multi-tratta, ottimizzazione automatica rotte, controllo disponibilità aeromobili ed equipaggi, gestione modifiche in tempo reale, export/import schedules, integrazione con sistemi esterni'
        },
        sales: {
          title: 'Vendite e CRM',
          desc: 'CRM avanzato con gestione clienti completa, sistema quotazioni automatico, calcolo prezzi dinamico, gestione contratti, fatturazione integrata, tracking vendite, marketplace integration (Avinode), comunicazioni automatizzate'
        },
        ops: {
          title: 'Operazioni di Volo',
          desc: 'Centro operativo completo con monitoraggio voli in tempo reale, checklist operative personalizzabili, gestione handling requests, generazione automatica documenti di volo, notifiche operative, controllo conformità, dashboard operativa'
        },
        aircraft: {
          title: 'Gestione Flotta',
          desc: 'Monitoraggio completo aeromobili con tracking ore di volo, gestione documenti e certificazioni, controllo scadenze, configurazioni cabina, registro tecnico digitale, analisi utilizzo flotta, costi operativi'
        },
        crew: {
          title: 'Gestione Equipaggi',
          desc: 'Sistema completo crew management con controllo FTL (Flight Time Limitations), pianificazione turni automatica, gestione qualifiche e certificazioni, training records, fatigue management, disponibilità crew, comunicazioni dedicate'
        },
        maintenance: {
          title: 'Manutenzione',
          desc: 'Sistema manutenzione avanzato con pianificazione interventi, tracking scadenze, gestione MEL/CDL, registro componenti, oil consumption tracking, costi manutenzione, documentazione tecnica, integrazione fornitori'
        },
        reports: {
          title: 'Report e Analytics',
          desc: 'Business intelligence completa con dashboard personalizzabili, report finanziari dettagliati, analisi performance, KPI operativi, trend analysis, export dati, grafici interattivi, schedulazione report automatici'
        },
        phonebook: {
          title: 'Rubrica Aeroportuale',
          desc: 'Database completo aeroporti con informazioni handling, contatti operativi, servizi disponibili, tariffe aeroportuali, orari operativi, info doganali, fornitori carburante, catering services'
        },
        documents: {
          title: 'Gestione Documenti',
          desc: 'Sistema documentale completo con archiviazione digitale, template personalizzabili, generazione automatica documenti, firma elettronica, controllo versioni, backup automatici, ricerca avanzata'
        },
        compliance: {
          title: 'Conformità Normativa',
          desc: 'Controllo automatico conformità EASA/ENAC, verifiche FTL automatiche, alert scadenze, reporting authorities, gestione deroghe, documentazione audit, aggiornamenti normativi automatici'
        },
        finance: {
          title: 'Gestione Finanziaria',
          desc: 'Modulo finanziario integrato con fatturazione automatica, gestione costi operativi, budget planning, analisi profittabilità voli, controllo crediti, integrazione sistemi contabili, multi-currency support'
        },
        mobile: {
          title: 'App Mobile Crew',
          desc: 'Applicazione dedicata equipaggi con accesso schedules personali, checklist operative, comunicazioni, log book digitale, notifiche push, modalità offline, sincronizzazione automatica'
        }
      },
      benefits: {
        title: 'Perché Scegliere WeFly',
        compliance: {
          title: 'Conformità EASA/ENAC',
          desc: 'Rispetta tutti i regolamenti europei per l\'aviazione civile con aggiornamenti automatici'
        },
        realtime: {
          title: 'Tempo Reale',
          desc: 'Sincronizzazione istantanea tra tutti i moduli e utenti con notifiche automatiche'
        },
        cloud: {
          title: 'Cloud Sicuro',
          desc: 'Infrastruttura sicura con backup automatici, alta disponibilità e protezione dati'
        },
        integration: {
          title: 'Integrazione Completa',
          desc: 'API avanzate per integrazione con sistemi esistenti e marketplace aviazione'
        }
      },
      testimonials: {
        title: 'Cosa Dicono i Nostri Clienti',
        testimonial1: {
          text: 'WeFly ha rivoluzionato la nostra gestione operativa. Risparmio di tempo incredibile e controllo totale.',
          author: 'Marco Rossi',
          role: 'Operations Manager - SkyItalia Charter'
        },
        testimonial2: {
          text: 'La conformità FTL automatica e i report dettagliati ci hanno evitato molti problemi normativi.',
          author: 'Laura Bianchi',
          role: 'Chief Pilot - Mediterranean Air'
        },
        testimonial3: {
          text: 'L\'integrazione tra tutti i moduli è perfetta. Finalmente un software pensato per l\'aviazione.',
          author: 'Giuseppe Verdi',
          role: 'CEO - AirMax Operations'
        }
      },
      cta: {
        title: 'Pronto a Decollare?',
        subtitle: 'Inizia oggi la tua prova gratuita di 30 giorni',
        button: 'Inizia Subito'
      },
      admin: {
        title: 'Accesso Amministratori',
        superadmin: 'SuperAdmin',
        dashboard: 'Dashboard Utenti',
        crew: 'Dashboard Equipaggio'
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
        title: 'WeFly - Complete Aviation Management Suite',
        subtitle: 'Professional software for flight operators, airlines and charter services. Manage fleets, crews, maintenance and operations in one platform.',
        cta: 'Start Free Trial',
        demo: 'Request Demo'
      },
      features: {
        title: 'Integrated Modules for Every Need',
        subtitle: 'A complete suite of specialized tools for commercial aviation',
        schedule: {
          title: 'Flight Scheduling',
          desc: 'Complete scheduling system with multi-leg management, automatic route optimization, aircraft and crew availability control, real-time change management, schedule export/import, external systems integration'
        },
        sales: {
          title: 'Sales & CRM',
          desc: 'Advanced CRM with complete client management, automatic quotation system, dynamic pricing, contract management, integrated invoicing, sales tracking, marketplace integration (Avinode), automated communications'
        },
        ops: {
          title: 'Flight Operations',
          desc: 'Complete operations center with real-time flight monitoring, customizable operational checklists, handling requests management, automatic flight documents generation, operational notifications, compliance control, operations dashboard'
        },
        aircraft: {
          title: 'Fleet Management',
          desc: 'Complete aircraft monitoring with flight hours tracking, documents and certifications management, expiry control, cabin configurations, digital technical log, fleet utilization analysis, operating costs'
        },
        crew: {
          title: 'Crew Management',
          desc: 'Complete crew management system with FTL (Flight Time Limitations) control, automatic shift planning, qualifications and certifications management, training records, fatigue management, crew availability, dedicated communications'
        },
        maintenance: {
          title: 'Maintenance',
          desc: 'Advanced maintenance system with intervention planning, expiry tracking, MEL/CDL management, component registry, oil consumption tracking, maintenance costs, technical documentation, supplier integration'
        },
        reports: {
          title: 'Reports & Analytics',
          desc: 'Complete business intelligence with customizable dashboards, detailed financial reports, performance analysis, operational KPIs, trend analysis, data export, interactive charts, automatic report scheduling'
        },
        phonebook: {
          title: 'Airport Directory',
          desc: 'Complete airports database with handling information, operational contacts, available services, airport fees, operating hours, customs info, fuel suppliers, catering services'
        },
        documents: {
          title: 'Document Management',
          desc: 'Complete document system with digital archiving, customizable templates, automatic document generation, electronic signature, version control, automatic backups, advanced search'
        },
        compliance: {
          title: 'Regulatory Compliance',
          desc: 'Automatic EASA/ENAC compliance control, automatic FTL checks, expiry alerts, authorities reporting, derogations management, audit documentation, automatic regulatory updates'
        },
        finance: {
          title: 'Financial Management',
          desc: 'Integrated financial module with automatic invoicing, operating costs management, budget planning, flight profitability analysis, credit control, accounting systems integration, multi-currency support'
        },
        mobile: {
          title: 'Crew Mobile App',
          desc: 'Dedicated crew application with personal schedules access, operational checklists, communications, digital log book, push notifications, offline mode, automatic synchronization'
        }
      },
      benefits: {
        title: 'Why Choose WeFly',
        compliance: {
          title: 'EASA/ENAC Compliance',
          desc: 'Meets all European civil aviation regulations with automatic updates'
        },
        realtime: {
          title: 'Real-Time',
          desc: 'Instant synchronization between all modules and users with automatic notifications'
        },
        cloud: {
          title: 'Secure Cloud',
          desc: 'Secure infrastructure with automatic backups, high availability and data protection'
        },
        integration: {
          title: 'Complete Integration',
          desc: 'Advanced APIs for integration with existing systems and aviation marketplaces'
        }
      },
      testimonials: {
        title: 'What Our Customers Say',
        testimonial1: {
          text: 'WeFly has revolutionized our operational management. Incredible time savings and total control.',
          author: 'Marco Rossi',
          role: 'Operations Manager - SkyItalia Charter'
        },
        testimonial2: {
          text: 'Automatic FTL compliance and detailed reports have saved us from many regulatory issues.',
          author: 'Laura Bianchi',
          role: 'Chief Pilot - Mediterranean Air'
        },
        testimonial3: {
          text: 'The integration between all modules is perfect. Finally software designed for aviation.',
          author: 'Giuseppe Verdi',
          role: 'CEO - AirMax Operations'
        }
      },
      cta: {
        title: 'Ready to Take Off?',
        subtitle: 'Start your 30-day free trial today',
        button: 'Get Started'
      },
      admin: {
        title: 'Administrator Access',
        superadmin: 'SuperAdmin',
        dashboard: 'User Dashboard',
        crew: 'Crew Dashboard'
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

      {/* Benefits Section */}
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

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t.testimonials.title}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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

            <Card>
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center">
                    <Star className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-gray-600 mb-4">"{t.testimonials.testimonial3.text}"</p>
                    <div>
                      <p className="font-semibold">{t.testimonials.testimonial3.author}</p>
                      <p className="text-sm text-gray-500">{t.testimonials.testimonial3.role}</p>
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

      {/* Admin Access Section */}
      <section className="py-12 bg-gray-100">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">
            {t.admin.title}
          </h3>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/superadmin">
              <Button size="lg" variant="outline" className="flex items-center space-x-2 bg-red-50 border-red-200 text-red-700 hover:bg-red-100">
                <UserCog className="w-5 h-5" />
                <span>{t.admin.superadmin}</span>
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button size="lg" variant="outline" className="flex items-center space-x-2 bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100">
                <Settings className="w-5 h-5" />
                <span>{t.admin.dashboard}</span>
              </Button>
            </Link>
            <Link to="/crew-dashboard">
              <Button size="lg" variant="outline" className="flex items-center space-x-2 bg-green-50 border-green-200 text-green-700 hover:bg-green-100">
                <Users className="w-5 h-5" />
                <span>{t.admin.crew}</span>
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-lg flex items-center justify-center mr-2">
                  <Plane className="w-5 h-5 text-white transform rotate-45" />
                </div>
                <span className="text-xl font-bold">WeFly</span>
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
            <p>&copy; 2024 WeFly. Tutti i diritti riservati.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
