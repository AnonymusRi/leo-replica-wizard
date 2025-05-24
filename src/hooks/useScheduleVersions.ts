
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ScheduleVersion } from '@/types/database';

export const useScheduleVersions = () => {
  return useQuery({
    queryKey: ['schedule-versions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('schedule_versions')
        .select(`
          *,
          client:clients(*)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as ScheduleVersion[];
    }
  });
};

export const useActiveScheduleVersion = () => {
  return useQuery({
    queryKey: ['active-schedule-version'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('schedule_versions')
        .select(`
          *,
          client:clients(*)
        `)
        .eq('is_active', true)
        .single();
      
      if (error) throw error;
      return data as ScheduleVersion;
    }
  });
};
