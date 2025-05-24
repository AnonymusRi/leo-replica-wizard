
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Flight } from '@/types/database';
import { toast } from 'sonner';

export const useFlights = () => {
  return useQuery({
    queryKey: ['flights'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('flights')
        .select(`
          *,
          aircraft:aircraft(*),
          client:clients(*)
        `)
        .order('departure_time', { ascending: false });
      
      if (error) throw error;
      return data as Flight[];
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
          client:clients(*)
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
          client:clients(*)
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
