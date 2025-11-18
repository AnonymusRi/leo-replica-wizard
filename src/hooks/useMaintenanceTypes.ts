
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { MaintenanceType } from '@/types/database';

export const useMaintenanceTypes = () => {
  return useQuery({
    queryKey: ['maintenance-types'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('maintenance_types')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data as MaintenanceType[];
    }
  });
};
