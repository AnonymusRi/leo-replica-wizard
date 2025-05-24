
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface WorkflowRule {
  id: string;
  name: string;
  description?: string;
  trigger_module: string;
  trigger_event: string;
  target_module: string;
  target_action: string;
  conditions?: any;
  parameters?: any;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface WorkflowExecution {
  id: string;
  workflow_rule_id: string;
  entity_id: string;
  entity_type: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  result?: any;
  error_message?: string;
  executed_at: string;
  completed_at?: string;
}

export const useWorkflowRules = () => {
  return useQuery({
    queryKey: ['workflow-rules'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('workflow_rules')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as WorkflowRule[];
    }
  });
};

export const useExecuteWorkflow = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      triggerModule, 
      triggerEvent, 
      entityId, 
      entityType,
      data 
    }: {
      triggerModule: string;
      triggerEvent: string;
      entityId: string;
      entityType: string;
      data?: any;
    }) => {
      // Find matching workflow rules
      const { data: rules, error: rulesError } = await supabase
        .from('workflow_rules')
        .select('*')
        .eq('trigger_module', triggerModule)
        .eq('trigger_event', triggerEvent)
        .eq('is_active', true);
      
      if (rulesError) throw rulesError;
      
      // Execute each matching rule
      const executions = await Promise.all(
        rules.map(async (rule) => {
          const { data: execution, error } = await supabase
            .from('workflow_executions')
            .insert({
              workflow_rule_id: rule.id,
              entity_id: entityId,
              entity_type: entityType,
              status: 'pending'
            })
            .select()
            .single();
          
          if (error) throw error;
          return execution;
        })
      );
      
      return executions;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflow-executions'] });
      toast.success('Workflow eseguiti con successo');
    },
    onError: (error) => {
      toast.error('Errore esecuzione workflow: ' + error.message);
    }
  });
};
