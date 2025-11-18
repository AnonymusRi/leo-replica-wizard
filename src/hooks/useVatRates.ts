
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface VatRate {
  id: string;
  country_code: string;
  country_name: string;
  vat_rate: number;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export const useVatRates = () => {
  return useQuery({
    queryKey: ['vat-rates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vat_rates')
        .select('*')
        .order('country_name');
      
      if (error) throw error;
      return data as VatRate[];
    }
  });
};

export const useCreateVatRate = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (vatRateData: Omit<VatRate, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('vat_rates')
        .insert(vatRateData)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vat-rates'] });
      toast.success('VAT rate created successfully');
    },
    onError: (error) => {
      toast.error('Failed to create VAT rate: ' + error.message);
    }
  });
};
