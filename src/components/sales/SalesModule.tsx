
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
  Phone,
  Mail,
  FileText
} from "lucide-react";
import { QuoteModal } from "./QuoteModal";
import { ClientsView } from "./ClientsView";
import { BookingsView } from "./BookingsView";

export const SalesModule = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showQuoteModal, setShowQuoteModal] = useState(false);

  // Mock data per il dashboard
  const salesStats = {
    totalQuotes: 47,
    pendingQuotes: 12,
    confirmedBookings: 8,
    revenue: 245000
  };

  const recentQuotes = [
    {
      id: "Q001",
      client: "Executive Air Charter",
      route: "EGLL → KJFK",
      aircraft: "Citation X",
      status: "Pending",
      value: 45000,
      created: "2024-01-15"
    },
    {
      id: "Q002", 
      client: "Global Business Jets",
      route: "LFPG → EDDF",
      aircraft: "Falcon 7X",
      status: "Confirmed",
      value: 32000,
      created: "2024-01-14"
    },
    {
      id: "Q003",
      client: "Private Airways",
      route: "EGKK → LSZH",
      aircraft: "Gulfstream G650",
      status: "Expired",
      value: 28000,
      created: "2024-01-13"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Confirmed": return "bg-green-100 text-green-800";
      case "Pending": return "bg-yellow-100 text-yellow-800";
      case "Expired": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

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
                  <div className="text-2xl font-bold">{salesStats.totalQuotes}</div>
                  <p className="text-xs text-muted-foreground">+12% from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Quotes</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">{salesStats.pendingQuotes}</div>
                  <p className="text-xs text-muted-foreground">Awaiting response</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Confirmed Bookings</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{salesStats.confirmedBookings}</div>
                  <p className="text-xs text-muted-foreground">This month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${salesStats.revenue.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">+8% from last month</p>
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
                        <th className="pb-3 font-medium">Quote ID</th>
                        <th className="pb-3 font-medium">Client</th>
                        <th className="pb-3 font-medium">Route</th>
                        <th className="pb-3 font-medium">Aircraft</th>
                        <th className="pb-3 font-medium">Value</th>
                        <th className="pb-3 font-medium">Status</th>
                        <th className="pb-3 font-medium">Created</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentQuotes.map((quote) => (
                        <tr key={quote.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 font-medium text-blue-600">{quote.id}</td>
                          <td className="py-3">{quote.client}</td>
                          <td className="py-3 flex items-center">
                            <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                            {quote.route}
                          </td>
                          <td className="py-3 flex items-center">
                            <Plane className="w-4 h-4 mr-1 text-gray-400" />
                            {quote.aircraft}
                          </td>
                          <td className="py-3 font-medium">${quote.value.toLocaleString()}</td>
                          <td className="py-3">
                            <Badge className={getStatusColor(quote.status)}>
                              {quote.status}
                            </Badge>
                          </td>
                          <td className="py-3 text-gray-500">{quote.created}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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
