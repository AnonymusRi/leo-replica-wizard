
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Quote } from '@/types/quote';
import { toast } from 'sonner';

export const useQuotes = () => {
  return useQuery({
    queryKey: ['quotes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('quotes')
        .select(`
          *,
          client:clients(company_name, contact_person)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Quote[];
    }
  });
};

export const useQuote = (id: string) => {
  return useQuery({
    queryKey: ['quote', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('quotes')
        .select(`
          *,
          client:clients(company_name, contact_person)
        `)
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data as Quote;
    }
  });
};

export const useCreateQuote = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (quote: Omit<Quote, 'id' | 'created_at' | 'updated_at' | 'client'>) => {
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
      toast.success('Quote created successfully');
    },
    onError: (error) => {
      toast.error('Failed to create quote: ' + error.message);
    }
  });
};

export const useUpdateQuote = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...quote }: Partial<Quote> & { id: string }) => {
      const { data, error } = await supabase
        .from('quotes')
        .update(quote)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotes'] });
      toast.success('Quote updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update quote: ' + error.message);
    }
  });
};

export const useDeleteQuote = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('quotes')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotes'] });
      toast.success('Quote deleted successfully');
    },
    onError: (error) => {
      toast.error('Failed to delete quote: ' + error.message);
    }
  });
};
