
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AircraftTechnicalData } from '@/types/aircraft';
import { toast } from 'sonner';

export const useAircraftTechnicalData = () => {
  return useQuery({
    queryKey: ['aircraft-technical-data'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('aircraft_technical_data')
        .select(`
          *,
          aircraft:aircraft(*)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as AircraftTechnicalData[];
    }
  });
};

export const useAircraftTechnicalDataByAircraft = (aircraftId: string) => {
  return useQuery({
    queryKey: ['aircraft-technical-data', aircraftId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('aircraft_technical_data')
        .select(`
          *,
          aircraft:aircraft(*)
        `)
        .eq('aircraft_id', aircraftId)
        .single();
      
      if (error) throw error;
      return data as AircraftTechnicalData;
    },
    enabled: !!aircraftId
  });
};

export const useUpdateAircraftTechnicalData = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...data }: Partial<AircraftTechnicalData> & { id: string }) => {
      const { data: result, error } = await supabase
        .from('aircraft_technical_data')
        .update(data)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['aircraft-technical-data'] });
      toast.success('Aircraft technical data updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update aircraft technical data: ' + error.message);
    }
  });
};
