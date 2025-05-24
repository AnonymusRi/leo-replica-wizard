
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { PilotFlightHour } from '@/types/crew';

export const usePilotFlightHours = (pilotId?: string) => {
  return useQuery({
    queryKey: ['pilot_flight_hours', pilotId],
    queryFn: async (): Promise<PilotFlightHour[]> => {
      let query = supabase.from('pilot_flight_hours').select('*');
      
      if (pilotId) {
        query = query.eq('pilot_id', pilotId);
      }
      
      const { data, error } = await query.order('flight_date', { ascending: false });
      
      if (error) {
        console.error('Error fetching pilot flight hours:', error);
        return [];
      }
      
      return data || [];
    }
  });
};

export const useCreatePilotFlightHour = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (flightHour: Omit<PilotFlightHour, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('pilot_flight_hours')
        .insert([{
          pilot_id: flightHour.pilot_id,
          flight_id: flightHour.flight_id || null,
          flight_date: flightHour.flight_date,
          flight_hours: flightHour.flight_hours,
          flight_type: flightHour.flight_type
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pilot_flight_hours'] });
    }
  });
};

export const useUpdatePilotFlightHour = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...flightHour }: Partial<PilotFlightHour> & { id: string }) => {
      const { data, error } = await supabase
        .from('pilot_flight_hours')
        .update({
          pilot_id: flightHour.pilot_id,
          flight_id: flightHour.flight_id || null,
          flight_date: flightHour.flight_date,
          flight_hours: flightHour.flight_hours,
          flight_type: flightHour.flight_type
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pilot_flight_hours'] });
    }
  });
};

export const useDeletePilotFlightHour = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('pilot_flight_hours')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pilot_flight_hours'] });
    }
  });
};
