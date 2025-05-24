
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface OpsChecklist {
  id: string;
  name: string;
  description?: string;
  checklist_type: string;
  flight_id?: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface OpsChecklistItem {
  id: string;
  checklist_id?: string;
  item_text: string;
  is_required: boolean;
  sort_order: number;
  checklist_section: string;
  attach_to: string;
  sales_ops: string;
  visible_on_crew_app: boolean;
  auto_add_to_log: boolean;
  cql_condition?: string;
  due_dates?: string;
  email_template_id?: string;
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
      return data as OpsChecklist[];
    }
  });
};

export const useOpsChecklistItems = (checklistId?: string) => {
  return useQuery({
    queryKey: ['ops-checklist-items', checklistId],
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
      return data as OpsChecklistItem[];
    },
    enabled: !!checklistId
  });
};

export const useFlightChecklistProgress = (flightId?: string) => {
  return useQuery({
    queryKey: ['flight-checklist-progress', flightId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('quote_checklist_progress')
        .select(`
          *,
          checklist_items:checklist_item_id(*)
        `)
        .eq('quote_id', flightId)
        .order('created_at');
      
      if (error) throw error;
      return data;
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
    }) => {
      const { data, error } = await supabase
        .from('quote_checklist_progress')
        .upsert({
          quote_id: progressData.flight_id,
          checklist_item_id: progressData.checklist_item_id,
          is_completed: progressData.is_completed,
          completed_by: progressData.completed_by,
          notes: progressData.notes,
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
