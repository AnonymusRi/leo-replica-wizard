
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface SaasLicense {
  id: string;
  organization_id: string;
  license_type: 'trial' | 'basic' | 'premium' | 'enterprise';
  max_users: number;
  active_modules: string[];
  expires_at?: string;
  is_active: boolean;
  monthly_fee: number;
  currency: string;
  stripe_subscription_id?: string;
  stripe_customer_id?: string;
  created_at: string;
  updated_at: string;
}

export const useSaasLicenses = () => {
  return useQuery({
    queryKey: ['saas-licenses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('saas_licenses')
        .select(`
          *,
          organizations (
            name,
            email
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });
};

export const useCreateLicense = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (license: Partial<SaasLicense>) => {
      const { data, error } = await supabase
        .from('saas_licenses')
        .insert(license)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saas-licenses'] });
      toast.success('Licenza creata con successo');
    },
    onError: (error) => {
      toast.error('Errore creazione licenza: ' + error.message);
    }
  });
};

export const useUpdateLicense = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<SaasLicense> }) => {
      const { data, error } = await supabase
        .from('saas_licenses')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saas-licenses'] });
      toast.success('Licenza aggiornata con successo');
    },
    onError: (error) => {
      toast.error('Errore aggiornamento licenza: ' + error.message);
    }
  });
};

export const useExpiredLicenses = () => {
  return useQuery({
    queryKey: ['expired-licenses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('saas_licenses')
        .select(`
          *,
          organizations (
            name,
            email
          )
        `)
        .lt('expires_at', new Date().toISOString())
        .eq('is_active', true)
        .order('expires_at', { ascending: true });
      
      if (error) throw error;
      return data || [];
    }
  });
};

export const useExpiringLicenses = () => {
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
  
  return useQuery({
    queryKey: ['expiring-licenses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('saas_licenses')
        .select(`
          *,
          organizations (
            name,
            email
          )
        `)
        .gte('expires_at', new Date().toISOString())
        .lte('expires_at', thirtyDaysFromNow.toISOString())
        .eq('is_active', true)
        .order('expires_at', { ascending: true });
      
      if (error) throw error;
      return data || [];
    }
  });
};

export const useOrganizationLicense = (organizationId?: string) => {
  return useQuery({
    queryKey: ['organization-license', organizationId],
    queryFn: async () => {
      if (!organizationId) return null;
      
      const { data, error } = await supabase
        .from('saas_licenses')
        .select('*')
        .eq('organization_id', organizationId)
        .eq('is_active', true)
        .single();
      
      if (error) throw error;
      return data as SaasLicense | null;
    },
    enabled: !!organizationId
  });
};
