
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useUpdateTicket, useCreateComment, useTicketComments } from "@/hooks/useSupportTickets";
import { MessageSquare } from "lucide-react";

interface TicketDetailModalProps {
  ticketId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const TicketDetailModal = ({ ticketId, open, onOpenChange }: TicketDetailModalProps) => {
  const [newComment, setNewComment] = useState("");
  const [statusUpdate, setStatusUpdate] = useState("");

  const { data: ticket } = useQuery({
    queryKey: ['ticket-detail', ticketId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('support_tickets')
        .select('*')
        .eq('id', ticketId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!ticketId
  });

  const { data: comments = [] } = useTicketComments(ticketId);
  const updateTicketMutation = useUpdateTicket();
  const createCommentMutation = useCreateComment();

  const handleStatusUpdate = async () => {
    if (statusUpdate && ticket) {
      await updateTicketMutation.mutateAsync({
        id: ticketId,
        updates: { status: statusUpdate as any }
      });
      setStatusUpdate("");
    }
  };

  const handleAddComment = async () => {
    if (newComment.trim()) {
      await createCommentMutation.mutateAsync({
        ticket_id: ticketId,
        content: newComment,
        is_internal: false
      });
      setNewComment("");
    }
  };

  if (!ticket) {
    return null;
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return <Badge className="bg-red-100 text-red-800">Aperto</Badge>;
      case "in_progress":
        return <Badge className="bg-yellow-100 text-yellow-800">In Lavorazione</Badge>;
      case "resolved":
        return <Badge className="bg-green-100 text-green-800">Risolto</Badge>;
      case "closed":
        return <Badge variant="secondary">Chiuso</Badge>;
      default:
        return <Badge variant="outline">Sconosciuto</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "critical":
        return <Badge variant="destructive">Critica</Badge>;
      case "high":
        return <Badge className="bg-orange-100 text-orange-800">Alta</Badge>;
      case "medium":
        return <Badge className="bg-blue-100 text-blue-800">Media</Badge>;
      case "low":
        return <Badge className="bg-gray-100 text-gray-800">Bassa</Badge>;
      default:
        return <Badge variant="outline">Non definita</Badge>;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[600px] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            {ticket.ticket_number}: {ticket.title}
          </DialogTitle>
          <DialogDescription>
            Gestisci il ticket e aggiungi commenti
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Dettagli Ticket */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">Stato</h4>
              {getStatusBadge(ticket.status)}
            </div>
            <div>
              <h4 className="font-semibold mb-2">Priorità</h4>
              {getPriorityBadge(ticket.priority)}
            </div>
            <div>
              <h4 className="font-semibold mb-2">Categoria</h4>
              <Badge variant="outline">{ticket.category}</Badge>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Creato</h4>
              <p className="text-sm text-gray-600">
                {new Date(ticket.created_at).toLocaleString('it-IT')}
              </p>
            </div>
          </div>

          {/* Descrizione */}
          <div>
            <h4 className="font-semibold mb-2">Descrizione</h4>
            <div className="bg-gray-50 p-3 rounded-md">
              <p className="text-sm">{ticket.description}</p>
            </div>
          </div>

          <Separator />

          {/* Commenti */}
          <div>
            <h4 className="font-semibold mb-3">Commenti ({comments.length})</h4>
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {comments.map((comment) => (
                <div key={comment.id} className="bg-white border rounded-md p-3">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-medium text-sm">Utente</span>
                    <span className="text-xs text-gray-500">
                      {new Date(comment.created_at).toLocaleString('it-IT')}
                    </span>
                  </div>
                  <p className="text-sm">{comment.content}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Nuovo Commento */}
          <div className="space-y-3">
            <h4 className="font-semibold">Aggiungi Commento</h4>
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Scrivi un commento..."
              rows={3}
            />
            <Button 
              onClick={handleAddComment}
              disabled={!newComment.trim() || createCommentMutation.isPending}
            >
              {createCommentMutation.isPending ? "Invio..." : "Aggiungi Commento"}
            </Button>
          </div>

          <Separator />

          {/* Aggiorna Stato */}
          <div className="space-y-3">
            <h4 className="font-semibold">Aggiorna Stato</h4>
            <div className="flex gap-2">
              <Select value={statusUpdate} onValueChange={setStatusUpdate}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Seleziona nuovo stato" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="open">Aperto</SelectItem>
                  <SelectItem value="in_progress">In Lavorazione</SelectItem>
                  <SelectItem value="resolved">Risolto</SelectItem>
                  <SelectItem value="closed">Chiuso</SelectItem>
                </SelectContent>
              </Select>
              <Button 
                onClick={handleStatusUpdate}
                disabled={!statusUpdate || updateTicketMutation.isPending}
              >
                {updateTicketMutation.isPending ? "Aggiornamento..." : "Aggiorna"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
