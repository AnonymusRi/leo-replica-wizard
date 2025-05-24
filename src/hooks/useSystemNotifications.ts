
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface SystemNotification {
  id: string;
  module_source: string;
  module_target: string;
  notification_type: string;
  title: string;
  message: string;
  entity_id?: string;
  entity_type?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  is_read: boolean;
  created_at: string;
  read_at?: string;
  expires_at?: string;
}

export const useSystemNotifications = (moduleTarget?: string) => {
  return useQuery({
    queryKey: ['system-notifications', moduleTarget],
    queryFn: async () => {
      let query = supabase
        .from('system_notifications')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (moduleTarget) {
        query = query.eq('module_target', moduleTarget);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data as SystemNotification[];
    }
  });
};

export const useCreateNotification = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (notification: Omit<SystemNotification, 'id' | 'created_at' | 'is_read'>) => {
      const { data, error } = await supabase
        .from('system_notifications')
        .insert({
          ...notification,
          is_read: false
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['system-notifications'] });
    },
    onError: (error) => {
      toast.error('Errore creazione notifica: ' + error.message);
    }
  });
};

export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (notificationId: string) => {
      const { data, error } = await supabase
        .from('system_notifications')
        .update({ 
          is_read: true,
          read_at: new Date().toISOString()
        })
        .eq('id', notificationId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['system-notifications'] });
    }
  });
};
