
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { PilotSchedule } from '@/types/crew';

export const usePilotSchedule = (pilotId?: string, dateRange?: { start: string; end: string }) => {
  return useQuery({
    queryKey: ['pilot_schedule', pilotId, dateRange],
    queryFn: async (): Promise<PilotSchedule[]> => {
      let query = supabase.from('pilot_schedule').select('*');
      
      if (pilotId) {
        query = query.eq('pilot_id', pilotId);
      }

      // Aggiungi filtro per intervallo di date se specificato
      if (dateRange) {
        query = query
          .gte('start_date', dateRange.start)
          .lte('end_date', dateRange.end);
      }
      
      const { data, error } = await query.order('start_date', { ascending: true });
      
      if (error) {
        console.error('Error fetching pilot schedule:', error);
        throw error;
      }
      
      return data || [];
    }
  });
};

export const useCreatePilotSchedule = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (schedule: Omit<PilotSchedule, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('pilot_schedule')
        .insert([{
          pilot_id: schedule.pilot_id,
          start_date: schedule.start_date,
          end_date: schedule.end_date,
          schedule_type: schedule.schedule_type,
          notes: schedule.notes || null
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pilot_schedule'] });
    }
  });
};

export const useUpdatePilotSchedule = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...schedule }: Partial<PilotSchedule> & { id: string }) => {
      const { data, error } = await supabase
        .from('pilot_schedule')
        .update({
          pilot_id: schedule.pilot_id,
          start_date: schedule.start_date,
          end_date: schedule.end_date,
          schedule_type: schedule.schedule_type,
          notes: schedule.notes || null
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pilot_schedule'] });
    }
  });
};

export const useDeletePilotSchedule = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('pilot_schedule')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pilot_schedule'] });
    }
  });
};
