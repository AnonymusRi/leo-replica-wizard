
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface QuoteFlightLink {
  id: string;
  quote_id?: string;
  flight_id?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  linked_at: string;
  linked_by?: string;
  notes?: string;
  created_at: string;
  quote?: any;
  flight?: any;
}

export const useQuoteFlightLinks = (quoteId?: string, flightId?: string) => {
  return useQuery({
    queryKey: ['quote-flight-links', quoteId, flightId],
    queryFn: async () => {
      let query = supabase
        .from('quote_flight_links')
        .select(`
          *,
          quote:quotes(*),
          flight:flights(*)
        `)
        .order('created_at', { ascending: false });
      
      if (quoteId) {
        query = query.eq('quote_id', quoteId);
      }
      
      if (flightId) {
        query = query.eq('flight_id', flightId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data as QuoteFlightLink[];
    },
    enabled: !!(quoteId || flightId)
  });
};

export const useLinkQuoteToFlight = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({
      quoteId,
      flightId,
      linkedBy,
      notes
    }: {
      quoteId: string;
      flightId: string;
      linkedBy?: string;
      notes?: string;
    }) => {
      const { data, error } = await supabase
        .from('quote_flight_links')
        .insert({
          quote_id: quoteId,
          flight_id: flightId,
          status: 'pending',
          linked_by: linkedBy,
          notes: notes
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quote-flight-links'] });
      toast.success('Quote collegata al volo con successo');
    },
    onError: (error) => {
      toast.error('Errore collegamento: ' + error.message);
    }
  });
};

export const useUpdateQuoteFlightLink = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({
      linkId,
      status,
      notes
    }: {
      linkId: string;
      status?: 'pending' | 'confirmed' | 'cancelled';
      notes?: string;
    }) => {
      const updateData: any = {};
      if (status) updateData.status = status;
      if (notes) updateData.notes = notes;
      
      const { data, error } = await supabase
        .from('quote_flight_links')
        .update(updateData)
        .eq('id', linkId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quote-flight-links'] });
      toast.success('Collegamento aggiornato');
    }
  });
};
