
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, AlertCircle, Plus, Search, Eye, Settings } from "lucide-react";
import { useSupportTickets } from "@/hooks/useSupportTickets";
import { NewTicketModal } from "./modals/NewTicketModal";
import { TicketDetailModal } from "./modals/TicketDetailModal";

export const TicketManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showNewTicketModal, setShowNewTicketModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  const { data: tickets = [], isLoading } = useSupportTickets();

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

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "bug_report": return "Bug Report";
      case "feature_request": return "Richiesta Funzionalità";
      case "technical_support": return "Supporto Tecnico";
      case "billing": return "Fatturazione";
      default: return category;
    }
  };

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

      {/* Statistiche */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ticket Aperti</p>
                <p className="text-2xl font-bold text-red-600">{openTickets.length}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">In Lavorazione</p>
                <p className="text-2xl font-bold text-yellow-600">{inProgressTickets.length}</p>
              </div>
              <Settings className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Risolti</p>
                <p className="text-2xl font-bold text-green-600">{resolvedTickets.length}</p>
              </div>
              <MessageSquare className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Totali</p>
                <p className="text-2xl font-bold text-blue-600">{tickets.length}</p>
              </div>
              <MessageSquare className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">Tutti i Ticket</TabsTrigger>
          <TabsTrigger value="open">Aperti ({openTickets.length})</TabsTrigger>
          <TabsTrigger value="in_progress">In Lavorazione ({inProgressTickets.length})</TabsTrigger>
          <TabsTrigger value="resolved">Risolti ({resolvedTickets.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>Tutti i Ticket</CardTitle>
              <CardDescription>
                Gestisci tutti i ticket di supporto
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2 mb-4">
                <Search className="w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Cerca ticket..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
              </div>

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
                  {filteredTickets.map((ticket) => (
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
                          onClick={() => setSelectedTicket(ticket.id)}
                        >
                          <Eye className="w-3 h-3" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="open">
          <Card>
            <CardHeader>
              <CardTitle>Ticket Aperti</CardTitle>
              <CardDescription>
                Ticket che richiedono attenzione immediata
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Stesso contenuto tabella ma filtrato per aperti */}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="in_progress">
          <Card>
            <CardHeader>
              <CardTitle>Ticket in Lavorazione</CardTitle>
              <CardDescription>
                Ticket attualmente in fase di risoluzione
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Stesso contenuto tabella ma filtrato per in lavorazione */}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resolved">
          <Card>
            <CardHeader>
              <CardTitle>Ticket Risolti</CardTitle>
              <CardDescription>
                Ticket che sono stati risolti di recente
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Stesso contenuto tabella ma filtrato per risolti */}
            </CardContent>
          </Card>
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
