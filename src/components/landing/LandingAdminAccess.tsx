
import { Button } from '@/components/ui/button';
import { UserCog, Settings, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

interface LandingAdminAccessProps {
  t: any;
}

export function LandingAdminAccess({ t }: LandingAdminAccessProps) {
  return (
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
  );
}
