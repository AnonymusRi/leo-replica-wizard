
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
  Edit
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ScheduleModal } from "./ScheduleModal";

export const ScheduleModule = () => {
  const [activeView, setActiveView] = useState("calendar");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const mockFlights = [
    {
      id: "FL001",
      aircraft: "N123AB",
      departure: "KJFK",
      arrival: "KLAX",
      departureTime: "09:00",
      arrivalTime: "12:30",
      date: "2024-01-15",
      passengers: 8,
      status: "confirmed",
      crew: ["Capt. Smith", "FO Johnson"]
    },
    {
      id: "FL002", 
      aircraft: "N456CD",
      departure: "KORD",
      arrival: "KIAH",
      departureTime: "14:15",
      arrivalTime: "17:45",
      date: "2024-01-15",
      passengers: 6,
      status: "tentative",
      crew: ["Capt. Brown", "FO Wilson"]
    },
    {
      id: "FL003",
      aircraft: "N789EF",
      departure: "KBOS",
      arrival: "KMIA",
      departureTime: "11:30",
      arrivalTime: "15:00",
      date: "2024-01-16",
      passengers: 4,
      status: "confirmed",
      crew: ["Capt. Davis", "FO Miller"]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed": return "bg-green-100 text-green-800";
      case "tentative": return "bg-yellow-100 text-yellow-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

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
            <div className="text-2xl font-bold text-blue-600">12</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Active Aircraft</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">8</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Flight Hours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">147.5</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Utilization</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">78%</div>
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
                  <TableHead>Flight ID</TableHead>
                  <TableHead>Aircraft</TableHead>
                  <TableHead>Route</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Passengers</TableHead>
                  <TableHead>Crew</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockFlights.map((flight) => (
                  <TableRow key={flight.id}>
                    <TableCell className="font-medium">{flight.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Plane className="w-4 h-4 mr-2 text-blue-500" />
                        {flight.aircraft}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                        {flight.departure} → {flight.arrival}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{flight.departureTime} - {flight.arrivalTime}</div>
                        <div className="text-gray-500">{flight.date}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1 text-gray-400" />
                        {flight.passengers}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {flight.crew.map((member, idx) => (
                          <div key={idx}>{member}</div>
                        ))}
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
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                <div key={day} className="text-center font-medium text-gray-600 py-2">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: 35 }, (_, i) => {
                const dayFlights = i === 14 ? 2 : i === 15 ? 1 : 0;
                return (
                  <div key={i} className="min-h-[100px] border rounded-lg p-2">
                    <div className="text-sm text-gray-600 mb-1">{i + 1}</div>
                    {dayFlights > 0 && (
                      <div className="space-y-1">
                        {Array.from({ length: dayFlights }, (_, j) => (
                          <div key={j} className="bg-blue-100 text-blue-800 text-xs p-1 rounded">
                            Flight {j + 1}
                          </div>
                        ))}
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
