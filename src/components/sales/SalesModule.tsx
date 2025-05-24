
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plane, 
  DollarSign, 
  Users, 
  Calendar,
  Filter,
  Plus,
  TrendingUp,
  Clock,
  MapPin,
  FileText,
  Loader2
} from "lucide-react";
import { QuoteModal } from "./QuoteModal";
import { ClientsView } from "./ClientsView";
import { BookingsView } from "./BookingsView";
import { useQuotes } from "@/hooks/useQuotes";
import { format } from "date-fns";

export const SalesModule = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const { data: quotes = [], isLoading, error } = useQuotes();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "expired": return "bg-red-100 text-red-800";
      case "cancelled": return "bg-gray-100 text-gray-800";
      default: return "bg-blue-100 text-blue-800";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-8">
        Errore nel caricamento dei preventivi: {error.message}
      </div>
    );
  }

  // Calculate stats from real data
  const totalQuotes = quotes.length;
  const pendingQuotes = quotes.filter(q => q.status === 'pending').length;
  const confirmedQuotes = quotes.filter(q => q.status === 'confirmed').length;
  const totalRevenue = quotes
    .filter(q => q.status === 'confirmed' && q.total_amount)
    .reduce((sum, q) => sum + (q.total_amount || 0), 0);

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-4 border-b bg-gray-50">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold flex items-center">
            <DollarSign className="w-5 h-5 mr-2 text-green-600" />
            Sales CRM
          </h2>
          <div className="flex items-center space-x-2">
            <Button size="sm" variant="outline">
              <Filter className="w-4 h-4 mr-1" />
              FILTER
            </Button>
            <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => setShowQuoteModal(true)}>
              <Plus className="w-4 h-4 mr-1" />
              NEW QUOTE
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="quotes">Quotes</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="clients">Clients</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Quotes</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalQuotes}</div>
                  <p className="text-xs text-muted-foreground">Preventivi totali</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Quotes</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">{pendingQuotes}</div>
                  <p className="text-xs text-muted-foreground">In attesa di risposta</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Confirmed Quotes</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{confirmedQuotes}</div>
                  <p className="text-xs text-muted-foreground">Confermati</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">€{totalRevenue.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">Ricavi confermati</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Quotes Table */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Quotes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b text-left">
                        <th className="pb-3 font-medium">Quote Number</th>
                        <th className="pb-3 font-medium">Client</th>
                        <th className="pb-3 font-medium">Route</th>
                        <th className="pb-3 font-medium">Passengers</th>
                        <th className="pb-3 font-medium">Value</th>
                        <th className="pb-3 font-medium">Status</th>
                        <th className="pb-3 font-medium">Created</th>
                      </tr>
                    </thead>
                    <tbody>
                      {quotes.slice(0, 10).map((quote) => (
                        <tr key={quote.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 font-medium text-blue-600">{quote.quote_number}</td>
                          <td className="py-3">{quote.client?.company_name || 'TBD'}</td>
                          <td className="py-3 flex items-center">
                            <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                            {quote.departure_airport} → {quote.arrival_airport}
                          </td>
                          <td className="py-3 flex items-center">
                            <Users className="w-4 h-4 mr-1 text-gray-400" />
                            {quote.passenger_count}
                          </td>
                          <td className="py-3 font-medium">
                            {quote.total_amount ? `€${quote.total_amount.toLocaleString()}` : 'TBD'}
                          </td>
                          <td className="py-3">
                            <Badge className={getStatusColor(quote.status)}>
                              {quote.status}
                            </Badge>
                          </td>
                          <td className="py-3 text-gray-500">
                            {format(new Date(quote.created_at), 'dd/MM/yyyy')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {quotes.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      Nessun preventivo presente
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="quotes">
            <div className="text-center py-12">
              <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium mb-2">Quotes Management</h3>
              <p className="text-sm text-gray-500 mb-4">Create and manage flight quotes with multiple aircraft options</p>
              <Button onClick={() => setShowQuoteModal(true)} className="bg-green-600 hover:bg-green-700">
                <Plus className="w-4 h-4 mr-2" />
                Create New Quote
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="bookings">
            <BookingsView />
          </TabsContent>

          <TabsContent value="clients">
            <ClientsView />
          </TabsContent>
        </Tabs>
      </div>

      <QuoteModal open={showQuoteModal} onOpenChange={setShowQuoteModal} />
    </div>
  );
};
