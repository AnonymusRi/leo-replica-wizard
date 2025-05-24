
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Flight } from '@/types/database';

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
