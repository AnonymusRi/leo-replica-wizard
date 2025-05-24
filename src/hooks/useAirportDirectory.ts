
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface AirportDirectoryEntry {
  id: string;
  airport_code: string;
  airport_name: string;
  opening_hours?: any;
  available_services?: any;
  contact_info?: any;
  handling_companies?: any;
  customs_hours?: any;
  immigration_hours?: any;
  fuel_suppliers?: any;
  catering_suppliers?: any;
  notes?: string;
  last_updated: string;
  created_at: string;
}

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

export const useAirportDirectoryEntry = (airportCode?: string) => {
  return useQuery({
    queryKey: ['airport-directory', airportCode],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('airport_directory')
        .select('*')
        .eq('airport_code', airportCode)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
    enabled: !!airportCode
  });
};

export const useUpdateAirportDirectory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (entryData: {
      airport_code: string;
      airport_name: string;
      opening_hours?: any;
      available_services?: any;
      contact_info?: any;
      handling_companies?: any;
      customs_hours?: any;
      immigration_hours?: any;
      fuel_suppliers?: any;
      catering_suppliers?: any;
      notes?: string;
    }) => {
      const { data, error } = await supabase
        .from('airport_directory')
        .upsert({
          ...entryData,
          last_updated: new Date().toISOString()
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['airport-directory'] });
      toast.success('Directory aeroporto aggiornata');
    },
    onError: (error) => {
      toast.error('Errore aggiornamento directory: ' + error.message);
    }
  });
};
