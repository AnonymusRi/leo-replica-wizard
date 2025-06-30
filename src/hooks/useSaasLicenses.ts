
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { SaasLicense, SystemModule } from '@/types/user-roles';

// Since we don't have the actual saas_licenses table in the types yet,
// we'll work with mock data and direct queries for now
export const useSaasLicenses = () => {
  return useQuery({
    queryKey: ['saas-licenses'],
    queryFn: async () => {
      // Try to query the table directly
      const { data, error } = await supabase
        .from('organizations')
        .select('*')
        .limit(0); // Just testing the connection
      
      if (error) {
        console.log('Direct query failed, using mock data');
      }
      
      // Return mock data for now
      const mockLicenses: SaasLicense[] = [
        {
          id: '1',
          organization_id: 'mock-org-1',
          license_type: 'premium',
          max_users: 50,
          active_modules: ['SCHED', 'SALES', 'OPS', 'AIRCRAFT', 'CREW', 'CREW-TIME', 'MX', 'REPORTS', 'PHONEBOOK', 'OWNER BOARD'] as SystemModule[],
          expires_at: undefined,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
      
      return mockLicenses;
    }
  });
};

export const useOrganizationLicense = (organizationId?: string) => {
  return useQuery({
    queryKey: ['organization-license', organizationId],
    queryFn: async () => {
      if (!organizationId) return null;
      
      // For now return a mock license
      const mockLicense: SaasLicense = {
        id: '1',
        organization_id: organizationId,
        license_type: 'premium',
        max_users: 50,
        active_modules: ['SCHED', 'SALES', 'OPS', 'AIRCRAFT', 'CREW', 'CREW-TIME', 'MX', 'REPORTS', 'PHONEBOOK', 'OWNER BOARD'] as SystemModule[],
        expires_at: undefined,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      return mockLicense;
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
      // Mock implementation for now
      console.log('Aggiornamento licenza:', params);
      return { id: params.id, ...params };
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
      // Mock implementation for now
      console.log('Creazione licenza:', params);
      return { 
        id: Date.now().toString(), 
        ...params, 
        is_active: true, 
        created_at: new Date().toISOString(), 
        updated_at: new Date().toISOString() 
      };
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
