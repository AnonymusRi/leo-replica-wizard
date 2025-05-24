
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Calendar, 
  Clock, 
  Plane, 
  MapPin, 
  Users, 
  Filter,
  Plus,
  Eye,
  Edit,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ScheduleModal } from "./ScheduleModal";
import { useFlights } from "@/hooks/useFlights";
import { format } from "date-fns";

export const ScheduleModule = () => {
  const [activeView, setActiveView] = useState("calendar");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: flights = [], isLoading, error } = useFlights();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800";
      case "active": return "bg-blue-100 text-blue-800";
      case "scheduled": return "bg-yellow-100 text-yellow-800";
      case "cancelled": return "bg-red-100 text-red-800";
      case "delayed": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
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
        Errore nel caricamento dei voli: {error.message}
      </div>
    );
  }

  const todaysFlights = flights.filter(flight => {
    const today = new Date().toDateString();
    const flightDate = new Date(flight.departure_time).toDateString();
    return today === flightDate;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Flight Schedule</h1>
          <p className="text-gray-600">Manage flight schedules and aircraft assignments</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button 
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Schedule
          </Button>
        </div>
      </div>

      {/* View Toggle */}
      <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 w-fit">
        <Button
          variant={activeView === "calendar" ? "default" : "ghost"}
          size="sm"
          onClick={() => setActiveView("calendar")}
          className={cn(
            "text-xs",
            activeView === "calendar" ? "bg-white shadow-sm" : "hover:bg-white/50"
          )}
        >
          <Calendar className="w-4 h-4 mr-1" />
          Calendar
        </Button>
        <Button
          variant={activeView === "table" ? "default" : "ghost"}
          size="sm"
          onClick={() => setActiveView("table")}
          className={cn(
            "text-xs",
            activeView === "table" ? "bg-white shadow-sm" : "hover:bg-white/50"
          )}
        >
          <Clock className="w-4 h-4 mr-1" />
          Timeline
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Today's Flights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{todaysFlights.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Flights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{flights.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Active Flights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {flights.filter(f => f.status === 'active').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Scheduled</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {flights.filter(f => f.status === 'scheduled').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      {activeView === "table" ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              Flight Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Flight Number</TableHead>
                  <TableHead>Aircraft</TableHead>
                  <TableHead>Route</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Passengers</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {flights.map((flight) => (
                  <TableRow key={flight.id}>
                    <TableCell className="font-medium">{flight.flight_number}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Plane className="w-4 h-4 mr-2 text-blue-500" />
                        {flight.aircraft?.tail_number || 'TBD'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                        {flight.departure_airport} → {flight.arrival_airport}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{format(new Date(flight.departure_time), 'HH:mm')} - {format(new Date(flight.arrival_time), 'HH:mm')}</div>
                        <div className="text-gray-500">{format(new Date(flight.departure_time), 'dd/MM/yyyy')}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1 text-gray-400" />
                        {flight.passenger_count}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {flight.client?.company_name || 'TBD'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(flight.status)}>
                        {flight.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {flights.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                Nessun volo programmato al momento
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Calendar View
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-2 mb-4">
              {["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"].map((day) => (
                <div key={day} className="text-center font-medium text-gray-600 py-2">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: 35 }, (_, i) => {
                const date = new Date();
                date.setDate(date.getDate() - date.getDay() + 1 + i);
                const dayFlights = flights.filter(flight => {
                  const flightDate = new Date(flight.departure_time).toDateString();
                  return date.toDateString() === flightDate;
                });
                
                return (
                  <div key={i} className="min-h-[100px] border rounded-lg p-2">
                    <div className="text-sm text-gray-600 mb-1">{date.getDate()}</div>
                    {dayFlights.length > 0 && (
                      <div className="space-y-1">
                        {dayFlights.slice(0, 3).map((flight) => (
                          <div key={flight.id} className="bg-blue-100 text-blue-800 text-xs p-1 rounded">
                            {flight.flight_number}
                          </div>
                        ))}
                        {dayFlights.length > 3 && (
                          <div className="text-xs text-gray-500">
                            +{dayFlights.length - 3} altri
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      <ScheduleModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};
