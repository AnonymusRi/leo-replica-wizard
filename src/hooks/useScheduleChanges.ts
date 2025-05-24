
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ScheduleChange } from '@/types/database';
import { toast } from 'sonner';

export const useScheduleChanges = (flightId?: string) => {
  return useQuery({
    queryKey: ['schedule-changes', flightId],
    queryFn: async () => {
      let query = supabase
        .from('schedule_changes')
        .select(`
          *,
          flight:flights(*)
        `)
        .order('changed_at', { ascending: false });
      
      if (flightId) {
        query = query.eq('flight_id', flightId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data as ScheduleChange[];
    }
  });
};

export const useCreateScheduleChange = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (changeData: Omit<ScheduleChange, 'id' | 'changed_at'>) => {
      const { data, error } = await supabase
        .from('schedule_changes')
        .insert(changeData)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedule-changes'] });
      toast.success('Schedule change recorded successfully');
    },
    onError: (error) => {
      toast.error('Failed to record schedule change: ' + error.message);
    }
  });
};

export const useApproveScheduleChange = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, approvedBy }: { id: string; approvedBy: string }) => {
      const { data, error } = await supabase
        .from('schedule_changes')
        .update({
          approved_by: approvedBy,
          approved_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedule-changes'] });
      toast.success('Schedule change approved successfully');
    },
    onError: (error) => {
      toast.error('Failed to approve schedule change: ' + error.message);
    }
  });
};
