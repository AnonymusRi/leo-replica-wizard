
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plane, ArrowLeft, Globe, Users, Award, Target, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function About() {
  const [language, setLanguage] = useState<'it' | 'en'>('it');

  const content = {
    it: {
      title: 'Chi Siamo',
      subtitle: 'La storia dietro WeFly e la nostra missione nel settore dell\'aviazione',
      mission: {
        title: 'La Nostra Missione',
        text: 'Semplificare e digitalizzare le operazioni aeree attraverso software innovativi che rispettano i più alti standard di sicurezza e conformità normativa.'
      },
      story: {
        title: 'La Nostra Storia',
        text: 'WeFly nasce dall\'esperienza diretta nel settore dell\'aviazione commerciale. Fondata da professionisti del settore, comprendiamo le sfide quotidiane degli operatori aerei e abbiamo sviluppato soluzioni concrete per risolverle.'
      },
      values: {
        title: 'I Nostri Valori',
        safety: {
          title: 'Sicurezza',
          desc: 'La sicurezza è al centro di tutto ciò che facciamo'
        },
        innovation: {
          title: 'Innovazione',
          desc: 'Utilizziamo le tecnologie più avanzate per semplificare i processi'
        },
        compliance: {
          title: 'Conformità',
          desc: 'Rispettiamo rigorosamente tutte le normative aeronautiche'
        },
        support: {
          title: 'Supporto',
          desc: 'Offriamo assistenza dedicata per il successo dei nostri clienti'
        }
      },
      team: {
        title: 'Il Nostro Team',
        desc: 'Un gruppo di esperti con decenni di esperienza combinata nel settore aeronautico e tecnologico'
      },
      contact: {
        title: 'Contattaci',
        subtitle: 'Vuoi saperne di più o hai bisogno di assistenza?',
        button: 'Inizia Oggi'
      }
    },
    en: {
      title: 'About Us',
      subtitle: 'The story behind WeFly and our mission in the aviation industry',
      mission: {
        title: 'Our Mission',
        text: 'To simplify and digitize aviation operations through innovative software that meets the highest safety and regulatory compliance standards.'
      },
      story: {
        title: 'Our Story',
        text: 'WeFly was born from direct experience in the commercial aviation sector. Founded by industry professionals, we understand the daily challenges of air operators and have developed concrete solutions to solve them.'
      },
      values: {
        title: 'Our Values',
        safety: {
          title: 'Safety',
          desc: 'Safety is at the center of everything we do'
        },
        innovation: {
          title: 'Innovation',
          desc: 'We use the most advanced technologies to simplify processes'
        },
        compliance: {
          title: 'Compliance',
          desc: 'We strictly comply with all aviation regulations'
        },
        support: {
          title: 'Support',
          desc: 'We provide dedicated assistance for our customers\' success'
        }
      },
      team: {
        title: 'Our Team',
        desc: 'A group of experts with decades of combined experience in the aviation and technology sectors'
      },
      contact: {
        title: 'Contact Us',
        subtitle: 'Want to know more or need assistance?',
        button: 'Get Started Today'
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
            <Badge className="mb-4" variant="secondary">
              {language === 'it' ? 'La Nostra Storia' : 'Our Story'}
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {t.title}
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t.subtitle}
            </p>
          </div>

          {/* Mission & Story */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
            <Card className="h-full">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Target className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle className="text-2xl">{t.mission.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  {t.mission.text}
                </p>
              </CardContent>
            </Card>

            <Card className="h-full">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Plane className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle className="text-2xl">{t.story.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  {t.story.text}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Values */}
          <div className="MB-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {t.values.title}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{t.values.safety.title}</h3>
                <p className="text-gray-600">{t.values.safety.desc}</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{t.values.innovation.title}</h3>
                <p className="text-gray-600">{t.values.innovation.desc}</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{t.values.compliance.title}</h3>
                <p className="text-gray-600">{t.values.compliance.desc}</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{t.values.support.title}</h3>
                <p className="text-gray-600">{t.values.support.desc}</p>
              </div>
            </div>
          </div>

          {/* Team */}
          <div className="bg-white rounded-2xl p-8 md:p-12 mb-20">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-indigo-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {t.team.title}
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                {t.team.desc}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4"></div>
                <h3 className="text-lg font-semibold mb-1">Riccardo Cirulli</h3>
                <p className="text-gray-600 mb-2">Founder & CEO</p>
                <p className="text-sm text-gray-500">
                  {language === 'it' 
                    ? '15+ anni di esperienza nell\'aviazione commerciale'
                    : '15+ years of experience in commercial aviation'
                  }
                </p>
              </div>

              <div className="text-center">
                <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4"></div>
                <h3 className="text-lg font-semibold mb-1">Tech Team</h3>
                <p className="text-gray-600 mb-2">Development</p>
                <p className="text-sm text-gray-500">
                  {language === 'it' 
                    ? 'Esperti in tecnologie web moderne e cloud'
                    : 'Experts in modern web technologies and cloud'
                  }
                </p>
              </div>

              <div className="text-center">
                <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4"></div>
                <h3 className="text-lg font-semibold mb-1">Aviation Experts</h3>
                <p className="text-gray-600 mb-2">Consultants</p>
                <p className="text-sm text-gray-500">
                  {language === 'it' 
                    ? 'Piloti e ingegneri aeronautici certificati'
                    : 'Certified pilots and aeronautical engineers'
                  }
                </p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="bg-blue-600 text-white rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t.contact.title}
            </h2>
            <p className="text-xl mb-8 opacity-90">
              {t.contact.subtitle}
            </p>
            <Link to="/auth">
              <Button size="lg" variant="secondary">
                {t.contact.button}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
