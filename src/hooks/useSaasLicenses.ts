
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { SystemModule } from '@/types/user-roles';

export interface SaasLicense {
  id: string;
  organization_id: string;
  license_type: string;
  max_users: number;
  active_modules: SystemModule[];
  expires_at?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const useOrganizationLicense = (organizationId?: string) => {
  return useQuery({
    queryKey: ['organization-license', organizationId],
    queryFn: async () => {
      if (!organizationId) return null;
      
      const { data, error } = await supabase
        .from('organizations')
        .select('active_modules, subscription_status, subscription_end_date')
        .eq('id', organizationId)
        .single();
      
      if (error) throw error;
      
      // Trasforma i dati dell'organizzazione in formato SaasLicense
      return {
        id: organizationId,
        organization_id: organizationId,
        license_type: data.subscription_status || 'trial',
        max_users: 10, // Default
        active_modules: data.active_modules || [],
        expires_at: data.subscription_end_date,
        is_active: data.subscription_status === 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      } as SaasLicense;
    },
    enabled: !!organizationId
  });
};

export const useUpdateOrganizationLicense = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (license: Partial<SaasLicense> & { organization_id: string }) => {
      const { data, error } = await supabase
        .from('organizations')
        .update({
          active_modules: license.active_modules,
          subscription_status: license.license_type,
          subscription_end_date: license.expires_at
        })
        .eq('id', license.organization_id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organization-license'] });
      toast.success('Licenza aggiornata con successo');
    },
    onError: (error) => {
      toast.error('Errore aggiornamento licenza: ' + error.message);
    }
  });
};
