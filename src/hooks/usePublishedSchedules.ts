
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { PublishedSchedule } from '@/types/database';

export const usePublishedSchedules = () => {
  return useQuery({
    queryKey: ['published-schedules'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('published_schedules')
        .select(`
          *,
          schedule_version:schedule_versions(*),
          flight:flights(
            *,
            aircraft:aircraft(*),
            client:clients(*)
          )
        `)
        .order('published_at', { ascending: false });
      
      if (error) throw error;
      return data as PublishedSchedule[];
    }
  });
};
