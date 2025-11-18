
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { OilConsumptionRecord } from '@/types/aircraft';
import { toast } from 'sonner';

export const useOilConsumptionRecords = () => {
  return useQuery({
    queryKey: ['oil-consumption-records'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('oil_consumption_records')
        .select(`
          *,
          aircraft:aircraft(*)
        `)
        .order('flight_date', { ascending: false });
      
      if (error) throw error;
      return data as OilConsumptionRecord[];
    }
  });
};

export const useOilConsumptionByAircraft = (aircraftId: string) => {
  return useQuery({
    queryKey: ['oil-consumption-records', aircraftId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('oil_consumption_records')
        .select(`
          *,
          aircraft:aircraft(*)
        `)
        .eq('aircraft_id', aircraftId)
        .order('flight_date', { ascending: false });
      
      if (error) throw error;
      return data as OilConsumptionRecord[];
    },
    enabled: !!aircraftId
  });
};

export const useCreateOilConsumptionRecord = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (record: Omit<OilConsumptionRecord, 'id' | 'created_at' | 'aircraft'>) => {
      const { data, error } = await supabase
        .from('oil_consumption_records')
        .insert(record)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['oil-consumption-records'] });
      toast.success('Oil consumption record created successfully');
    },
    onError: (error) => {
      toast.error('Failed to create oil consumption record: ' + error.message);
    }
  });
};
