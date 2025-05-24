
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Quote } from '@/types/database';

export const useQuotes = () => {
  return useQuery({
    queryKey: ['quotes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('quotes')
        .select(`
          *,
          client:client_id(company_name, contact_person)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Quote[];
    }
  });
};

export const useCreateQuote = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (quote: Omit<Quote, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('quotes')
        .insert([quote])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotes'] });
    }
  });
};
