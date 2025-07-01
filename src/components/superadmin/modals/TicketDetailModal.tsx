
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useUpdateTicket, useCreateComment, useTicketComments, SupportTicket } from "@/hooks/useSupportTickets";
import { TicketDetailHeader } from "../tickets/TicketDetailHeader";
import { TicketDetailInfo } from "../tickets/TicketDetailInfo";
import { TicketDescription } from "../tickets/TicketDescription";
import { TicketComments } from "../tickets/TicketComments";
import { AddCommentForm } from "../tickets/AddCommentForm";
import { UpdateStatusForm } from "../tickets/UpdateStatusForm";

interface TicketDetailModalProps {
  ticketId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const TicketDetailModal = ({ ticketId, open, onOpenChange }: TicketDetailModalProps) => {
  const { data: ticket } = useQuery({
    queryKey: ['ticket-detail', ticketId],
    queryFn: async () => {
      // Using any type to bypass TypeScript errors until tables are created
      const { data, error } = await (supabase as any)
        .from('support_tickets')
        .select('*')
        .eq('id', ticketId)
        .single();
      
      if (error) throw error;
      return data as SupportTicket;
    },
    enabled: !!ticketId
  });

  const { data: comments = [] } = useTicketComments(ticketId);
  const updateTicketMutation = useUpdateTicket();
  const createCommentMutation = useCreateComment();

  const handleUpdateStatus = async (status: SupportTicket['status']) => {
    if (ticket) {
      await updateTicketMutation.mutateAsync({
        id: ticketId,
        updates: { status }
      });
    }
  };

  const handleAddComment = async (content: string) => {
    await createCommentMutation.mutateAsync({
      ticket_id: ticketId,
      content,
      is_internal: false
    });
  };

  if (!ticket) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[600px] overflow-y-auto">
        <TicketDetailHeader 
          ticketNumber={ticket.ticket_number} 
          title={ticket.title} 
        />

        <div className="space-y-6">
          <TicketDetailInfo
            status={ticket.status}
            priority={ticket.priority}
            category={ticket.category}
            createdAt={ticket.created_at}
          />

          <TicketDescription description={ticket.description} />

          <Separator />

          <TicketComments comments={comments} />

          <AddCommentForm 
            onAddComment={handleAddComment}
            isLoading={createCommentMutation.isPending}
          />

          <Separator />

          <UpdateStatusForm 
            onUpdateStatus={handleUpdateStatus}
            isLoading={updateTicketMutation.isPending}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
</TicketDetailModal>
