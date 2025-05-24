
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CrewMember } from '@/types/database';

export const useCrewMembers = () => {
  return useQuery({
    queryKey: ['crew_members'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('crew_members')
        .select('*')
        .order('last_name');
      
      if (error) throw error;
      return data as CrewMember[];
    }
  });
};

export const useCreateCrewMember = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (crewMember: Omit<CrewMember, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('crew_members')
        .insert([crewMember])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crew_members'] });
    }
  });
};
