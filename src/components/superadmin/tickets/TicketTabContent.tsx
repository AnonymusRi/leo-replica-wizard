
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SupportTicket } from "@/hooks/useSupportTickets";
import { TicketSearchBar } from "./TicketSearchBar";
import { TicketTable } from "./TicketTable";

interface TicketTabContentProps {
  title: string;
  description: string;
  tickets: SupportTicket[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onViewTicket: (ticketId: string) => void;
}

export const TicketTabContent = ({ 
  title, 
  description, 
  tickets, 
  searchTerm, 
  onSearchChange, 
  onViewTicket 
}: TicketTabContentProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <TicketSearchBar 
          searchTerm={searchTerm} 
          onSearchChange={onSearchChange} 
        />
        <TicketTable 
          tickets={tickets} 
          onViewTicket={onViewTicket} 
        />
      </CardContent>
    </Card>
  );
};
