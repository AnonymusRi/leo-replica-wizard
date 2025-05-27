
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface TrainingRecord {
  id: string;
  pilot_id: string;
  training_type: 'simulator' | 'aircraft' | 'ground_school' | 'recurrent' | 'type_rating' | 'proficiency_check';
  training_date: string;
  duration_hours: number;
  instructor_id?: string;
  training_organization: string;
  training_description: string;
  certification_achieved?: string;
  expiry_date?: string;
  counts_as_duty_time: boolean;
  counts_as_flight_time: boolean;
  ftl_applicable: boolean;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  notes?: string;
  created_at: string;
  updated_at: string;
}

export const useTrainingRecords = (pilotId?: string) => {
  return useQuery({
    queryKey: ['training_records', pilotId],
    queryFn: async (): Promise<TrainingRecord[]> => {
      let query = supabase.from('training_records').select('*');
      
      if (pilotId) {
        query = query.eq('pilot_id', pilotId);
      }
      
      const { data, error } = await query.order('training_date', { ascending: false });
      
      if (error) {
        console.error('Error fetching training records:', error);
        throw error;
      }
      
      return (data || []) as TrainingRecord[];
    }
  });
};

export const useCreateTrainingRecord = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (record: Omit<TrainingRecord, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('training_records')
        .insert([record])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['training_records'] });
      queryClient.invalidateQueries({ queryKey: ['pilot_flight_hours'] });
      toast.success('Record di addestramento creato con successo');
    }
  });
};

export const useUpdateTrainingRecord = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...record }: Partial<TrainingRecord> & { id: string }) => {
      const { data, error } = await supabase
        .from('training_records')
        .update(record)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['training_records'] });
      queryClient.invalidateQueries({ queryKey: ['pilot_flight_hours'] });
      toast.success('Record di addestramento aggiornato');
    }
  });
};

export const useDeleteTrainingRecord = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('training_records')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['training_records'] });
      queryClient.invalidateQueries({ queryKey: ['pilot_flight_hours'] });
      toast.success('Record di addestramento eliminato');
    }
  });
};
