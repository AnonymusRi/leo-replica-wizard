
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { FlightAssignment } from '@/types/database';

export const useFlightAssignments = () => {
  return useQuery({
    queryKey: ['flight-assignments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('flight_assignments')
        .select(`
          *,
          flight:flights(*),
          crew_member:crew_members(*)
        `)
        .order('assigned_at', { ascending: false });
      
      if (error) throw error;
      return data as FlightAssignment[];
    }
  });
};

export const useFlightAssignmentsByFlight = (flightId: string) => {
  return useQuery({
    queryKey: ['flight-assignments', flightId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('flight_assignments')
        .select(`
          *,
          crew_member:crew_members(*)
        `)
        .eq('flight_id', flightId)
        .order('position');
      
      if (error) throw error;
      return data as FlightAssignment[];
    },
    enabled: !!flightId
  });
};
