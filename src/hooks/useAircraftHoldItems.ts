
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AircraftHoldItem } from '@/types/aircraft';
import { toast } from 'sonner';

export const useAircraftHoldItems = () => {
  return useQuery({
    queryKey: ['aircraft-hold-items'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('aircraft_hold_items')
        .select(`
          *,
          aircraft:aircraft(*)
        `)
        .order('date_applied', { ascending: false });
      
      if (error) throw error;
      return data as AircraftHoldItem[];
    }
  });
};

export const useAircraftHoldItemsByAircraft = (aircraftId: string) => {
  return useQuery({
    queryKey: ['aircraft-hold-items', aircraftId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('aircraft_hold_items')
        .select(`
          *,
          aircraft:aircraft(*)
        `)
        .eq('aircraft_id', aircraftId)
        .order('date_applied', { ascending: false });
      
      if (error) throw error;
      return data as AircraftHoldItem[];
    },
    enabled: !!aircraftId
  });
};

export const useCreateAircraftHoldItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (holdItem: Omit<AircraftHoldItem, 'id' | 'created_at' | 'updated_at' | 'aircraft'>) => {
      const { data, error } = await supabase
        .from('aircraft_hold_items')
        .insert(holdItem)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['aircraft-hold-items'] });
      toast.success('Hold item created successfully');
    },
    onError: (error) => {
      toast.error('Failed to create hold item: ' + error.message);
    }
  });
};

export const useUpdateAircraftHoldItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...data }: Partial<AircraftHoldItem> & { id: string }) => {
      const { data: result, error } = await supabase
        .from('aircraft_hold_items')
        .update(data)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['aircraft-hold-items'] });
      toast.success('Hold item updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update hold item: ' + error.message);
    }
  });
};
