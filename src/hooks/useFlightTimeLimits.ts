
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { FlightTimeLimit } from '@/types/crew';
import { toast } from 'sonner';

export const useFlightTimeLimits = () => {
  return useQuery({
    queryKey: ['flight_time_limits'],
    queryFn: async (): Promise<FlightTimeLimit[]> => {
      const { data, error } = await supabase
        .from('flight_time_limits')
        .select('*')
        .order('regulation_name');
      
      if (error) {
        console.error('Error fetching flight time limits:', error);
        return [];
      }
      
      return data || [];
    }
  });
};

export const useCreateFlightTimeLimit = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (limit: Omit<FlightTimeLimit, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('flight_time_limits')
        .insert([limit])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['flight_time_limits'] });
      toast.success('Limite FTL creato con successo');
    },
    onError: (error) => {
      toast.error('Errore nella creazione del limite FTL: ' + error.message);
    }
  });
};

export const useUpdateFlightTimeLimit = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...limit }: Partial<FlightTimeLimit> & { id: string }) => {
      const { data, error } = await supabase
        .from('flight_time_limits')
        .update(limit)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['flight_time_limits'] });
      toast.success('Limite FTL aggiornato con successo');
    },
    onError: (error) => {
      toast.error('Errore nell\'aggiornamento del limite FTL: ' + error.message);
    }
  });
};

export const useDeleteFlightTimeLimit = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('flight_time_limits')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['flight_time_limits'] });
      toast.success('Limite FTL eliminato con successo');
    },
    onError: (error) => {
      toast.error('Errore nell\'eliminazione del limite FTL: ' + error.message);
    }
  });
};
