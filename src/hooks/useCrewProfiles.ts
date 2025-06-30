
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface CrewProfile {
  id: string;
  crew_member_id: string;
  bio?: string;
  avatar_url?: string;
  personal_notes?: string;
  preferences: Record<string, any>;
  notification_settings: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  social_links: Record<string, string>;
  created_at: string;
  updated_at: string;
}

export const useCrewProfile = (crewMemberId: string) => {
  return useQuery({
    queryKey: ['crew-profile', crewMemberId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('crew_profiles')
        .select('*')
        .eq('crew_member_id', crewMemberId)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data as CrewProfile | null;
    },
    enabled: !!crewMemberId
  });
};

export const useCreateOrUpdateCrewProfile = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (profile: Partial<CrewProfile> & { crew_member_id: string }) => {
      const { data, error } = await supabase
        .from('crew_profiles')
        .upsert([profile])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crew-profile'] });
      toast.success('Profilo aggiornato con successo');
    },
    onError: (error) => {
      toast.error('Errore aggiornamento profilo: ' + error.message);
    }
  });
};
