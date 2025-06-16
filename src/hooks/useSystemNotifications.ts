
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useSystemNotifications = (moduleTarget?: string) => {
  const queryClient = useQueryClient();

  const query = useQuery({
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
      return data || [];
    }
  });

  const markAsRead = useMutation({
    mutationFn: async (notificationId: string) => {
      const { error } = await supabase
        .from('system_notifications')
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq('id', notificationId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['system-notifications'] });
    }
  });

  const deleteNotification = useMutation({
    mutationFn: async (notificationId: string) => {
      const { error } = await supabase
        .from('system_notifications')
        .delete()
        .eq('id', notificationId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['system-notifications'] });
    }
  });

  return {
    ...query,
    markAsRead,
    deleteNotification
  };
};

export const useCreateNotification = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (notification: {
      module_source: string;
      module_target: string;
      notification_type: string;
      title: string;
      message: string;
      priority?: 'low' | 'medium' | 'high' | 'urgent';
      entity_type?: string;
      entity_id?: string;
    }) => {
      const { data, error } = await supabase
        .from('system_notifications')
        .insert([notification])
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
