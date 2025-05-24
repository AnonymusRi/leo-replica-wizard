
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { it } from "date-fns/locale";

interface OpsCalendarViewProps {
  flights: any[];
  selectedDate: Date;
  weekDays: Date[];
  onFlightSelect: (flight: any) => void;
  getStatusColor: (status: string) => string;
}

export const OpsCalendarView = ({ 
  flights, 
  selectedDate, 
  weekDays, 
  onFlightSelect, 
  getStatusColor 
}: OpsCalendarViewProps) => {
  const getFlightsForDay = (day: Date) => {
    return flights.filter(flight => {
      const flightDate = new Date(flight.departure_time);
      return flightDate.toDateString() === day.toDateString();
    });
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="grid grid-cols-7 gap-4">
          {/* Header row */}
          {["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"].map((day) => (
            <div key={day} className="text-center font-medium text-gray-600 py-2 border-b">
              {day}
            </div>
          ))}
          
          {/* Calendar grid */}
          {weekDays.map((day, index) => {
            const dayFlights = getFlightsForDay(day);
            const isToday = day.toDateString() === new Date().toDateString();
            
            return (
              <div 
                key={index} 
                className={`min-h-32 p-2 border rounded-lg ${
                  isToday ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'
                }`}
              >
                <div className={`text-sm font-medium mb-2 ${
                  isToday ? 'text-blue-600' : 'text-gray-600'
                }`}>
                  {format(day, 'd', { locale: it })}
                </div>
                
                <div className="space-y-1">
                  {dayFlights.slice(0, 4).map((flight) => (
                    <div
                      key={flight.id}
                      className="cursor-pointer"
                      onClick={() => onFlightSelect(flight)}
                    >
                      <div className="text-xs p-1 rounded bg-gray-100 hover:bg-gray-200 transition-colors">
                        <div className="font-medium">{flight.flight_number}</div>
                        <div className="text-gray-600">
                          {flight.departure_airport} → {flight.arrival_airport}
                        </div>
                        <div className="text-gray-500">
                          {format(new Date(flight.departure_time), 'HH:mm')}
                        </div>
                        <Badge className={`${getStatusColor(flight.status)} text-xs mt-1`}>
                          {flight.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                  
                  {dayFlights.length > 4 && (
                    <div className="text-xs text-gray-500 text-center">
                      +{dayFlights.length - 4} altri
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
