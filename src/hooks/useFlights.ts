
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Flight } from '@/types/database';

export const useFlights = () => {
  return useQuery({
    queryKey: ['flights'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('flights')
        .select(`
          *,
          aircraft:aircraft_id(tail_number, aircraft_type),
          client:client_id(company_name, contact_person)
        `)
        .order('departure_time', { ascending: true });
      
      if (error) throw error;
      return data as Flight[];
    }
  });
};

export const useCreateFlight = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (flight: Omit<Flight, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('flights')
        .insert([flight])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['flights'] });
    }
  });
};
