
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface OpsTimelineViewProps {
  flights: any[];
  aircraft: any[];
  selectedDate: Date;
  onFlightSelect: (flight: any) => void;
  getStatusColor: (status: string) => string;
}

export const OpsTimelineView = ({ 
  flights, 
  aircraft, 
  selectedDate, 
  onFlightSelect, 
  getStatusColor 
}: OpsTimelineViewProps) => {
  const timeSlots = Array.from({ length: 24 }, (_, i) => i);
  
  const getFlightsForTimeSlot = (aircraftId: string, hour: number) => {
    return flights.filter(flight => {
      if (flight.aircraft_id !== aircraftId) return false;
      const flightDate = new Date(flight.departure_time);
      const selectedDateStr = selectedDate.toDateString();
      const flightDateStr = flightDate.toDateString();
      return flightDateStr === selectedDateStr && flightDate.getHours() === hour;
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Timeline View - {format(selectedDate, 'dd MMMM yyyy')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div className="min-w-full">
            {/* Time header */}
            <div className="grid grid-cols-25 gap-1 mb-4">
              <div className="w-32 font-medium text-gray-600">Aircraft</div>
              {timeSlots.map((hour) => (
                <div key={hour} className="text-center text-xs text-gray-500 p-1">
                  {hour.toString().padStart(2, '0')}:00
                </div>
              ))}
            </div>

            {/* Aircraft rows */}
            {aircraft.map((ac) => (
              <div key={ac.id} className="grid grid-cols-25 gap-1 mb-2">
                {/* Aircraft info */}
                <div className="w-32 p-2 bg-gray-50 rounded">
                  <div className="font-medium text-sm">{ac.tail_number}</div>
                  <div className="text-xs text-gray-500">{ac.aircraft_type}</div>
                  <Badge 
                    className={`text-xs mt-1 ${
                      ac.status === 'available' ? 'bg-green-100 text-green-800' :
                      ac.status === 'maintenance' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {ac.status}
                  </Badge>
                </div>

                {/* Time slots */}
                {timeSlots.map((hour) => {
                  const flightsInSlot = getFlightsForTimeSlot(ac.id, hour);
                  return (
                    <div key={hour} className="min-h-16 p-1 border-l border-gray-200">
                      {flightsInSlot.map((flight) => (
                        <div
                          key={flight.id}
                          className="cursor-pointer mb-1"
                          onClick={() => onFlightSelect(flight)}
                        >
                          <div className="text-xs p-1 rounded bg-blue-100 hover:bg-blue-200 transition-colors">
                            <div className="font-medium">{flight.flight_number}</div>
                            <div className="text-gray-600">
                              {flight.departure_airport}→{flight.arrival_airport}
                            </div>
                            <div className="text-gray-500">
                              {format(new Date(flight.departure_time), 'HH:mm')}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
