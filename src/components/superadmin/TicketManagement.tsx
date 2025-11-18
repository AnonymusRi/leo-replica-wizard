
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from "lucide-react";
import { useSupportTickets } from "@/hooks/useSupportTickets";
import { NewTicketModal } from "./modals/NewTicketModal";
import { TicketDetailModal } from "./modals/TicketDetailModal";
import { TicketStatsCards } from "./tickets/TicketStatsCards";
import { TicketTabContent } from "./tickets/TicketTabContent";

export const TicketManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showNewTicketModal, setShowNewTicketModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  const { data: tickets = [], isLoading } = useSupportTickets();

  const filteredTickets = tickets.filter(ticket => 
    ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.ticket_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openTickets = filteredTickets.filter(t => t.status === 'open');
  const inProgressTickets = filteredTickets.filter(t => t.status === 'in_progress');
  const resolvedTickets = filteredTickets.filter(t => t.status === 'resolved');

  if (isLoading) {
    return <div>Caricamento ticket...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Gestione Ticket</h1>
        <Button onClick={() => setShowNewTicketModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Nuovo Ticket
        </Button>
      </div>

      <TicketStatsCards
        openTickets={openTickets.length}
        inProgressTickets={inProgressTickets.length}
        resolvedTickets={resolvedTickets.length}
        totalTickets={tickets.length}
      />

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">Tutti i Ticket</TabsTrigger>
          <TabsTrigger value="open">Aperti ({openTickets.length})</TabsTrigger>
          <TabsTrigger value="in_progress">In Lavorazione ({inProgressTickets.length})</TabsTrigger>
          <TabsTrigger value="resolved">Risolti ({resolvedTickets.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <TicketTabContent
            title="Tutti i Ticket"
            description="Gestisci tutti i ticket di supporto"
            tickets={filteredTickets}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onViewTicket={setSelectedTicket}
          />
        </TabsContent>

        <TabsContent value="open">
          <TicketTabContent
            title="Ticket Aperti"
            description="Ticket che richiedono attenzione immediata"
            tickets={openTickets}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onViewTicket={setSelectedTicket}
          />
        </TabsContent>

        <TabsContent value="in_progress">
          <TicketTabContent
            title="Ticket in Lavorazione"
            description="Ticket attualmente in fase di risoluzione"
            tickets={inProgressTickets}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onViewTicket={setSelectedTicket}
          />
        </TabsContent>

        <TabsContent value="resolved">
          <TicketTabContent
            title="Ticket Risolti"
            description="Ticket che sono stati risolti di recente"
            tickets={resolvedTickets}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onViewTicket={setSelectedTicket}
          />
        </TabsContent>
      </Tabs>

      <NewTicketModal 
        open={showNewTicketModal} 
        onOpenChange={setShowNewTicketModal} 
      />

      {selectedTicket && (
        <TicketDetailModal 
          ticketId={selectedTicket}
          open={!!selectedTicket}
          onOpenChange={() => setSelectedTicket(null)}
        />
      )}
    </div>
  );
};
