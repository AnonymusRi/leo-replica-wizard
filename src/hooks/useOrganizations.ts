
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Organization {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  subscription_status: string;
  subscription_end_date?: string;
  created_at: string;
  updated_at: string;
  settings?: any;
  active_modules?: any[];
  slug: string;
}

export const useOrganizations = () => {
  return useQuery({
    queryKey: ['organizations'],
    queryFn: async () => {
      console.log('🏢 Fetching organizations...');
      
      const { data, error } = await supabase
        .from('organizations')
        .select('*')
        .order('name', { ascending: true });
      
      if (error) {
        console.error('❌ Error fetching organizations:', error);
        throw error;
      }
      
      console.log('✅ Organizations fetched:', data?.length || 0);
      return (data || []) as Organization[];
    }
  });
};

export const useCurrentUserOrganization = () => {
  return useQuery({
    queryKey: ['current-user-organization'],
    queryFn: async () => {
      console.log('🔍 Fetching current user organization...');
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log('❌ No authenticated user');
        return null;
      }

      // Get user's profile to find their organization
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('organization_id, organizations(*)')
        .eq('id', user.id)
        .single();

      if (profileError) {
        console.error('❌ Error fetching user profile:', profileError);
        throw profileError;
      }

      console.log('✅ Current user organization:', profile?.organizations);
      return profile?.organizations as Organization | null;
    }
  });
};

export const useCheckSuperAdminStatus = () => {
  return useQuery({
    queryKey: ['super-admin-status'],
    queryFn: async () => {
      console.log('🔒 Checking SuperAdmin status...');
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log('❌ No authenticated user');
        return false;
      }

      const { data, error } = await supabase
        .from('super_admins')
        .select('is_active')
        .eq('email', user.email)
        .eq('is_active', true)
        .maybeSingle();

      if (error) {
        console.error('❌ Error checking SuperAdmin status:', error);
        return false;
      }

      const isSuperAdmin = !!data;
      console.log('🔐 SuperAdmin status:', isSuperAdmin);
      return isSuperAdmin;
    }
  });
};
