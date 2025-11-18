
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface FlightChange {
  id: string;
  flight_id?: string;
  change_type: string;
  field_changed: string;
  old_value?: string;
  new_value?: string;
  change_reason?: string;
  changed_by: string;
  changed_at: string;
  requires_attention: boolean;
  color_code?: string;
}

export const useFlightChanges = (flightId?: string) => {
  return useQuery({
    queryKey: ['flight-changes', flightId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('flight_changes_log')
        .select('*')
        .eq('flight_id', flightId)
        .order('changed_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!flightId
  });
};

export const useLogFlightChange = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (changeData: {
      flight_id: string;
      change_type: string;
      field_changed: string;
      old_value?: string;
      new_value?: string;
      change_reason?: string;
      changed_by: string;
      requires_attention?: boolean;
      color_code?: string;
    }) => {
      const { data, error } = await supabase
        .from('flight_changes_log')
        .insert({
          ...changeData,
          requires_attention: changeData.requires_attention || false,
          color_code: changeData.color_code || 'blue'
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['flight-changes', variables.flight_id] });
      toast.success('Modifica registrata');
    },
    onError: (error) => {
      toast.error('Errore registrazione modifica: ' + error.message);
    }
  });
};
