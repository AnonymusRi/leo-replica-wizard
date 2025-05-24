
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Plane, 
  Users, 
  DollarSign,
  Filter,
  Grid3X3,
  List,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

export const BookingsView = () => {
  const [viewMode, setViewMode] = useState<"calendar" | "list">("calendar");
  const [currentDate, setCurrentDate] = useState(new Date());

  const bookings = [
    {
      id: "B001",
      client: "Executive Air Charter",
      aircraft: "Citation X",
      route: "EGLL → KJFK",
      departure: "2024-01-20T08:00:00",
      arrival: "2024-01-20T16:30:00",
      passengers: 8,
      status: "Confirmed",
      value: 45000,
      crew: "Capt. Smith, FO Johnson"
    },
    {
      id: "B002", 
      client: "Global Business Jets",
      aircraft: "Falcon 7X",
      route: "LFPG → EDDF",
      departure: "2024-01-22T14:00:00",
      arrival: "2024-01-22T15:30:00",
      passengers: 12,
      status: "Confirmed",
      value: 32000,
      crew: "Capt. Brown, FO Wilson"
    },
    {
      id: "B003",
      client: "Private Airways",
      aircraft: "Gulfstream G650",
      route: "EGKK → LSZH",
      departure: "2024-01-25T10:30:00",
      arrival: "2024-01-25T12:00:00",
      passengers: 14,
      status: "Pending",
      value: 28000,
      crew: "TBD"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Confirmed": return "bg-green-100 text-green-800";
      case "Pending": return "bg-yellow-100 text-yellow-800";
      case "Cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  // Generate calendar days for current month
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const currentDay = new Date(startDate);
    
    for (let i = 0; i < 42; i++) {
      days.push(new Date(currentDay));
      currentDay.setDate(currentDay.getDate() + 1);
    }
    
    return days;
  };

  const getBookingsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return bookings.filter(booking => 
      booking.departure.startsWith(dateStr)
    );
  };

  const calendarDays = generateCalendarDays();
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h3 className="text-lg font-semibold">Bookings & Schedule</h3>
          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === "calendar" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("calendar")}
            >
              <Grid3X3 className="w-4 h-4 mr-1" />
              Calendar
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("list")}
            >
              <List className="w-4 h-4 mr-1" />
              List
            </Button>
          </div>
        </div>
        <Button size="sm" variant="outline">
          <Filter className="w-4 h-4 mr-1" />
          Filter
        </Button>
      </div>

      <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as "calendar" | "list")}>
        <TabsContent value="calendar">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentDate(new Date())}
                  >
                    Today
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-1">
                {/* Day headers */}
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                    {day}
                  </div>
                ))}
                
                {/* Calendar days */}
                {calendarDays.map((day, index) => {
                  const dayBookings = getBookingsForDate(day);
                  const isCurrentMonth = day.getMonth() === currentDate.getMonth();
                  const isToday = day.toDateString() === new Date().toDateString();
                  
                  return (
                    <div
                      key={index}
                      className={`p-2 min-h-[100px] border rounded-lg ${
                        isCurrentMonth ? 'bg-white' : 'bg-gray-50'
                      } ${isToday ? 'ring-2 ring-blue-500' : ''}`}
                    >
                      <div className={`text-sm ${isCurrentMonth ? 'text-gray-900' : 'text-gray-400'} ${isToday ? 'font-bold' : ''}`}>
                        {day.getDate()}
                      </div>
                      <div className="space-y-1 mt-1">
                        {dayBookings.map(booking => (
                          <div
                            key={booking.id}
                            className="text-xs p-1 rounded bg-blue-100 text-blue-800 truncate"
                            title={`${booking.client} - ${booking.route}`}
                          >
                            {formatTime(booking.departure)} {booking.aircraft}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="list">
          <div className="space-y-4">
            {bookings.map((booking) => (
              <Card key={booking.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <h3 className="font-semibold text-lg">{booking.client}</h3>
                          <Badge className={getStatusColor(booking.status)}>
                            {booking.status}
                          </Badge>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">Booking ID</p>
                          <p className="font-medium">{booking.id}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-center space-x-2">
                          <Plane className="w-4 h-4 text-blue-600" />
                          <div>
                            <p className="text-sm text-gray-500">Aircraft</p>
                            <p className="font-medium">{booking.aircraft}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4 text-green-600" />
                          <div>
                            <p className="text-sm text-gray-500">Route</p>
                            <p className="font-medium">{booking.route}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Users className="w-4 h-4 text-purple-600" />
                          <div>
                            <p className="text-sm text-gray-500">Passengers</p>
                            <p className="font-medium">{booking.passengers}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-orange-600" />
                          <div>
                            <p className="text-sm text-gray-500">Departure</p>
                            <p className="font-medium">
                              {formatDate(booking.departure)} {formatTime(booking.departure)}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-red-600" />
                          <div>
                            <p className="text-sm text-gray-500">Arrival</p>
                            <p className="font-medium">
                              {formatDate(booking.arrival)} {formatTime(booking.arrival)}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <DollarSign className="w-4 h-4 text-green-600" />
                          <div>
                            <p className="text-sm text-gray-500">Value</p>
                            <p className="font-medium text-green-600">
                              ${booking.value.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="pt-2 border-t">
                        <p className="text-sm text-gray-500">Crew: {booking.crew}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
