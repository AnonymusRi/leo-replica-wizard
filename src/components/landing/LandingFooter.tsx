
import { Plane, MapPin, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

export function LandingFooter() {
  return (
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
  );
}
