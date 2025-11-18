
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Settings, MessageSquare } from "lucide-react";

interface TicketStatsCardsProps {
  openTickets: number;
  inProgressTickets: number;
  resolvedTickets: number;
  totalTickets: number;
}

export const TicketStatsCards = ({ 
  openTickets, 
  inProgressTickets, 
  resolvedTickets, 
  totalTickets 
}: TicketStatsCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Ticket Aperti</p>
              <p className="text-2xl font-bold text-red-600">{openTickets}</p>
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
              <p className="text-2xl font-bold text-yellow-600">{inProgressTickets}</p>
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
              <p className="text-2xl font-bold text-green-600">{resolvedTickets}</p>
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
              <p className="text-2xl font-bold text-blue-600">{totalTickets}</p>
            </div>
            <MessageSquare className="w-8 h-8 text-blue-600" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
