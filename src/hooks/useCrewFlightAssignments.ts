
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface CrewFlightAssignment {
  id: string;
  flight_id?: string;
  crew_member_id?: string;
  position: string;
  reporting_time?: string;
  duty_start_time?: string;
  duty_end_time?: string;
  flight_time_hours?: number;
  duty_time_hours?: number;
  rest_time_hours?: number;
  ftl_compliant?: boolean;
  ftl_notes?: string;
  airport_recency_valid?: boolean;
  currency_valid?: boolean;
  certificates_valid?: boolean;
  passport_valid?: boolean;
  visa_valid?: boolean;
  assigned_at: string;
  assigned_by?: string;
  notes?: string;
  crew_members?: any;
}

export const useCrewFlightAssignments = (flightId?: string) => {
  return useQuery({
    queryKey: ['crew-flight-assignments', flightId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('crew_flight_assignments')
        .select(`
          *,
          crew_members(*)
        `)
        .eq('flight_id', flightId)
        .order('assigned_at');
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!flightId
  });
};

export const useAssignCrewToFlight = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (assignmentData: {
      flight_id: string;
      crew_member_id: string;
      position: string;
      reporting_time?: string;
      duty_start_time?: string;
      duty_end_time?: string;
      assigned_by?: string;
      notes?: string;
    }) => {
      const { data, error } = await supabase
        .from('crew_flight_assignments')
        .insert({
          ...assignmentData,
          ftl_compliant: true,
          airport_recency_valid: true,
          currency_valid: true,
          certificates_valid: true,
          passport_valid: true,
          visa_valid: true
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['crew-flight-assignments', variables.flight_id] });
      toast.success('Crew assegnato al volo');
    },
    onError: (error) => {
      toast.error('Errore assegnazione crew: ' + error.message);
    }
  });
};

export const useUpdateCrewAssignment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (updateData: {
      id: string;
      flight_time_hours?: number;
      duty_time_hours?: number;
      rest_time_hours?: number;
      ftl_compliant?: boolean;
      ftl_notes?: string;
      notes?: string;
    }) => {
      const { data, error } = await supabase
        .from('crew_flight_assignments')
        .update(updateData)
        .eq('id', updateData.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crew-flight-assignments'] });
      toast.success('Assegnazione crew aggiornata');
    },
    onError: (error) => {
      toast.error('Errore aggiornamento: ' + error.message);
    }
  });
};
