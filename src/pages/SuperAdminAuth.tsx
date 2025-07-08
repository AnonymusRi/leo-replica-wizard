
import { useState, useEffect } from 'react';
import { SuperAdminAuth } from '@/components/superadmin/SuperAdminAuth';
import SuperAdmin from './SuperAdmin';
import { supabase } from '@/integrations/supabase/client';

const SuperAdminAuthPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthentication();
    
    // Ascoltiamo i cambiamenti di autenticazione
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Cambio stato auth:', event, session?.user?.email);
        if (event === 'SIGNED_IN' && session?.user) {
          await checkSuperAdminStatus(session.user);
        } else if (event === 'SIGNED_OUT') {
          setIsAuthenticated(false);
        }
      }
    );

    return () => subscription.unsubscribe();
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

      await checkSuperAdminStatus(user);

    } catch (error) {
      console.error('💥 Errore critico nella verifica autenticazione:', error);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const checkSuperAdminStatus = async (user: any) => {
    try {
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

      if (superAdminError && superAdminError.code !== 'PGRST116') {
        console.error('❌ Errore verifica SuperAdmin:', superAdminError);
        setIsAuthenticated(false);
        return;
      }

      if (!superAdmin) {
        console.log('🚫 Utente non è un SuperAdmin');
        setIsAuthenticated(false);
        return;
      }

      // Aggiorniamo il record con l'user_id se necessario
      if (!superAdmin.user_id) {
        const { error: updateError } = await supabase
          .from('super_admins')
          .update({ user_id: user.id })
          .eq('email', user.email);
        
        if (updateError) {
          console.warn('⚠️ Errore aggiornamento user_id:', updateError);
        }
      }

      console.log('✅ SuperAdmin autenticato con successo');
      setIsAuthenticated(true);

    } catch (error) {
      console.error('💥 Errore nella verifica SuperAdmin:', error);
      setIsAuthenticated(false);
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
