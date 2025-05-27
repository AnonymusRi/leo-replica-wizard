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

// Hook per ottenere le ore di addestramento che impattano sui limiti FTL
export const usePilotTrainingHours = (pilotId?: string) => {
  return useQuery({
    queryKey: ['pilot_training_hours', pilotId],
    queryFn: async () => {
      let query = supabase.from('training_records').select('*');
      
      if (pilotId) {
        query = query.eq('pilot_id', pilotId);
      }
      
      // Filtra solo i training che impattano sui limiti FTL e sono completati
      query = query.eq('ftl_applicable', true);
      query = query.in('status', ['completed', 'in_progress']);
      
      const { data, error } = await query.order('training_date', { ascending: false });
      
      if (error) {
        console.error('Error fetching training hours:', error);
        return [];
      }
      
      return data || [];
    }
  });
};

// Hook combinato per ottenere tutte le ore (volo + addestramento) per il calcolo FTL
export const useCombinedPilotHours = (pilotId?: string) => {
  const { data: flightHours = [] } = usePilotFlightHours(pilotId);
  const { data: trainingHours = [] } = usePilotTrainingHours(pilotId);
  
  return useQuery({
    queryKey: ['combined_pilot_hours', pilotId, flightHours, trainingHours],
    queryFn: async () => {
      // Combina ore di volo e addestramento per il calcolo FTL
      const combinedHours = [
        ...flightHours.map(h => ({
          id: h.id,
          pilot_id: h.pilot_id,
          date: h.flight_date,
          hours: Number(h.flight_hours),
          type: 'flight',
          source: 'flight_hours',
          counts_as_duty_time: true,
          counts_as_flight_time: true
        })),
        ...trainingHours.map(t => ({
          id: t.id,
          pilot_id: t.pilot_id,
          date: t.training_date,
          hours: Number(t.duration_hours),
          type: 'training',
          source: 'training',
          counts_as_duty_time: t.counts_as_duty_time,
          counts_as_flight_time: t.counts_as_flight_time
        }))
      ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      return combinedHours;
    },
    enabled: flightHours.length > 0 || trainingHours.length > 0
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
      queryClient.invalidateQueries({ queryKey: ['combined_pilot_hours'] });
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
      queryClient.invalidateQueries({ queryKey: ['combined_pilot_hours'] });
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
      queryClient.invalidateQueries({ queryKey: ['combined_pilot_hours'] });
    }
  });
};
