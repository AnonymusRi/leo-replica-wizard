
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
      const { data, error } = await supabase
        .from('organizations')
        .select('*')
        .order('name', { ascending: true });
      
      if (error) throw error;
      return (data || []) as Organization[];
    }
  });
};
