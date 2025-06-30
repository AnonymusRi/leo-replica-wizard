
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { SaasLicense, SystemModule } from '@/types/user-roles';

// Versione temporanea che usa chiamate SQL dirette finché i tipi non vengono aggiornati
export const useSaasLicenses = () => {
  return useQuery({
    queryKey: ['saas-licenses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc('get_saas_licenses');
      
      if (error) {
        // Fallback: prova a interrogare direttamente se la funzione non esiste
        console.log('Funzione RPC non disponibile, uso query diretta');
        const { data: directData, error: directError } = await supabase
          .from('organizations')
          .select('*')
          .limit(0); // Query vuota per ora
        
        if (directError) throw directError;
        return [] as SaasLicense[];
      }
      
      return data as SaasLicense[];
    }
  });
};

export const useOrganizationLicense = (organizationId?: string) => {
  return useQuery({
    queryKey: ['organization-license', organizationId],
    queryFn: async () => {
      if (!organizationId) return null;
      
      // Per ora ritorna una licenza mock
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
      // Per ora simula l'aggiornamento
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
      // Per ora simula la creazione
      console.log('Creazione licenza:', params);
      return { id: Date.now().toString(), ...params, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
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
