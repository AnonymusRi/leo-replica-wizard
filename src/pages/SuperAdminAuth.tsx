
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
      console.log('Verifica stato autenticazione SuperAdmin...');
      
      const { data: { user } } = await supabase.auth.getUser();
      console.log('Utente corrente:', user);
      
      if (user) {
        // Verifica se l'utente è un SuperAdmin
        const { data: superAdmin, error: superAdminError } = await supabase
          .from('super_admins')
          .select('*')
          .eq('email', user.email)
          .eq('is_active', true)
          .single();

        console.log('Verifica SuperAdmin:', { superAdmin, superAdminError });

        if (superAdmin) {
          // Verifica se ha una sessione attiva recente
          const { data: session, error: sessionError } = await supabase
            .from('super_admin_sessions')
            .select('*')
            .eq('user_id', user.id)
            .eq('is_active', true)
            .gte('login_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()) // Ultimi 24 ore
            .maybeSingle();

          console.log('Verifica sessione SuperAdmin:', { session, sessionError });

          if (session) {
            console.log('Sessione SuperAdmin valida trovata');
            setIsAuthenticated(true);
          } else {
            console.log('Nessuna sessione SuperAdmin attiva trovata');
          }
        } else {
          console.log('Utente non è un SuperAdmin');
        }
      } else {
        console.log('Nessun utente autenticato');
      }
    } catch (error) {
      console.error('Errore verifica autenticazione:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuthenticated = () => {
    console.log('Autenticazione SuperAdmin completata');
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
