
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useQuoteFlightLinks = () => {
  return useQuery({
    queryKey: ['quote-flight-links'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('quote_flight_links')
        .select(`
          *,
          quote:quotes(*),
          flight:flights(*)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });
};

export const useLinkQuoteToFlight = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (linkData: {
      quote_id: string;
      flight_id: string;
      notes?: string;
      linked_by?: string;
    }) => {
      const { data, error } = await supabase
        .from('quote_flight_links')
        .insert([linkData])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quote-flight-links'] });
      toast.success('Quote collegato al volo con successo');
    },
    onError: (error) => {
      toast.error('Errore nel collegamento: ' + error.message);
    }
  });
};
