
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface CreateOrganizationData {
  name: string;
  slug: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  subscription_status?: string;
  active_modules?: string[];
  settings?: any;
}

export const useCreateOrganization = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateOrganizationData) => {
      const { data: result, error } = await supabase
        .from('organizations')
        .insert([data])
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
      toast.success('Organizzazione creata con successo!');
    },
    onError: (error: any) => {
      console.error('Error creating organization:', error);
      toast.error('Errore nella creazione dell\'organizzazione: ' + error.message);
    }
  });
};
