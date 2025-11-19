
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Calendar, 
  MapPin, 
  Users, 
  Plane, 
  Search,
  Euro,
  Clock,
  Filter
} from "lucide-react";
import { useQuotes } from "@/hooks/useQuotes";
import { useFlights } from "@/hooks/useFlights";
import { format } from "date-fns";

export const BookingsView = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { data: quotes = [], isLoading: quotesLoading } = useQuotes();
  const { data: flightsData, isLoading: flightsLoading } = useFlights(50, 0);
  const flights = flightsData?.data || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "expired": return "bg-red-100 text-red-800";
      case "cancelled": return "bg-gray-100 text-gray-800";
      default: return "bg-blue-100 text-blue-800";
    }
  };

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

  const confirmedQuotes = quotes.filter(quote => quote.status === 'confirmed');
  const totalRevenue = confirmedQuotes.reduce((sum, quote) => sum + (quote.total_amount || 0), 0);

  const filteredQuotes = confirmedQuotes.filter(quote => {
    const matchesSearch = quote.quote_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quote.client?.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quote.departure_airport.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quote.arrival_airport.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (statusFilter === "all") return matchesSearch;
    return matchesSearch && quote.status === statusFilter;
  });

  if (quotesLoading || flightsLoading) {
    return <div className="flex items-center justify-center h-64">Loading bookings...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header and Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Bookings Management</h2>
          <p className="text-gray-600">Confirmed quotes and flight operations</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search bookings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Confirmed Bookings</p>
                <p className="text-2xl font-bold">{confirmedQuotes.length}</p>
              </div>
              <Calendar className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Flights</p>
                <p className="text-2xl font-bold text-green-600">
                  {flights.filter(f => f.status === 'active' || f.status === 'scheduled').length}
                </p>
              </div>
              <Plane className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-green-600">
                  €{totalRevenue.toLocaleString()}
                </p>
              </div>
              <Euro className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg. Booking Value</p>
                <p className="text-2xl font-bold text-purple-600">
                  €{confirmedQuotes.length > 0 ? Math.round(totalRevenue / confirmedQuotes.length).toLocaleString() : '0'}
                </p>
              </div>
              <Euro className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bookings List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Confirmed Bookings</span>
            <Badge variant="outline">{filteredQuotes.length} bookings</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredQuotes.map((quote) => (
              <div
                key={quote.id}
                className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="font-semibold text-blue-600">{quote.quote_number}</span>
                      <Badge className={getStatusColor(quote.status || 'confirmed')}>
                        {quote.status || 'confirmed'}
                      </Badge>
                      {quote.marketplace_source !== 'direct' && (
                        <Badge variant="secondary" className="text-xs">
                          {quote.marketplace_source}
                        </Badge>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <div className="flex items-center text-gray-600 mb-1">
                          <MapPin className="w-4 h-4 mr-1" />
                          Route
                        </div>
                        <div className="font-medium">
                          {quote.departure_airport} → {quote.arrival_airport}
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex items-center text-gray-600 mb-1">
                          <Calendar className="w-4 h-4 mr-1" />
                          Departure
                        </div>
                        <div className="font-medium">
                          {format(new Date(quote.departure_date), 'dd/MM/yyyy')}
                        </div>
                        {quote.return_date && (
                          <div className="text-xs text-gray-500">
                            Return: {format(new Date(quote.return_date), 'dd/MM/yyyy')}
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <div className="flex items-center text-gray-600 mb-1">
                          <Users className="w-4 h-4 mr-1" />
                          Passengers
                        </div>
                        <div className="font-medium">{quote.passenger_count}</div>
                        {quote.aircraft_type && (
                          <div className="text-xs text-gray-500">{quote.aircraft_type}</div>
                        )}
                      </div>
                    </div>
                    
                    <div className="mt-3 flex items-center justify-between">
                      <div>
                        <span className="text-sm text-gray-600">Client: </span>
                        <span className="font-medium">{quote.client?.company_name || 'TBD'}</span>
                      </div>
                      
                      <div className="text-right">
                        <div className="font-semibold text-lg flex items-center">
                          <Euro className="w-4 h-4 mr-1" />
                          {quote.total_amount ? quote.total_amount.toLocaleString() : 'TBD'}
                        </div>
                        {quote.vat_amount && (
                          <div className="text-xs text-gray-500">
                            +VAT €{quote.vat_amount.toLocaleString()}
                          </div>
                        )}
                      </div>
                    </div>

                    {quote.notes && (
                      <div className="mt-3 p-2 bg-gray-50 rounded text-sm">
                        <span className="font-medium">Notes: </span>
                        {quote.notes}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {filteredQuotes.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No confirmed bookings found</p>
              {searchTerm && <p className="text-sm">Try adjusting your search criteria</p>}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Flights */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Flight Operations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {flights.slice(0, 5).map((flight) => (
              <div key={flight.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <Plane className="w-5 h-5 text-blue-600" />
                  <div>
                    <div className="font-medium">{flight.flight_number}</div>
                    <div className="text-sm text-gray-600">
                      {flight.departure_airport} → {flight.arrival_airport}
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <Badge className={getFlightStatusColor(flight.status)}>
                    {flight.status}
                  </Badge>
                  <div className="text-xs text-gray-500 mt-1">
                    {format(new Date(flight.departure_time), 'dd/MM HH:mm')}
                  </div>
                </div>
              </div>
            ))}
            
            {flights.length === 0 && (
              <div className="text-center py-6 text-gray-500">
                <Plane className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No flight operations found</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
