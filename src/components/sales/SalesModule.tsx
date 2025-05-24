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
  Loader2,
  MessageSquare,
  Mail
} from "lucide-react";
import { QuoteModal } from "./QuoteModal";
import { ClientsView } from "./ClientsView";
import { BookingsView } from "./BookingsView";
import { QuoteManagement } from "./QuoteManagement";
import { AirportDirectory } from "./AirportDirectory";
import { MessagingModule } from "./MessagingModule";
import { useQuotes } from "@/hooks/useQuotes";
import { useClients } from "@/hooks/useClients";
import { useFlights } from "@/hooks/useFlights";
import { format } from "date-fns";
import { AdvancedQuoteModal } from "./AdvancedQuoteModal";

export const SalesModule = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [showAdvancedQuoteModal, setShowAdvancedQuoteModal] = useState(false);
  const [showAirportDirectory, setShowAirportDirectory] = useState(false);
  const [showMessaging, setShowMessaging] = useState(false);
  const { data: quotes = [], isLoading: quotesLoading, error: quotesError } = useQuotes();
  const { data: clients = [], isLoading: clientsLoading } = useClients();
  const { data: flights = [], isLoading: flightsLoading } = useFlights();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "expired": return "bg-red-100 text-red-800";
      case "cancelled": return "bg-gray-100 text-gray-800";
      default: return "bg-blue-100 text-blue-800";
    }
  };

  if (quotesLoading || clientsLoading || flightsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (quotesError) {
    return (
      <div className="text-center text-red-600 p-8">
        Errore nel caricamento dei dati: {quotesError.message}
      </div>
    );
  }

  // Calculate stats from real data
  const totalQuotes = quotes.length;
  const totalClients = clients.length;
  const totalFlights = flights.length;
  const pendingQuotes = quotes.filter(q => q.status === 'pending').length;
  const confirmedQuotes = quotes.filter(q => q.status === 'confirmed').length;
  const activeFlights = flights.filter(f => f.status === 'active' || f.status === 'scheduled').length;
  const totalRevenue = quotes
    .filter(q => q.status === 'confirmed' && q.total_amount)
    .reduce((sum, q) => sum + (q.total_amount || 0), 0);

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-4 border-b bg-gray-50">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold flex items-center">
            <DollarSign className="w-5 h-5 mr-2 text-green-600" />
            Sales CRM - Complete Management System
          </h2>
          <div className="flex items-center space-x-2">
            <Button size="sm" variant="outline" onClick={() => setShowAirportDirectory(true)}>
              <MapPin className="w-4 h-4 mr-1" />
              Airport Directory
            </Button>
            <Button size="sm" variant="outline" onClick={() => setShowMessaging(true)}>
              <MessageSquare className="w-4 h-4 mr-1" />
              Messages
            </Button>
            <Button size="sm" variant="outline">
              <Filter className="w-4 h-4 mr-1" />
              Filter
            </Button>
            <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => setShowQuoteModal(true)}>
              <Plus className="w-4 h-4 mr-1" />
              Quick Quote
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="quotes">Quote Management</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="clients">Clients</TabsTrigger>
            <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {/* Enhanced KPI Cards with Marketplace Integration */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Quotes</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalQuotes}</div>
                  <p className="text-xs text-muted-foreground">
                    {pendingQuotes} pending, {confirmedQuotes} confirmed
                  </p>
                  <div className="flex gap-1 mt-2">
                    <Badge variant="outline" className="text-xs">Avinode</Badge>
                    <Badge variant="outline" className="text-xs">Direct</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Clients</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalClients}</div>
                  <p className="text-xs text-muted-foreground">Total registered clients</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Flights</CardTitle>
                  <Plane className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">{activeFlights}</div>
                  <p className="text-xs text-muted-foreground">
                    {totalFlights} total flights
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">€{totalRevenue.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">Confirmed bookings</p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab("quotes")}>
                <CardContent className="p-4 text-center">
                  <FileText className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                  <h3 className="font-medium">Manage Quotes</h3>
                  <p className="text-sm text-gray-600">Create and track quotes with multiple pricing methods</p>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setShowAirportDirectory(true)}>
                <CardContent className="p-4 text-center">
                  <MapPin className="w-8 h-8 mx-auto mb-2 text-green-600" />
                  <h3 className="font-medium">Airport Directory</h3>
                  <p className="text-sm text-gray-600">Preview airport details and services</p>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setShowMessaging(true)}>
                <CardContent className="p-4 text-center">
                  <MessageSquare className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                  <h3 className="font-medium">Messages</h3>
                  <p className="text-sm text-gray-600">Client communication and internal notes</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Quotes Table with enhanced data */}
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
                        <th className="pb-3 font-medium">Aircraft Type</th>
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
                          <td className="py-3">
                            {quote.aircraft_type ? (
                              <Badge variant="outline">{quote.aircraft_type}</Badge>
                            ) : (
                              <span className="text-gray-400">TBD</span>
                            )}
                          </td>
                          <td className="py-3 font-medium">
                            {quote.total_amount ? `€${quote.total_amount.toLocaleString()}` : 'TBD'}
                          </td>
                          <td className="py-3">
                            <Badge className={getStatusColor(quote.status || 'pending')}>
                              {quote.status || 'pending'}
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
            <QuoteManagement />
          </TabsContent>

          <TabsContent value="bookings">
            <BookingsView />
          </TabsContent>

          <TabsContent value="clients">
            <ClientsView />
          </TabsContent>

          <TabsContent value="marketplace">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Marketplace Integrations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold">Avinode Integration</h3>
                        <Badge className="bg-green-100 text-green-800">Active</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        Connected to Avinode marketplace for quote requests and messaging
                      </p>
                      <div className="text-sm">
                        <p>Recent activity: 12 requests this week</p>
                        <p>Response rate: 95%</p>
                      </div>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold">Direct Bookings</h3>
                        <Badge className="bg-blue-100 text-blue-800">Active</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        Direct client bookings and repeat customers
                      </p>
                      <div className="text-sm">
                        <p>This month: 8 direct bookings</p>
                        <p>Conversion rate: 78%</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Modals */}
      <QuoteModal open={showQuoteModal} onOpenChange={setShowQuoteModal} />
      <AdvancedQuoteModal open={showAdvancedQuoteModal} onOpenChange={setShowAdvancedQuoteModal} />
      <AirportDirectory open={showAirportDirectory} onOpenChange={setShowAirportDirectory} />
      <MessagingModule open={showMessaging} onOpenChange={setShowMessaging} />
    </div>
  );
};
