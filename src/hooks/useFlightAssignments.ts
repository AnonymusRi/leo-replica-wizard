
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { FlightAssignment } from '@/types/database';
import { toast } from 'sonner';

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

export const useFlightAssignmentsByCrew = (crewMemberId: string) => {
  return useQuery({
    queryKey: ['flight-assignments', 'crew', crewMemberId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('flight_assignments')
        .select(`
          *,
          flight:flights(*)
        `)
        .eq('crew_member_id', crewMemberId)
        .order('assigned_at', { ascending: false });
      
      if (error) throw error;
      return data as FlightAssignment[];
    },
    enabled: !!crewMemberId
  });
};

export const useUpcomingAssignments = (crewMemberId?: string) => {
  return useQuery({
    queryKey: ['upcoming-assignments', crewMemberId],
    queryFn: async () => {
      let query = supabase
        .from('flight_assignments')
        .select(`
          *,
          flight:flights(*),
          crew_member:crew_members(*)
        `)
        .gte('flight.departure_time', new Date().toISOString())
        .order('flight.departure_time');
        
      if (crewMemberId) {
        query = query.eq('crew_member_id', crewMemberId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data as FlightAssignment[];
    }
  });
};

export const useCreateFlightAssignment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (assignmentData: Omit<FlightAssignment, 'id' | 'assigned_at' | 'created_at' | 'flight' | 'crew_member'>) => {
      const { data, error } = await supabase
        .from('flight_assignments')
        .insert(assignmentData)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['flight-assignments'] });
      queryClient.invalidateQueries({ queryKey: ['upcoming-assignments'] });
      toast.success('Crew member assigned to flight successfully');
    },
    onError: (error) => {
      toast.error('Failed to assign crew member: ' + error.message);
    }
  });
};

export const useUpdateFlightAssignment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...assignmentData }: Partial<FlightAssignment> & { id: string }) => {
      const { data, error } = await supabase
        .from('flight_assignments')
        .update(assignmentData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['flight-assignments'] });
      queryClient.invalidateQueries({ queryKey: ['upcoming-assignments'] });
      toast.success('Flight assignment updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update flight assignment: ' + error.message);
    }
  });
};

export const useDeleteFlightAssignment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('flight_assignments')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['flight-assignments'] });
      queryClient.invalidateQueries({ queryKey: ['upcoming-assignments'] });
      toast.success('Flight assignment removed successfully');
    },
    onError: (error) => {
      toast.error('Failed to remove flight assignment: ' + error.message);
    }
  });
};
