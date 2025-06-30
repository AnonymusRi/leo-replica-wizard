
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
      console.log('🔍 Verifica stato autenticazione SuperAdmin...');
      
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError && !userError.message.includes('session missing')) {
        console.error('❌ Errore recupero utente:', userError);
        setIsAuthenticated(false);
        return;
      }

      console.log('👤 Utente corrente:', user?.email || 'Nessuno');
      
      if (!user) {
        console.log('❌ Nessun utente autenticato');
        setIsAuthenticated(false);
        return;
      }

      // Verifichiamo se l'utente è un SuperAdmin
      const { data: superAdmin, error: superAdminError } = await supabase
        .from('super_admins')
        .select('*')
        .eq('email', user.email)
        .eq('is_active', true)
        .maybeSingle();

      console.log('🔐 Verifica SuperAdmin:', { 
        email: user.email, 
        superAdmin: !!superAdmin, 
        error: superAdminError?.message 
      });

      if (superAdminError) {
        console.error('❌ Errore verifica SuperAdmin:', superAdminError);
        setIsAuthenticated(false);
        return;
      }

      if (!superAdmin) {
        console.log('🚫 Utente non è un SuperAdmin');
        setIsAuthenticated(false);
        return;
      }

      // Verifichiamo se ha una sessione SuperAdmin attiva recente (ultime 24 ore)
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      
      const { data: session, error: sessionError } = await supabase
        .from('super_admin_sessions')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .gte('login_at', oneDayAgo)
        .order('login_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      console.log('📅 Verifica sessione SuperAdmin:', { 
        hasSession: !!session, 
        error: sessionError?.message 
      });

      if (sessionError) {
        console.error('❌ Errore verifica sessione:', sessionError);
        // Non blocchiamo per errori di sessione, procediamo comunque
      }

      if (session) {
        console.log('✅ Sessione SuperAdmin valida trovata');
        setIsAuthenticated(true);
      } else {
        console.log('⏰ Nessuna sessione SuperAdmin recente, richiesta nuova autenticazione');
        setIsAuthenticated(false);
      }

    } catch (error) {
      console.error('💥 Errore critico nella verifica autenticazione:', error);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuthenticated = () => {
    console.log('🎉 Autenticazione SuperAdmin completata, aggiornamento stato...');
    setIsAuthenticated(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
          <div>Verifica credenziali SuperAdmin...</div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <SuperAdminAuth onAuthenticated={handleAuthenticated} />;
  }

  return <SuperAdmin />;
};

export default SuperAdminAuthPage;
