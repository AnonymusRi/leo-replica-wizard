
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface SyncStatus {
  id: string;
  entity_id: string;
  entity_type: string;
  source_module: string;
  target_module: string;
  last_sync_at?: string;
  sync_status: 'pending' | 'syncing' | 'completed' | 'failed';
  sync_data?: any;
  error_details?: string;
  created_at: string;
  updated_at: string;
}

export const useSyncStatus = (entityId?: string, entityType?: string) => {
  return useQuery({
    queryKey: ['sync-status', entityId, entityType],
    queryFn: async () => {
      let query = supabase
        .from('sync_status')
        .select('*')
        .order('updated_at', { ascending: false });
      
      if (entityId) {
        query = query.eq('entity_id', entityId);
      }
      
      if (entityType) {
        query = query.eq('entity_type', entityType);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data as SyncStatus[];
    },
    enabled: !!(entityId && entityType)
  });
};

export const useCreateSyncRecord = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (syncData: Omit<SyncStatus, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('sync_status')
        .insert(syncData)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sync-status'] });
    }
  });
};

export const useUpdateSyncStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({
      syncId,
      status,
      syncData,
      errorDetails
    }: {
      syncId: string;
      status: 'pending' | 'syncing' | 'completed' | 'failed';
      syncData?: any;
      errorDetails?: string;
    }) => {
      const updateData: any = {
        sync_status: status,
        last_sync_at: new Date().toISOString()
      };
      
      if (syncData) updateData.sync_data = syncData;
      if (errorDetails) updateData.error_details = errorDetails;
      
      const { data, error } = await supabase
        .from('sync_status')
        .update(updateData)
        .eq('id', syncId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sync-status'] });
    }
  });
};
