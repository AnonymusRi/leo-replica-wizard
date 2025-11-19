
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
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
  Loader2,
  Upload,
  Download,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  Search,
  AlertTriangle,
  CheckCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useFlights } from "@/hooks/useFlights";
import { useAircraft } from "@/hooks/useAircraft";
import { useCrewMembers } from "@/hooks/useCrewMembers";
import { useFlightAssignments } from "@/hooks/useFlightAssignments";
import { useMaintenanceRecords } from "@/hooks/useMaintenanceRecords";
import { format, addDays, subDays, startOfWeek, endOfWeek, eachDayOfInterval } from "date-fns";
import { it } from "date-fns/locale";
import { PublishModal } from "./PublishModal";
import { AdvancedScheduleModal } from "./AdvancedScheduleModal";
import { ModifyFlightModal } from "./ModifyFlightModal";
import { VersionModal } from "./VersionModal";
import { ExportModal } from "./ExportModal";

export const AdvancedScheduleModule = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<"week" | "month">("week");
  const [selectedAircraft, setSelectedAircraft] = useState<string>("all");
  const [showReservations, setShowReservations] = useState(true);
  const [showMaintenances, setShowMaintenances] = useState(true);
  const [showCrewAssignments, setShowCrewAssignments] = useState(true);
  const [airportCodeFilter, setAirportCodeFilter] = useState("ICAO");
  
  // Modal states
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isModifyModalOpen, setIsModifyModalOpen] = useState(false);
  const [isVersionModalOpen, setIsVersionModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  
  const [selectedFlight, setSelectedFlight] = useState<any>(null);

  const { data: flightsData, isLoading: flightsLoading } = useFlights(50, 0);
  const flights = flightsData?.data || [];
  const { data: aircraft = [], isLoading: aircraftLoading } = useAircraft();
  const { data: crewMembers = [] } = useCrewMembers();
  const { data: flightAssignments = [] } = useFlightAssignments();
  const { data: maintenanceData } = useMaintenanceRecords(50, 0);
  const maintenanceRecords = maintenanceData?.data || [];

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const timeSlots = Array.from({ length: 24 }, (_, i) => i);

  const filteredAircraft = selectedAircraft === "all" 
    ? aircraft 
    : aircraft.filter(ac => ac.id === selectedAircraft);

  const getFlightColor = (flight: any) => {
    switch (flight.status) {
      case "scheduled": return "bg-blue-500";
      case "active": return "bg-green-500";
      case "completed": return "bg-gray-500";
      case "cancelled": return "bg-red-500";
      case "delayed": return "bg-orange-500";
      default: return "bg-blue-500";
    }
  };

  const getMaintenanceColor = (maintenance: any) => {
    switch (maintenance.status) {
      case "scheduled": return "bg-purple-500";
      case "in_progress": return "bg-yellow-500";
      case "completed": return "bg-green-500";
      case "overdue": return "bg-red-500";
      default: return "bg-purple-500";
    }
  };

  const getFlightsForTimeSlot = (aircraftId: string, day: Date, hour: number) => {
    return flights.filter(flight => {
      if (flight.aircraft_id !== aircraftId) return false;
      const flightDate = new Date(flight.departure_time);
      return (
        flightDate.toDateString() === day.toDateString() &&
        flightDate.getHours() === hour
      );
    });
  };

  const getMaintenanceForDay = (aircraftId: string, day: Date) => {
    return maintenanceRecords.filter(maintenance => {
      if (maintenance.aircraft_id !== aircraftId) return false;
      const maintenanceDate = new Date(maintenance.scheduled_date);
      return maintenanceDate.toDateString() === day.toDateString();
    });
  };

  const getCrewForFlight = (flightId: string) => {
    return flightAssignments.filter(assignment => assignment.flight_id === flightId);
  };

  const navigateDate = (direction: "prev" | "next") => {
    const days = viewMode === "week" ? 7 : 30;
    setCurrentDate(prev => direction === "next" ? addDays(prev, days) : subDays(prev, days));
  };

  const handleFlightClick = (flight: any) => {
    setSelectedFlight(flight);
    setIsModifyModalOpen(true);
  };

  if (flightsLoading || aircraftLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  // Statistics
  const totalFlights = flights.length;
  const activeFlights = flights.filter(f => f.status === 'active').length;
  const scheduledFlights = flights.filter(f => f.status === 'scheduled').length;
  const availableAircraft = aircraft.filter(ac => ac.status === 'available').length;
  const maintenanceAircraft = aircraft.filter(ac => ac.status === 'maintenance').length;
  const activeCrew = crewMembers.filter(crew => crew.is_active).length;

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{totalFlights}</div>
            <div className="text-sm text-gray-600">Total Flights</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{activeFlights}</div>
            <div className="text-sm text-gray-600">Active Flights</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">{scheduledFlights}</div>
            <div className="text-sm text-gray-600">Scheduled</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{availableAircraft}</div>
            <div className="text-sm text-gray-600">Available Aircraft</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">{maintenanceAircraft}</div>
            <div className="text-sm text-gray-600">In Maintenance</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">{activeCrew}</div>
            <div className="text-sm text-gray-600">Active Crew</div>
          </CardContent>
        </Card>
      </div>

      {/* Header Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">FROM:</span>
            <Input
              type="date"
              value={format(weekStart, "yyyy-MM-dd")}
              onChange={(e) => setCurrentDate(new Date(e.target.value))}
              className="w-40"
            />
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">TO:</span>
            <Input
              type="date"
              value={format(weekEnd, "yyyy-MM-dd")}
              className="w-40"
            />
          </div>
          <div className="flex items-center space-x-1">
            <Button variant="outline" size="sm" onClick={() => navigateDate("prev")}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
              NOW
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigateDate("next")}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            onClick={() => setIsPublishModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            PUBLISH
          </Button>
          <Select value="UTC">
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="UTC">UTC</SelectItem>
              <SelectItem value="CET">CET</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-sm">Schedule</span>
          <Button variant="outline" size="sm">
            IMPORT
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setIsExportModalOpen(true)}
          >
            EXPORT
          </Button>
          <Select value="Formula 1 Europe">
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Formula 1 Europe">Formula 1 Europe</SelectItem>
              <SelectItem value="Formula 1 America">Formula 1 America</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            onClick={() => setIsVersionModalOpen(true)}
            className="bg-green-600 hover:bg-green-700"
          >
            CREATE NEW VERSION
          </Button>
        </div>
      </div>

      {/* Settings Panel */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <span className="text-sm">Aircraft filter</span>
                <Select value={selectedAircraft} onValueChange={setSelectedAircraft}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Aircraft</SelectItem>
                    {aircraft.map((ac) => (
                      <SelectItem key={ac.id} value={ac.id}>
                        {ac.tail_number}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-sm">Preferred airport code</span>
                <div className="flex space-x-1">
                  <Button
                    variant={airportCodeFilter === "ICAO" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setAirportCodeFilter("ICAO")}
                  >
                    ICAO
                  </Button>
                  <Button
                    variant={airportCodeFilter === "IATA" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setAirportCodeFilter("IATA")}
                  >
                    IATA
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="text-sm">Show reservations</span>
                <div className="flex space-x-1">
                  <Button
                    variant={showReservations ? "default" : "outline"}
                    size="sm"
                    onClick={() => setShowReservations(true)}
                  >
                    YES
                  </Button>
                  <Button
                    variant={!showReservations ? "default" : "outline"}
                    size="sm"
                    onClick={() => setShowReservations(false)}
                  >
                    NO
                  </Button>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-sm">Show maintenances</span>
                <div className="flex space-x-1">
                  <Button
                    variant={showMaintenances ? "default" : "outline"}
                    size="sm"
                    onClick={() => setShowMaintenances(true)}
                  >
                    YES
                  </Button>
                  <Button
                    variant={!showMaintenances ? "default" : "outline"}
                    size="sm"
                    onClick={() => setShowMaintenances(false)}
                  >
                    NO
                  </Button>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-sm">Show crew</span>
                <div className="flex space-x-1">
                  <Button
                    variant={showCrewAssignments ? "default" : "outline"}
                    size="sm"
                    onClick={() => setShowCrewAssignments(true)}
                  >
                    YES
                  </Button>
                  <Button
                    variant={!showCrewAssignments ? "default" : "outline"}
                    size="sm"
                    onClick={() => setShowCrewAssignments(false)}
                  >
                    NO
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Calendar Grid */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <div className="min-w-[1400px]">
              {/* Header with dates */}
              <div className="grid grid-cols-8 border-b">
                <div className="p-4 font-medium bg-gray-50 border-r">Aircraft</div>
                {weekDays.map((day) => (
                  <div key={day.toISOString()} className="p-2 text-center bg-gray-50 border-r">
                    <div className="font-medium">
                      {format(day, "dd MMM (EEE)", { locale: it })}
                    </div>
                    <div className="text-xs text-gray-500">
                      0600 - 2000
                    </div>
                  </div>
                ))}
              </div>

              {/* Aircraft rows */}
              {filteredAircraft.map((ac) => (
                <div key={ac.id} className="grid grid-cols-8 border-b min-h-[120px]">
                  {/* Aircraft info */}
                  <div className="p-4 border-r bg-gray-50">
                    <div className="font-medium">{ac.tail_number}</div>
                    <div className="text-sm text-gray-500">{ac.aircraft_type}</div>
                    <div className="text-xs mt-1">
                      <Badge 
                        className={cn(
                          "text-xs",
                          ac.status === 'available' ? "bg-green-100 text-green-800" :
                          ac.status === 'maintenance' ? "bg-red-100 text-red-800" :
                          "bg-gray-100 text-gray-800"
                        )}
                      >
                        {ac.status}
                      </Badge>
                    </div>
                  </div>

                  {/* Days */}
                  {weekDays.map((day) => (
                    <div key={day.toISOString()} className="border-r p-2 relative">
                      <div className="space-y-1">
                        {/* Flights */}
                        {timeSlots.map((hour) => {
                          const flightsInSlot = getFlightsForTimeSlot(ac.id, day, hour);
                          return flightsInSlot.map((flight) => {
                            const crewAssignments = getCrewForFlight(flight.id);
                            return (
                              <div
                                key={flight.id}
                                className={`${getFlightColor(flight)} text-white text-xs p-1 rounded cursor-pointer hover:opacity-80 relative group`}
                                onClick={() => handleFlightClick(flight)}
                              >
                                <div className="font-medium">{flight.flight_number}</div>
                                <div>{flight.departure_airport}-{flight.arrival_airport}</div>
                                <div>{format(new Date(flight.departure_time), "HH:mm")}</div>
                                
                                {/* Crew indicator */}
                                {showCrewAssignments && crewAssignments.length > 0 && (
                                  <div className="flex items-center mt-1">
                                    <Users className="w-3 h-3 mr-1" />
                                    <span>{crewAssignments.length}</span>
                                  </div>
                                )}

                                {/* Flight alerts */}
                                {flight.status === 'delayed' && (
                                  <AlertTriangle className="w-3 h-3 absolute top-1 right-1" />
                                )}
                                {flight.status === 'completed' && (
                                  <CheckCircle className="w-3 h-3 absolute top-1 right-1" />
                                )}
                              </div>
                            );
                          });
                        })}
                        
                        {/* Maintenance blocks */}
                        {showMaintenances && getMaintenanceForDay(ac.id, day).map((maintenance) => (
                          <div 
                            key={maintenance.id}
                            className={`${getMaintenanceColor(maintenance)} text-white text-xs p-1 rounded`}
                          >
                            <div className="font-medium">{maintenance.maintenance_type}</div>
                            <div className="text-[10px]">{maintenance.status}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Legend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <h4 className="font-medium mb-2">Flight Status</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-blue-500 rounded"></div>
                  <span className="text-sm">Scheduled</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <span className="text-sm">Active</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-orange-500 rounded"></div>
                  <span className="text-sm">Delayed</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-red-500 rounded"></div>
                  <span className="text-sm">Cancelled</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-gray-500 rounded"></div>
                  <span className="text-sm">Completed</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Maintenance Status</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-purple-500 rounded"></div>
                  <span className="text-sm">Scheduled</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                  <span className="text-sm">In Progress</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <span className="text-sm">Completed</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-red-500 rounded"></div>
                  <span className="text-sm">Overdue</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Aircraft Status</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
                  <span className="text-sm">Available</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-red-100 border border-red-300 rounded"></div>
                  <span className="text-sm">Maintenance</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-yellow-100 border border-yellow-300 rounded"></div>
                  <span className="text-sm">AOG</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Indicators</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4" />
                  <span className="text-sm">Crew Assigned</span>
                </div>
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 text-orange-500" />
                  <span className="text-sm">Delayed</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Completed</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex items-center space-x-2">
        <Button 
          onClick={() => setIsScheduleModalOpen(true)}
          className="bg-green-600 hover:bg-green-700"
        >
          NEW SCHEDULE
        </Button>
        <Button variant="outline">
          SELECT FLIGHTS
        </Button>
        <Button variant="outline">
          MODIFY FLIGHTS
        </Button>
        <Button variant="outline" className="text-red-600 hover:text-red-700">
          DELETE
        </Button>
      </div>

      {/* Modals */}
      <PublishModal 
        isOpen={isPublishModalOpen}
        onClose={() => setIsPublishModalOpen(false)}
        flights={flights}
      />
      
      <AdvancedScheduleModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
      />

      <ModifyFlightModal
        isOpen={isModifyModalOpen}
        onClose={() => setIsModifyModalOpen(false)}
        flight={selectedFlight}
      />

      <VersionModal
        isOpen={isVersionModalOpen}
        onClose={() => setIsVersionModalOpen(false)}
      />

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
      />
    </div>
  );
};
