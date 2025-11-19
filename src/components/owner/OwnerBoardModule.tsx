
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  User, 
  Plane, 
  DollarSign,
  Calendar,
  Filter,
  TrendingUp,
  BarChart3,
  Clock,
  AlertCircle,
  CheckCircle,
  Loader2
} from "lucide-react";
import { useFlights } from "@/hooks/useFlights";
import { useQuotes } from "@/hooks/useQuotes";
import { useAircraft } from "@/hooks/useAircraft";
import { format, isToday, isTomorrow, addDays } from "date-fns";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

export const OwnerBoardModule = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { data: flightsData, isLoading: flightsLoading } = useFlights(50, 0);
  const flights = flightsData?.data || [];
  const { data: quotes = [], isLoading: quotesLoading } = useQuotes();
  const { data: aircraft = [], isLoading: aircraftLoading } = useAircraft();

  if (flightsLoading || quotesLoading || aircraftLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  // Calculate key metrics
  const todaysFlights = flights.filter(flight => isToday(new Date(flight.departure_time)));
  const tomorrowsFlights = flights.filter(flight => isTomorrow(new Date(flight.departure_time)));
  const upcomingFlights = flights.filter(flight => {
    const flightDate = new Date(flight.departure_time);
    const today = new Date();
    const nextWeek = addDays(today, 7);
    return flightDate >= today && flightDate <= nextWeek;
  });

  const monthlyRevenue = quotes
    .filter(q => q.status === 'confirmed' && q.total_amount)
    .reduce((sum, q) => sum + (q.total_amount || 0), 0);

  const activeAircraft = aircraft.filter(a => a.status === 'available').length;
  const maintenanceAircraft = aircraft.filter(a => a.status === 'maintenance').length;

  // Daily utilization data for the next 7 days
  const utilizationData = [];
  for (let i = 0; i < 7; i++) {
    const date = addDays(new Date(), i);
    const dayFlights = flights.filter(flight => {
      const flightDate = new Date(flight.departure_time);
      return flightDate.toDateString() === date.toDateString();
    });
    
    utilizationData.push({
      date: format(date, 'MMM dd'),
      flights: dayFlights.length,
      hours: dayFlights.length * 2.5 // Estimated flight hours
    });
  }

  const getFlightStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800";
      case "active": return "bg-blue-100 text-blue-800";
      case "scheduled": return "bg-yellow-100 text-yellow-800";
      case "cancelled": return "bg-red-100 text-red-800";
      case "delayed": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-4 border-b bg-gray-50">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold flex items-center">
            <User className="w-5 h-5 mr-2 text-purple-600" />
            Owner Dashboard
          </h2>
          <div className="flex items-center space-x-2">
            <Button size="sm" variant="outline">
              <Filter className="w-4 h-4 mr-1" />
              FILTER
            </Button>
            <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
              <BarChart3 className="w-4 h-4 mr-1" />
              FULL REPORT
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="operations">Operations</TabsTrigger>
            <TabsTrigger value="financial">Financial</TabsTrigger>
            <TabsTrigger value="fleet">Fleet Status</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {/* Executive Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Today's Operations</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">{todaysFlights.length}</div>
                  <p className="text-xs text-muted-foreground">
                    {tomorrowsFlights.length} programmed tomorrow
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">€{monthlyRevenue.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">Confirmed bookings</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Fleet Status</CardTitle>
                  <Plane className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">{activeAircraft}/{aircraft.length}</div>
                  <p className="text-xs text-muted-foreground">
                    {maintenanceAircraft} in maintenance
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Utilization</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600">
                    {((upcomingFlights.length / (aircraft.length * 7)) * 100).toFixed(1)}%
                  </div>
                  <p className="text-xs text-muted-foreground">Next 7 days</p>
                </CardContent>
              </Card>
            </div>

            {/* Fleet Utilization Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Fleet Utilization - Next 7 Days</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={utilizationData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="flights" stroke="#3B82F6" name="Flights" strokeWidth={2} />
                    <Line type="monotone" dataKey="hours" stroke="#10B981" name="Flight Hours" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Critical Alerts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertCircle className="w-5 h-5 mr-2 text-red-500" />
                  Critical Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {maintenanceAircraft > 0 && (
                    <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                      <div className="flex items-center">
                        <AlertCircle className="w-4 h-4 mr-2 text-yellow-600" />
                        <span className="text-sm">{maintenanceAircraft} aircraft in maintenance</span>
                      </div>
                      <Badge variant="outline">Action Required</Badge>
                    </div>
                  )}
                  
                  {quotes.filter(q => q.status === 'pending').length > 5 && (
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2 text-blue-600" />
                        <span className="text-sm">{quotes.filter(q => q.status === 'pending').length} pending quotes requiring attention</span>
                      </div>
                      <Badge variant="outline">Review</Badge>
                    </div>
                  )}
                  
                  {maintenanceAircraft === 0 && quotes.filter(q => q.status === 'pending').length <= 5 && (
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center">
                        <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                        <span className="text-sm">All systems operational</span>
                      </div>
                      <Badge variant="outline" className="bg-green-100 text-green-800">Optimal</Badge>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="operations">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Operations</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Flight</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Route</TableHead>
                        <TableHead>Aircraft</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Passengers</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {upcomingFlights.slice(0, 10).map((flight) => (
                        <TableRow key={flight.id}>
                          <TableCell className="font-medium">{flight.flight_number}</TableCell>
                          <TableCell>{format(new Date(flight.departure_time), 'dd/MM/yyyy HH:mm')}</TableCell>
                          <TableCell>{flight.departure_airport} → {flight.arrival_airport}</TableCell>
                          <TableCell>{flight.aircraft?.tail_number || 'TBD'}</TableCell>
                          <TableCell>
                            <Badge className={getFlightStatusColor(flight.status)}>
                              {flight.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{flight.passenger_count}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="financial">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Confirmed Revenue</span>
                    <span className="font-bold text-green-600">€{monthlyRevenue.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Pending Quotes</span>
                    <span className="font-bold text-yellow-600">
                      €{quotes
                        .filter(q => q.status === 'pending' && q.total_amount)
                        .reduce((sum, q) => sum + (q.total_amount || 0), 0)
                        .toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Total Potential</span>
                    <span className="font-bold text-blue-600">
                      €{(monthlyRevenue + quotes
                        .filter(q => q.status === 'pending' && q.total_amount)
                        .reduce((sum, q) => sum + (q.total_amount || 0), 0))
                        .toLocaleString()}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Quote Conversion Rate</span>
                    <span className="font-bold">
                      {quotes.length > 0 
                        ? ((quotes.filter(q => q.status === 'confirmed').length / quotes.length) * 100).toFixed(1)
                        : 0}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Average Flight Value</span>
                    <span className="font-bold">
                      €{quotes.filter(q => q.status === 'confirmed' && q.total_amount).length > 0
                        ? Math.round(monthlyRevenue / quotes.filter(q => q.status === 'confirmed').length).toLocaleString()
                        : 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Fleet Efficiency</span>
                    <span className="font-bold text-green-600">
                      {((activeAircraft / aircraft.length) * 100).toFixed(1)}%
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="fleet">
            <Card>
              <CardHeader>
                <CardTitle>Aircraft Fleet Status</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tail Number</TableHead>
                      <TableHead>Aircraft Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Home Base</TableHead>
                      <TableHead>Capacity</TableHead>
                      <TableHead>Utilization</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {aircraft.map((plane) => {
                      const planeFlights = upcomingFlights.filter(f => f.aircraft_id === plane.id);
                      const utilization = ((planeFlights.length / 7) * 100).toFixed(1);
                      
                      return (
                        <TableRow key={plane.id}>
                          <TableCell className="font-medium">{plane.tail_number}</TableCell>
                          <TableCell>{plane.aircraft_type}</TableCell>
                          <TableCell>
                            <Badge variant={plane.status === 'available' ? 'default' : 'secondary'}>
                              {plane.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{plane.home_base || 'N/A'}</TableCell>
                          <TableCell>{plane.max_passengers || 'N/A'} pax</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <span>{utilization}%</span>
                              <div className="w-16 bg-gray-200 rounded-full h-2">
                                <div 
                                  className={`h-2 rounded-full ${
                                    parseFloat(utilization) > 70 ? 'bg-green-500' : 
                                    parseFloat(utilization) > 40 ? 'bg-yellow-500' : 'bg-red-500'
                                  }`}
                                  style={{ width: `${Math.min(parseFloat(utilization), 100)}%` }}
                                />
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
