
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Message {
  id: string;
  quote_id?: string;
  sender_name: string;
  sender_email?: string;
  recipient_name?: string;
  recipient_email?: string;
  subject: string;
  content: string;
  message_type: 'client' | 'internal' | 'avinode';
  status: 'sent' | 'delivered' | 'read';
  is_internal: boolean;
  avinode_reference?: string;
  created_at: string;
  updated_at: string;
}

export const useMessages = (quoteId?: string) => {
  return useQuery({
    queryKey: ['messages', quoteId],
    queryFn: async () => {
      let query = supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (quoteId) {
        query = query.eq('quote_id', quoteId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data as Message[];
    }
  });
};

export const useCreateMessage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (messageData: Omit<Message, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('messages')
        .insert(messageData)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      toast.success('Message sent successfully');
    },
    onError: (error) => {
      toast.error('Failed to send message: ' + error.message);
    }
  });
};
