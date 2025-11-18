
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface CrewMessage {
  id: string;
  crew_member_id: string;
  sender_id?: string;
  sender_name: string;
  subject: string;
  content: string;
  message_type: 'personal' | 'official' | 'training' | 'schedule';
  is_read: boolean;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  created_at: string;
  read_at?: string;
}

export const useCrewMessages = (crewMemberId: string) => {
  return useQuery({
    queryKey: ['crew-messages', crewMemberId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('crew_messages')
        .select('*')
        .eq('crew_member_id', crewMemberId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as CrewMessage[];
    },
    enabled: !!crewMemberId
  });
};

export const useUnreadMessagesCount = (crewMemberId: string) => {
  return useQuery({
    queryKey: ['unread-messages-count', crewMemberId],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('crew_messages')
        .select('*', { count: 'exact', head: true })
        .eq('crew_member_id', crewMemberId)
        .eq('is_read', false);
      
      if (error) throw error;
      return count || 0;
    },
    enabled: !!crewMemberId
  });
};

export const useMarkMessageAsRead = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (messageId: string) => {
      const { data, error } = await supabase
        .from('crew_messages')
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq('id', messageId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crew-messages'] });
      queryClient.invalidateQueries({ queryKey: ['unread-messages-count'] });
    }
  });
};
