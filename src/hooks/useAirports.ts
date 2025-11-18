
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Airport } from '@/types/database';

export const useAirports = () => {
  return useQuery({
    queryKey: ['airports'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('airports')
        .select('*')
        .order('icao_code');
      
      if (error) throw error;
      return data as Airport[];
    }
  });
};

export const useAirportByCode = (code: string) => {
  return useQuery({
    queryKey: ['airport', code],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('airports')
        .select('*')
        .or(`icao_code.eq.${code},iata_code.eq.${code}`)
        .single();
      
      if (error) throw error;
      return data as Airport;
    },
    enabled: !!code
  });
};
