
import { useState, useEffect } from 'react';
import { SuperAdminAuth } from '@/components/superadmin/SuperAdminAuth';
import SuperAdmin from './SuperAdmin';
import { supabase } from '@/integrations/supabase/client';

const SuperAdminAuthPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthentication();
  }, []);

  const checkAuthentication = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Verifica se l'utente è un SuperAdmin
        const { data: superAdmin } = await supabase
          .from('super_admins')
          .select('*')
          .eq('email', user.email)
          .eq('is_active', true)
          .single();

        if (superAdmin) {
          // Verifica se ha una sessione attiva recente
          const { data: session } = await supabase
            .from('super_admin_sessions')
            .select('*')
            .eq('user_id', user.id)
            .eq('is_active', true)
            .gte('login_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()) // Ultimi 24 ore
            .single();

          if (session) {
            setIsAuthenticated(true);
          }
        }
      }
    } catch (error) {
      console.error('Errore verifica autenticazione:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuthenticated = () => {
    setIsAuthenticated(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white">Verifica autenticazione...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <SuperAdminAuth onAuthenticated={handleAuthenticated} />;
  }

  return <SuperAdmin />;
};

export default SuperAdminAuthPage;
