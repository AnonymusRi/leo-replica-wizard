
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
      
      if (error) {
        console.error('Error fetching crew assignments:', error);
        throw error;
      }
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
      console.log('Assigning crew to flight with data:', assignmentData);
      
      // Validate required fields
      if (!assignmentData.flight_id || !assignmentData.crew_member_id || !assignmentData.position) {
        throw new Error('Campi obbligatori mancanti: flight_id, crew_member_id, position');
      }

      // Prepare data for insertion, converting dates to ISO format
      const insertData: any = {
        flight_id: assignmentData.flight_id,
        crew_member_id: assignmentData.crew_member_id,
        position: assignmentData.position,
        assigned_by: assignmentData.assigned_by || null,
        notes: assignmentData.notes || null,
        ftl_compliant: true,
        airport_recency_valid: true,
        currency_valid: true,
        certificates_valid: true,
        passport_valid: true,
        visa_valid: true
      };

      // Convert time strings to ISO format if provided
      if (assignmentData.reporting_time) {
        insertData.reporting_time = new Date(assignmentData.reporting_time).toISOString();
      }
      if (assignmentData.duty_start_time) {
        insertData.duty_start_time = new Date(assignmentData.duty_start_time).toISOString();
      }
      if (assignmentData.duty_end_time) {
        insertData.duty_end_time = new Date(assignmentData.duty_end_time).toISOString();
      }

      console.log('Prepared insert data:', insertData);
      
      const { data, error } = await supabase
        .from('crew_flight_assignments')
        .insert([insertData])
        .select()
        .single();
      
      if (error) {
        console.error('Database error assigning crew:', error);
        console.error('Error details:', error.details, error.hint, error.message);
        throw new Error(`Errore database: ${error.message}`);
      }
      
      console.log('Crew assigned successfully:', data);
      return data;
    },
    onSuccess: (data, variables) => {
      console.log('Crew assignment successful, invalidating queries');
      queryClient.invalidateQueries({ queryKey: ['crew-flight-assignments', variables.flight_id] });
      queryClient.invalidateQueries({ queryKey: ['crew-flight-assignments'] });
      toast.success('Crew assegnato al volo con successo');
    },
    onError: (error: any) => {
      console.error('Error in crew assignment mutation:', error);
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
      console.log('Updating crew assignment:', updateData);
      
      const { data, error } = await supabase
        .from('crew_flight_assignments')
        .update({
          flight_time_hours: updateData.flight_time_hours,
          duty_time_hours: updateData.duty_time_hours,
          rest_time_hours: updateData.rest_time_hours,
          ftl_compliant: updateData.ftl_compliant,
          ftl_notes: updateData.ftl_notes,
          notes: updateData.notes
        })
        .eq('id', updateData.id)
        .select()
        .single();
      
      if (error) {
        console.error('Database error updating crew assignment:', error);
        throw error;
      }
      
      console.log('Crew assignment updated successfully:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crew-flight-assignments'] });
      toast.success('Assegnazione crew aggiornata');
    },
    onError: (error: any) => {
      console.error('Error in crew assignment update mutation:', error);
      toast.error('Errore aggiornamento: ' + error.message);
    }
  });
};
