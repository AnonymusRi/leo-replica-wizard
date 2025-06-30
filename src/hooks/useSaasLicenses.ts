
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { SaasLicense, SystemModule } from '@/types/user-roles';

export const useSaasLicenses = () => {
  return useQuery({
    queryKey: ['saas-licenses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('saas_licenses')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as SaasLicense[];
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
        .maybeSingle();
      
      if (error) throw error;
      return data as SaasLicense | null;
    },
    enabled: !!organizationId
  });
};

export const useUpdateLicense = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (params: {
      id: string;
      license_type?: string;
      max_users?: number;
      active_modules?: SystemModule[];
      expires_at?: string;
      is_active?: boolean;
    }) => {
      const { data, error } = await supabase
        .from('saas_licenses')
        .update(params)
        .eq('id', params.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saas-licenses'] });
      queryClient.invalidateQueries({ queryKey: ['organization-license'] });
      toast.success('Licenza aggiornata con successo');
    },
    onError: (error) => {
      toast.error('Errore aggiornamento licenza: ' + error.message);
    }
  });
};

export const useCreateLicense = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (params: {
      organization_id: string;
      license_type: string;
      max_users: number;
      active_modules: SystemModule[];
      expires_at?: string;
    }) => {
      const { data, error } = await supabase
        .from('saas_licenses')
        .insert(params)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saas-licenses'] });
      queryClient.invalidateQueries({ queryKey: ['organization-license'] });
      toast.success('Licenza creata con successo');
    },
    onError: (error) => {
      toast.error('Errore creazione licenza: ' + error.message);
    }
  });
};
