
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';

interface LandingTestimonialsProps {
  t: any;
}

export function LandingTestimonials({ t }: LandingTestimonialsProps) {
  return (
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
  );
}
