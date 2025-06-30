
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

interface SuperAdmin {
  id: string;
  user_id: string;
  email: string;
  phone_number: string;
  is_active: boolean;
  two_factor_enabled: boolean;
}

export const useSuperAdminAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [superAdmin, setSuperAdmin] = useState<SuperAdmin | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuthStatus();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          await checkSuperAdminStatus(session.user);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setSuperAdmin(null);
          setIsAuthenticated(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await checkSuperAdminStatus(user);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const checkSuperAdminStatus = async (user: User) => {
    try {
      const { data: superAdminData, error } = await supabase
        .from('super_admins')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .single();

      if (!error && superAdminData) {
        setUser(user);
        setSuperAdmin(superAdminData);
        setIsAuthenticated(true);
      } else {
        // Controlla per email se non c'è user_id
        const { data: superAdminByEmail } = await supabase
          .from('super_admins')
          .select('*')
          .eq('email', user.email)
          .eq('is_active', true)
          .single();

        if (superAdminByEmail) {
          // Aggiorna il record con il user_id
          await supabase
            .from('super_admins')
            .update({ user_id: user.id })
            .eq('id', superAdminByEmail.id);

          setUser(user);
          setSuperAdmin(superAdminByEmail);
          setIsAuthenticated(true);
        }
      }
    } catch (error) {
      console.error('Error checking super admin status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      if (user && superAdmin) {
        // Chiudi la sessione SuperAdmin
        await supabase
          .from('super_admin_sessions')
          .update({ 
            logout_at: new Date().toISOString(),
            is_active: false 
          })
          .eq('user_id', user.id)
          .eq('is_active', true);
      }

      await supabase.auth.signOut();
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return {
    user,
    superAdmin,
    isLoading,
    isAuthenticated,
    logout
  };
};
