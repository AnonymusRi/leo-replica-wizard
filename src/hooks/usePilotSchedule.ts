
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { PilotSchedule } from '@/types/crew';
import { toast } from 'sonner';

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

// Hook per ottenere le ore di training che impattano sui limiti FTL
export const usePilotTrainingHours = (pilotId?: string, dateRange?: { start: string; end: string }) => {
  return useQuery({
    queryKey: ['pilot_training_hours', pilotId, dateRange],
    queryFn: async () => {
      let query = supabase.from('training_records').select('*');
      
      if (pilotId) {
        query = query.eq('pilot_id', pilotId);
      }

      // Filtra solo i training che impattano sui limiti FTL
      query = query.eq('ftl_applicable', true);
      query = query.eq('status', 'completed');

      if (dateRange) {
        query = query
          .gte('training_date', dateRange.start)
          .lte('training_date', dateRange.end);
      }
      
      const { data, error } = await query.order('training_date', { ascending: false });
      
      if (error) {
        console.error('Error fetching training hours:', error);
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
      toast.success('Orario creato con successo');
    },
    onError: (error) => {
      toast.error('Errore nella creazione dell\'orario: ' + error.message);
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
      toast.success('Orario aggiornato con successo');
    },
    onError: (error) => {
      toast.error('Errore nell\'aggiornamento dell\'orario: ' + error.message);
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
      toast.success('Orario eliminato con successo');
    },
    onError: (error) => {
      toast.error('Errore nell\'eliminazione dell\'orario: ' + error.message);
    }
  });
};
