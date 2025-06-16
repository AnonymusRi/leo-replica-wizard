
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useAirportDirectory = () => {
  return useQuery({
    queryKey: ['airport-directory'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('airport_directory')
        .select('*')
        .order('airport_code');
      
      if (error) throw error;
      return data || [];
    }
  });
};
