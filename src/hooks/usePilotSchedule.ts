
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

export const usePilotTrainingHours = (pilotId?: string, dateRange?: { start: string; end: string }) => {
  return useQuery({
    queryKey: ['pilot_training_hours', pilotId, dateRange],
    queryFn: async () => {
      let query = supabase.from('training_records').select('*');
      
      if (pilotId) {
        query = query.eq('pilot_id', pilotId);
      }

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
      console.log('Creating pilot schedule:', schedule);
      
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
      
      if (error) {
        console.error('Database error creating schedule:', error);
        throw error;
      }
      
      console.log('Schedule created successfully:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pilot_schedule'] });
      toast.success('Orario creato con successo');
    },
    onError: (error: any) => {
      console.error('Error in mutation:', error);
      toast.error('Errore nella creazione dell\'orario: ' + error.message);
    }
  });
};

export const useUpdatePilotSchedule = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...schedule }: Partial<PilotSchedule> & { id: string }) => {
      console.log('Updating pilot schedule:', { id, ...schedule });
      
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
      
      if (error) {
        console.error('Database error updating schedule:', error);
        throw error;
      }
      
      console.log('Schedule updated successfully:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pilot_schedule'] });
      toast.success('Orario aggiornato con successo');
    },
    onError: (error: any) => {
      console.error('Error in update mutation:', error);
      toast.error('Errore nell\'aggiornamento dell\'orario: ' + error.message);
    }
  });
};

export const useDeletePilotSchedule = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      console.log('Deleting pilot schedule:', id);
      
      const { error } = await supabase
        .from('pilot_schedule')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Database error deleting schedule:', error);
        throw error;
      }
      
      console.log('Schedule deleted successfully');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pilot_schedule'] });
      toast.success('Orario eliminato con successo');
    },
    onError: (error: any) => {
      console.error('Error in delete mutation:', error);
      toast.error('Errore nell\'eliminazione dell\'orario: ' + error.message);
    }
  });
};
