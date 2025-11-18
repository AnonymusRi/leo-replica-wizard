
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface SalesChecklist {
  id: string;
  name: string;
  description?: string;
  is_default: boolean;
  checklist_type: string;
  created_at: string;
  updated_at: string;
}

export interface ChecklistItem {
  id: string;
  checklist_id?: string;
  item_text: string;
  is_required: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface QuoteChecklistProgress {
  id: string;
  quote_id?: string;
  checklist_item_id?: string;
  is_completed: boolean;
  completed_at?: string;
  completed_by?: string;
  notes?: string;
  created_at: string;
}

export const useSalesChecklists = () => {
  return useQuery({
    queryKey: ['sales-checklists'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sales_checklists')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data as SalesChecklist[];
    }
  });
};

export const useChecklistItems = (checklistId?: string) => {
  return useQuery({
    queryKey: ['checklist-items', checklistId],
    queryFn: async () => {
      let query = supabase
        .from('checklist_items')
        .select('*')
        .order('sort_order');
      
      if (checklistId) {
        query = query.eq('checklist_id', checklistId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data as ChecklistItem[];
    },
    enabled: !!checklistId
  });
};

export const useQuoteChecklistProgress = (quoteId?: string) => {
  return useQuery({
    queryKey: ['quote-checklist-progress', quoteId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('quote_checklist_progress')
        .select(`
          *,
          checklist_items:checklist_item_id(*)
        `)
        .eq('quote_id', quoteId)
        .order('created_at');
      
      if (error) throw error;
      return data;
    },
    enabled: !!quoteId
  });
};

export const useUpdateChecklistProgress = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (progressData: {
      quote_id: string;
      checklist_item_id: string;
      is_completed: boolean;
      completed_by?: string;
      notes?: string;
    }) => {
      const { data, error } = await supabase
        .from('quote_checklist_progress')
        .upsert({
          ...progressData,
          completed_at: progressData.is_completed ? new Date().toISOString() : null
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['quote-checklist-progress', variables.quote_id] });
      toast.success('Checklist updated');
    },
    onError: (error) => {
      toast.error('Failed to update checklist: ' + error.message);
    }
  });
};
