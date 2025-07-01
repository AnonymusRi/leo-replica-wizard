
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye } from "lucide-react";
import { SupportTicket } from "@/hooks/useSupportTickets";
import { getStatusBadge, getPriorityBadge, getCategoryLabel } from "./TicketBadges";

interface TicketTableProps {
  tickets: SupportTicket[];
  onViewTicket: (ticketId: string) => void;
}

export const TicketTable = ({ tickets, onViewTicket }: TicketTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Numero</TableHead>
          <TableHead>Titolo</TableHead>
          <TableHead>Categoria</TableHead>
          <TableHead>Priorità</TableHead>
          <TableHead>Stato</TableHead>
          <TableHead>Creato</TableHead>
          <TableHead>Azioni</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tickets.map((ticket) => (
          <TableRow key={ticket.id}>
            <TableCell className="font-medium">
              {ticket.ticket_number}
            </TableCell>
            <TableCell>
              <div className="max-w-xs truncate">{ticket.title}</div>
            </TableCell>
            <TableCell>
              <Badge variant="outline">
                {getCategoryLabel(ticket.category)}
              </Badge>
            </TableCell>
            <TableCell>{getPriorityBadge(ticket.priority)}</TableCell>
            <TableCell>{getStatusBadge(ticket.status)}</TableCell>
            <TableCell>
              {new Date(ticket.created_at).toLocaleDateString('it-IT')}
            </TableCell>
            <TableCell>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onViewTicket(ticket.id)}
              >
                <Eye className="w-3 h-3" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
