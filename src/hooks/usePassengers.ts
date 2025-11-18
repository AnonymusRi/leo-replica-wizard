
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Passenger {
  id: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  passport_number?: string;
  passport_expiry?: string;
  nationality?: string;
  date_of_birth?: string;
  special_requirements?: string;
  created_at: string;
  updated_at: string;
}

export const usePassengers = () => {
  return useQuery({
    queryKey: ['passengers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('passengers')
        .select('*')
        .order('last_name', { ascending: true });
      
      if (error) throw error;
      return data as Passenger[];
    }
  });
};

export const useCreatePassenger = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (passengerData: Omit<Passenger, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('passengers')
        .insert(passengerData)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['passengers'] });
      toast.success('Passenger created successfully');
    },
    onError: (error) => {
      toast.error('Failed to create passenger: ' + error.message);
    }
  });
};
