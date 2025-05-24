
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface OpsChecklist {
  id: string;
  name: string;
  description?: string;
  checklist_type: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface OpsChecklistItem {
  id: string;
  checklist_id?: string;
  item_text: string;
  checklist_section: string;
  attach_to: string;
  sales_ops: string;
  visible_on_crew_app: boolean;
  auto_add_to_log: boolean;
  cql_condition?: string;
  due_dates?: string;
  email_template_id?: string;
  is_required: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface FlightChecklistProgress {
  id: string;
  flight_id?: string;
  checklist_item_id?: string;
  is_completed: boolean;
  completed_at?: string;
  completed_by?: string;
  notes?: string;
  status: string;
  color_code?: string;
  created_at: string;
}

export const useOpsChecklists = () => {
  return useQuery({
    queryKey: ['ops-checklists'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sales_checklists')
        .select('*')
        .eq('checklist_type', 'ops')
        .order('name');
      
      if (error) throw error;
      return data || [];
    }
  });
};

export const useOpsChecklistItems = (checklistId?: string) => {
  return useQuery({
    queryKey: ['ops-checklist-items', checklistId],
    queryFn: async () => {
      let query = supabase
        .from('ops_checklist_items')
        .select('*')
        .order('sort_order');
      
      if (checklistId) {
        query = query.eq('checklist_id', checklistId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!checklistId
  });
};

export const useFlightChecklistProgress = (flightId?: string) => {
  return useQuery({
    queryKey: ['flight-checklist-progress', flightId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('flight_checklist_progress')
        .select(`
          *,
          ops_checklist_items(*)
        `)
        .eq('flight_id', flightId)
        .order('created_at');
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!flightId
  });
};

export const useUpdateOpsChecklistProgress = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (progressData: {
      flight_id: string;
      checklist_item_id: string;
      is_completed: boolean;
      completed_by?: string;
      notes?: string;
      status?: string;
      color_code?: string;
    }) => {
      const { data, error } = await supabase
        .from('flight_checklist_progress')
        .upsert({
          flight_id: progressData.flight_id,
          checklist_item_id: progressData.checklist_item_id,
          is_completed: progressData.is_completed,
          completed_by: progressData.completed_by,
          notes: progressData.notes,
          status: progressData.status || (progressData.is_completed ? 'completed' : 'pending'),
          color_code: progressData.color_code || (progressData.is_completed ? 'green' : 'gray'),
          completed_at: progressData.is_completed ? new Date().toISOString() : null
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['flight-checklist-progress', variables.flight_id] });
      toast.success('Checklist OPS aggiornata');
    },
    onError: (error) => {
      toast.error('Errore aggiornamento checklist: ' + error.message);
    }
  });
};

export const useCreateOpsChecklistItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (itemData: {
      checklist_id: string;
      item_text: string;
      checklist_section: string;
      attach_to: string;
      sales_ops: string;
      visible_on_crew_app: boolean;
      auto_add_to_log: boolean;
      is_required: boolean;
      sort_order: number;
    }) => {
      const { data, error } = await supabase
        .from('ops_checklist_items')
        .insert(itemData)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ops-checklist-items'] });
      toast.success('Item checklist creato');
    },
    onError: (error) => {
      toast.error('Errore creazione item: ' + error.message);
    }
  });
};
