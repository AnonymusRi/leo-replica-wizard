
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { FlightTimeLimit } from '@/types/crew';

export const useFlightTimeLimits = () => {
  return useQuery({
    queryKey: ['flight_time_limits'],
    queryFn: async (): Promise<FlightTimeLimit[]> => {
      const { data, error } = await supabase
        .from('flight_time_limits')
        .select('*')
        .order('regulation_name');
      
      if (error) {
        console.error('Error fetching flight time limits:', error);
        return [];
      }
      
      return data || [];
    }
  });
};
