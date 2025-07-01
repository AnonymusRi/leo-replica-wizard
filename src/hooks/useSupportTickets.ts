
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface SupportTicket {
  id: string;
  ticket_number: string;
  user_id?: string;
  organization_id?: string;
  title: string;
  description: string;
  category: 'bug_report' | 'feature_request' | 'technical_support' | 'billing';
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  assigned_to?: string;
  created_at: string;
  updated_at: string;
  resolved_at?: string;
  attachments?: any[];
  target_organization_id?: string;
  is_general_announcement?: boolean;
  created_by_super_admin?: boolean;
}

export interface TicketComment {
  id: string;
  ticket_id: string;
  user_id?: string;
  content: string;
  is_internal: boolean;
  created_at: string;
  attachments?: any[];
}

export interface TicketOrganizationTarget {
  id: string;
  ticket_id: string;
  organization_id: string;
  created_at: string;
}

export const useSupportTickets = () => {
  return useQuery({
    queryKey: ['support-tickets'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('support_tickets')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return (data || []) as SupportTicket[];
    }
  });
};

export const useCreateTicket = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      ticket, 
      targetOrganizations 
    }: { 
      ticket: Partial<SupportTicket>; 
      targetOrganizations?: string[]; 
    }) => {
      // Assicuriamoci che i campi obbligatori siano presenti
      const ticketData = {
        title: ticket.title!,
        description: ticket.description!,
        category: ticket.category!,
        priority: ticket.priority || 'medium',
        status: ticket.status || 'open',
        is_general_announcement: ticket.is_general_announcement || false,
        // Inseriamo solo i campi che esistono nella tabella DB
        ...(ticket.organization_id && { organization_id: ticket.organization_id }),
        ...(ticket.user_id && { user_id: ticket.user_id }),
        ...(ticket.assigned_to && { assigned_to: ticket.assigned_to }),
        ...(ticket.target_organization_id && { target_organization_id: ticket.target_organization_id }),
        ...(ticket.attachments && { attachments: ticket.attachments }),
      };

      const { data: newTicket, error } = await supabase
        .from('support_tickets')
        .insert(ticketData)
        .select()
        .single();
      
      if (error) throw error;

      // Se ci sono organizzazioni target specifiche, aggiungile alla tabella di mapping
      if (targetOrganizations && targetOrganizations.length > 0 && !ticket.is_general_announcement) {
        const targetRecords = targetOrganizations.map(orgId => ({
          ticket_id: newTicket.id,
          organization_id: orgId
        }));

        const { error: targetError } = await supabase
          .from('ticket_organization_targets')
          .insert(targetRecords);

        if (targetError) throw targetError;
      }

      return newTicket;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['support-tickets'] });
      toast.success('Ticket creato con successo');
    },
    onError: (error: any) => {
      toast.error('Errore creazione ticket: ' + error.message);
    }
  });
};

export const useUpdateTicket = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<SupportTicket> }) => {
      const { data, error } = await supabase
        .from('support_tickets')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['support-tickets'] });
      toast.success('Ticket aggiornato con successo');
    },
    onError: (error: any) => {
      toast.error('Errore aggiornamento ticket: ' + error.message);
    }
  });
};

export const useTicketComments = (ticketId: string) => {
  return useQuery({
    queryKey: ['ticket-comments', ticketId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ticket_comments')
        .select('*')
        .eq('ticket_id', ticketId)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      return (data || []) as TicketComment[];
    },
    enabled: !!ticketId
  });
};

export const useCreateComment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (comment: Partial<TicketComment>) => {
      const { data, error } = await supabase
        .from('ticket_comments')
        .insert(comment)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ['ticket-comments', data.ticket_id] });
      toast.success('Commento aggiunto con successo');
    },
    onError: (error: any) => {
      toast.error('Errore aggiunta commento: ' + error.message);
    }
  });
};
