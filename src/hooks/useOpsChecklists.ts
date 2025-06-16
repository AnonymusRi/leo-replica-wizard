
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useOpsChecklists = () => {
  return useQuery({
    queryKey: ['ops-checklists'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ops_checklist_items')
        .select('*')
        .order('sort_order');
      
      if (error) throw error;
      
      // Group items by checklist_section
      const groupedData = data.reduce((acc: any, item: any) => {
        const section = item.checklist_section || 'ops';
        if (!acc[section]) {
          acc[section] = {
            id: section,
            name: section.charAt(0).toUpperCase() + section.slice(1),
            items: []
          };
        }
        acc[section].items.push(item);
        return acc;
      }, {});
      
      return Object.values(groupedData);
    }
  });
};

export const useFlightChecklistProgress = (flightId?: string) => {
  const queryClient = useQueryClient();
  
  const query = useQuery({
    queryKey: ['flight-checklist-progress', flightId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('flight_checklist_progress')
        .select('*')
        .eq('flight_id', flightId);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!flightId
  });

  const updateProgress = useMutation({
    mutationFn: async ({ itemId, completed, notes }: { itemId: string, completed: boolean, notes?: string }) => {
      const { data, error } = await supabase
        .from('flight_checklist_progress')
        .upsert({
          flight_id: flightId,
          checklist_item_id: itemId,
          is_completed: completed,
          completed_at: completed ? new Date().toISOString() : null,
          notes: notes
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['flight-checklist-progress', flightId] });
      toast.success('Progresso aggiornato');
    },
    onError: (error) => {
      toast.error('Errore nell\'aggiornamento: ' + error.message);
    }
  });

  return {
    ...query,
    mutate: updateProgress.mutate
  };
};
