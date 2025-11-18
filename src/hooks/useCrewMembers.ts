
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CrewMember } from '@/types/database';
import { toast } from 'sonner';

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

export const useCrewMember = (id: string) => {
  return useQuery({
    queryKey: ['crew_member', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('crew_members')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data as CrewMember;
    },
    enabled: !!id
  });
};

export const useActivePilots = () => {
  return useQuery({
    queryKey: ['active_pilots'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('crew_members')
        .select('*')
        .in('position', ['captain', 'first_officer'])
        .eq('is_active', true)
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
      queryClient.invalidateQueries({ queryKey: ['active_pilots'] });
      toast.success('Membro dell\'equipaggio creato con successo');
    },
    onError: (error) => {
      toast.error('Errore nella creazione del membro dell\'equipaggio: ' + error.message);
    }
  });
};

export const useUpdateCrewMember = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...crewMember }: Partial<CrewMember> & { id: string }) => {
      const { data, error } = await supabase
        .from('crew_members')
        .update(crewMember)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crew_members'] });
      queryClient.invalidateQueries({ queryKey: ['active_pilots'] });
      toast.success('Membro dell\'equipaggio aggiornato con successo');
    },
    onError: (error) => {
      toast.error('Errore nell\'aggiornamento del membro dell\'equipaggio: ' + error.message);
    }
  });
};

export const useDeleteCrewMember = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('crew_members')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crew_members'] });
      queryClient.invalidateQueries({ queryKey: ['active_pilots'] });
      queryClient.invalidateQueries({ queryKey: ['flight_assignments'] });
      toast.success('Membro dell\'equipaggio eliminato con successo');
    },
    onError: (error) => {
      toast.error('Errore nell\'eliminazione del membro dell\'equipaggio: ' + error.message);
    }
  });
};
