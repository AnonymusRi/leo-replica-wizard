
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Flight } from '@/types/database';
import { toast } from 'sonner';

export const useFlights = (limit: number = 50, offset: number = 0) => {
  return useQuery({
    queryKey: ['flights', limit, offset],
    queryFn: async () => {
      const { data, error, count } = await supabase
        .from('flights')
        .select(`
          *,
          aircraft:aircraft(*),
          client:clients(*),
          flight_assignments:flight_assignments(
            *,
            crew_member:crew_members(*)
          ),
          flight_legs:flight_legs(*),
          schedule_changes:schedule_changes(*)
        `, { count: 'exact' })
        .order('departure_time', { ascending: false })
        .range(offset, offset + limit - 1);
      
      if (error) throw error;
      return { data: data as Flight[], count: count || 0 };
    }
  });
};

export const useFlightById = (id: string) => {
  return useQuery({
    queryKey: ['flight', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('flights')
        .select(`
          *,
          aircraft:aircraft(*),
          client:clients(*),
          flight_assignments:flight_assignments(
            *,
            crew_member:crew_members(*)
          ),
          flight_legs:flight_legs(*),
          schedule_changes:schedule_changes(*)
        `)
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data as Flight;
    },
    enabled: !!id
  });
};

export const useFlightsByDateRange = (startDate: string, endDate: string) => {
  return useQuery({
    queryKey: ['flights', 'range', startDate, endDate],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('flights')
        .select(`
          *,
          aircraft:aircraft(*),
          client:clients(*),
          flight_assignments:flight_assignments(
            *,
            crew_member:crew_members(*)
          )
        `)
        .gte('departure_time', startDate)
        .lte('departure_time', endDate)
        .order('departure_time');
      
      if (error) throw error;
      return data as Flight[];
    },
    enabled: !!startDate && !!endDate
  });
};

export const useFlightsByAircraft = (aircraftId: string) => {
  return useQuery({
    queryKey: ['flights', 'aircraft', aircraftId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('flights')
        .select(`
          *,
          aircraft:aircraft(*),
          client:clients(*)
        `)
        .eq('aircraft_id', aircraftId)
        .order('departure_time', { ascending: false });
      
      if (error) throw error;
      return data as Flight[];
    },
    enabled: !!aircraftId
  });
};

export const useCreateFlight = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (flightData: {
      flight_number: string;
      aircraft_id?: string | null;
      client_id?: string | null;
      departure_airport: string;
      arrival_airport: string;
      departure_time: string;
      arrival_time: string;
      passenger_count?: number;
      status: 'scheduled' | 'active' | 'completed' | 'cancelled' | 'delayed';
      notes?: string;
    }) => {
      const { data, error } = await supabase
        .from('flights')
        .insert(flightData)
        .select(`
          *,
          aircraft:aircraft(*),
          client:clients(*)
        `)
        .single();
      
      if (error) throw error;
      return data as Flight;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['flights'] });
      toast.success('Flight created successfully');
    },
    onError: (error) => {
      toast.error('Failed to create flight: ' + error.message);
    }
  });
};

export const useUpdateFlight = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...flightData }: Partial<Flight> & { id: string }) => {
      const { data, error } = await supabase
        .from('flights')
        .update(flightData)
        .eq('id', id)
        .select(`
          *,
          aircraft:aircraft(*),
          client:clients(*)
        `)
        .single();
      
      if (error) throw error;
      return data as Flight;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['flights'] });
      toast.success('Flight updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update flight: ' + error.message);
    }
  });
};

export const useDeleteFlight = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('flights')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['flights'] });
      toast.success('Flight deleted successfully');
    },
    onError: (error) => {
      toast.error('Failed to delete flight: ' + error.message);
    }
  });
};
