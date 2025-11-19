
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart3, 
  FileText, 
  Calendar,
  Filter,
  Download,
  TrendingUp,
  DollarSign,
  Plane,
  Users,
  Wrench,
  Clock,
  Loader2
} from "lucide-react";
import { useFlights } from "@/hooks/useFlights";
import { useQuotes } from "@/hooks/useQuotes";
import { useCrewMembers } from "@/hooks/useCrewMembers";
import { format, startOfMonth, endOfMonth, subMonths } from "date-fns";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

export const ReportsModule = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const { data: flightsData, isLoading: flightsLoading } = useFlights(50, 0);
  const flights = flightsData?.data || [];
  const { data: quotes = [], isLoading: quotesLoading } = useQuotes();
  const { data: crewMembers = [], isLoading: crewLoading } = useCrewMembers();

  if (flightsLoading || quotesLoading || crewLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  // Calculate monthly flight data
  const monthlyData = [];
  for (let i = 5; i >= 0; i--) {
    const date = subMonths(new Date(), i);
    const monthStart = startOfMonth(date);
    const monthEnd = endOfMonth(date);
    
    const monthFlights = flights.filter(flight => {
      const flightDate = new Date(flight.departure_time);
      return flightDate >= monthStart && flightDate <= monthEnd;
    });
    
    const monthQuotes = quotes.filter(quote => {
      const quoteDate = new Date(quote.created_at);
      return quoteDate >= monthStart && quoteDate <= monthEnd;
    });

    monthlyData.push({
      month: format(date, 'MMM yyyy'),
      flights: monthFlights.length,
      quotes: monthQuotes.length,
      revenue: monthQuotes
        .filter(q => q.status === 'confirmed' && q.total_amount)
        .reduce((sum, q) => sum + (q.total_amount || 0), 0)
    });
  }

  // Flight status distribution
  const statusData = [
    { name: 'Completed', value: flights.filter(f => f.status === 'completed').length, color: '#10B981' },
    { name: 'Scheduled', value: flights.filter(f => f.status === 'scheduled').length, color: '#F59E0B' },
    { name: 'Active', value: flights.filter(f => f.status === 'active').length, color: '#3B82F6' },
    { name: 'Cancelled', value: flights.filter(f => f.status === 'cancelled').length, color: '#EF4444' },
    { name: 'Delayed', value: flights.filter(f => f.status === 'delayed').length, color: '#F97316' }
  ];

  const totalRevenue = quotes
    .filter(q => q.status === 'confirmed' && q.total_amount)
    .reduce((sum, q) => sum + (q.total_amount || 0), 0);

  const avgFlightPassengers = flights.length > 0 
    ? Math.round(flights.reduce((sum, f) => sum + f.passenger_count, 0) / flights.length)
    : 0;

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-4 border-b bg-gray-50">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold flex items-center">
            <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
            Reports & Analytics
          </h2>
          <div className="flex items-center space-x-2">
            <Button size="sm" variant="outline">
              <Filter className="w-4 h-4 mr-1" />
              FILTER
            </Button>
            <Button size="sm" className="bg-green-600 hover:bg-green-700">
              <Download className="w-4 h-4 mr-1" />
              EXPORT
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="flights">Flight Analytics</TabsTrigger>
            <TabsTrigger value="financial">Financial</TabsTrigger>
            <TabsTrigger value="operations">Operations</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* KPI Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Flights</CardTitle>
                  <Plane className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{flights.length}</div>
                  <p className="text-xs text-muted-foreground">Voli totali</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">€{totalRevenue.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">Ricavi confermati</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Crew</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{crewMembers.filter(c => c.is_active).length}</div>
                  <p className="text-xs text-muted-foreground">Membri attivi</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg Passengers</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{avgFlightPassengers}</div>
                  <p className="text-xs text-muted-foreground">Per volo</p>
                </CardContent>
              </Card>
            </div>

            {/* Monthly Trends */}
            <Card>
              <CardHeader>
                <CardTitle>Monthly Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="flights" fill="#3B82F6" name="Flights" />
                    <Bar dataKey="quotes" fill="#10B981" name="Quotes" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="flights">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Flight Status Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={statusData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label
                      >
                        {statusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Flight Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {statusData.map((status) => (
                    <div key={status.name} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: status.color }}
                        />
                        <span className="text-sm">{status.name}</span>
                      </div>
                      <Badge variant="outline">{status.value}</Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="financial">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`€${value.toLocaleString()}`, 'Revenue']} />
                    <Bar dataKey="revenue" fill="#10B981" name="Revenue (€)" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="operations">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Crew by Position</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {['captain', 'first_officer', 'cabin_crew', 'mechanic'].map((position) => {
                      const count = crewMembers.filter(c => c.position === position && c.is_active).length;
                      return (
                        <div key={position} className="flex items-center justify-between">
                          <span className="text-sm capitalize">{position.replace('_', ' ')}</span>
                          <Badge variant="outline">{count}</Badge>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Pending Quotes</span>
                    <Badge variant="outline">{quotes.filter(q => q.status === 'pending').length}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Today's Flights</span>
                    <Badge variant="outline">
                      {flights.filter(f => {
                        const today = new Date().toDateString();
                        const flightDate = new Date(f.departure_time).toDateString();
                        return today === flightDate;
                      }).length}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Active Flights</span>
                    <Badge variant="outline">{flights.filter(f => f.status === 'active').length}</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
