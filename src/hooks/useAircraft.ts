
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Aircraft } from '@/types/database';

export const useAircraft = () => {
  return useQuery({
    queryKey: ['aircraft'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('aircraft')
        .select('*')
        .order('tail_number');
      
      if (error) throw error;
      return data as Aircraft[];
    }
  });
};
