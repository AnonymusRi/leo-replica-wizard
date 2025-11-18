import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { 
  Table as TableIcon,
  Calendar,
  Clock,
  Filter,
  FileText,
  Plane,
  MapPin,
  Users,
  Settings,
  Mail,
  Download,
  Search,
  Plus,
  Eye,
  Edit,
  Loader2,
  CheckCircle,
  AlertTriangle
} from "lucide-react";
import { useFlights } from "@/hooks/useFlights";
import { useAircraft } from "@/hooks/useAircraft";
import { useCrewMembers } from "@/hooks/useCrewMembers";
import { useFlightAssignments } from "@/hooks/useFlightAssignments";
import { useOpsChecklists, useFlightChecklistProgress } from "@/hooks/useOpsChecklists";
import { format, startOfWeek, endOfWeek, eachDayOfInterval } from "date-fns";
import { it } from "date-fns/locale";
import { OpsTableView } from "./OpsTableView";
import { OpsCalendarView } from "./OpsCalendarView";
import { OpsTimelineView } from "./OpsTimelineView";
import { OpsDetailedTableView } from "./OpsDetailedTableView";
import { AirportDirectoryModal } from "./AirportDirectoryModal";
import { FlightChecklistModal } from "./FlightChecklistModal";
import { HandlingRequestModal } from "./HandlingRequestModal";
import { DocumentGenerationModal } from "./DocumentGenerationModal";
import { CrewAssignmentModal } from "./CrewAssignmentModal";
import { NotificationCenter } from "./NotificationCenter";
import { useSystemNotifications, useCreateNotification } from "@/hooks/useSystemNotifications";
import { useWorkflowRules, useExecuteWorkflow } from "@/hooks/useWorkflowRules";
import { useQuoteFlightLinks, useLinkQuoteToFlight } from "@/hooks/useQuoteFlightLinks";

export const OpsModule = () => {
  const [activeView, setActiveView] = useState("detailed");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedAircraft, setSelectedAircraft] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedFlight, setSelectedFlight] = useState<any>(null);

  // Modal states
  const [isAirportDirectoryOpen, setIsAirportDirectoryOpen] = useState(false);
  const [isChecklistModalOpen, setIsChecklistModalOpen] = useState(false);
  const [isHandlingRequestOpen, setIsHandlingRequestOpen] = useState(false);
  const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false);
  const [isCrewAssignmentOpen, setIsCrewAssignmentOpen] = useState(false);

  const { data: flights = [], isLoading: flightsLoading } = useFlights();
  const { data: aircraft = [] } = useAircraft();
  const { data: crewMembers = [] } = useCrewMembers();
  const { data: flightAssignments = [] } = useFlightAssignments();
  const { data: opsChecklists = [] } = useOpsChecklists();

  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const filteredFlights = flights.filter(flight => {
    const matchesSearch = flight.flight_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         flight.departure_airport.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         flight.arrival_airport.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || flight.status === statusFilter;
    const matchesAircraft = selectedAircraft === "all" || flight.aircraft_id === selectedAircraft;
    
    return matchesSearch && matchesStatus && matchesAircraft;
  });

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

  const createNotification = useCreateNotification();
  const executeWorkflow = useExecuteWorkflow();

  const handleFlightSelect = (flight: any) => {
    setSelectedFlight(flight);
    setIsChecklistModalOpen(true);
    
    // Trigger workflow when flight is selected
    executeWorkflow.mutate({
      triggerModule: 'ops',
      triggerEvent: 'flight_selected',
      entityId: flight.id,
      entityType: 'flight',
      data: { flightNumber: flight.flight_number }
    });
  };

  const handleCrewAssignmentClick = () => {
    if (!selectedFlight) {
      // Se non c'è un volo selezionato, seleziona il primo volo disponibile
      if (filteredFlights.length > 0) {
        setSelectedFlight(filteredFlights[0]);
      } else {
        createNotification.mutate({
          module_source: 'ops',
          module_target: 'ops',
          notification_type: 'warning',
          title: 'Nessun Volo Disponibile',
          message: 'Seleziona un volo per assegnare l\'equipaggio',
          priority: 'medium'
        });
        return;
      }
    }
    setIsCrewAssignmentOpen(true);
  };

  // Function to create cross-module notifications
  const createCrossModuleNotification = (title: string, message: string, targetModule: string, priority: 'low' | 'medium' | 'high' | 'urgent' = 'medium') => {
    createNotification.mutate({
      module_source: 'ops',
      module_target: targetModule,
      notification_type: 'info',
      title,
      message,
      priority
    });
  };

  if (flightsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  // Statistics
  const totalFlights = filteredFlights.length;
  const activeFlights = filteredFlights.filter(f => f.status === 'active').length;
  const completedFlights = filteredFlights.filter(f => f.status === 'completed').length;
  const delayedFlights = filteredFlights.filter(f => f.status === 'delayed').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Operations Management</h1>
          <p className="text-gray-600">Gestione avanzata delle operazioni di volo</p>
        </div>
        <div className="flex items-center space-x-3">
          <NotificationCenter moduleTarget="ops" />
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setIsAirportDirectoryOpen(true)}
          >
            <MapPin className="w-4 h-4 mr-2" />
            Airport Directory
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => createCrossModuleNotification(
              'Export richiesto',
              'È stato richiesto un export del programma di volo',
              'reports'
            )}
          >
            <Download className="w-4 h-4 mr-2" />
            Export Schedule
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Flights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{totalFlights}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Active Flights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeFlights}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{completedFlights}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Delayed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{delayedFlights}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Controls */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Cerca voli, aeroporti..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Stato" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tutti gli stati</SelectItem>
                <SelectItem value="scheduled">Programmato</SelectItem>
                <SelectItem value="active">Attivo</SelectItem>
                <SelectItem value="completed">Completato</SelectItem>
                <SelectItem value="delayed">Ritardato</SelectItem>
                <SelectItem value="cancelled">Cancellato</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedAircraft} onValueChange={setSelectedAircraft}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Aeromobile" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tutti gli aeromobili</SelectItem>
                {aircraft.map((ac) => (
                  <SelectItem key={ac.id} value={ac.id}>
                    {ac.tail_number}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              type="date"
              value={format(selectedDate, "yyyy-MM-dd")}
              onChange={(e) => setSelectedDate(new Date(e.target.value))}
              className="w-40"
            />

            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filtri avanzati
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* View Toggle */}
      <Tabs value={activeView} onValueChange={setActiveView}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="detailed">
            <TableIcon className="w-4 h-4 mr-2" />
            Detailed Table
          </TabsTrigger>
          <TabsTrigger value="table">
            <TableIcon className="w-4 h-4 mr-2" />
            Simple Table
          </TabsTrigger>
          <TabsTrigger value="calendar">
            <Calendar className="w-4 h-4 mr-2" />
            Calendar View
          </TabsTrigger>
          <TabsTrigger value="timeline">
            <Clock className="w-4 h-4 mr-2" />
            Timeline View
          </TabsTrigger>
        </TabsList>

        <TabsContent value="detailed" className="space-y-4">
          <OpsDetailedTableView 
            flights={filteredFlights}
            onFlightSelect={handleFlightSelect}
          />
        </TabsContent>

        <TabsContent value="table" className="space-y-4">
          <OpsTableView 
            flights={filteredFlights}
            onFlightSelect={handleFlightSelect}
            getStatusColor={getStatusColor}
          />
        </TabsContent>

        <TabsContent value="calendar" className="space-y-4">
          <OpsCalendarView 
            flights={filteredFlights}
            selectedDate={selectedDate}
            weekDays={weekDays}
            onFlightSelect={handleFlightSelect}
            getStatusColor={getStatusColor}
          />
        </TabsContent>

        <TabsContent value="timeline" className="space-y-4">
          <OpsTimelineView 
            flights={filteredFlights}
            aircraft={aircraft}
            selectedDate={selectedDate}
            onFlightSelect={handleFlightSelect}
            getStatusColor={getStatusColor}
          />
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex items-center space-x-2">
        <Button 
          onClick={() => setIsDocumentModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <FileText className="w-4 h-4 mr-2" />
          Generate Documents
        </Button>
        <Button 
          variant="outline"
          onClick={() => setIsHandlingRequestOpen(true)}
        >
          <Mail className="w-4 h-4 mr-2" />
          Handling Request
        </Button>
        <Button 
          variant="outline"
          onClick={handleCrewAssignmentClick}
        >
          <Users className="w-4 h-4 mr-2" />
          Crew Assignment
        </Button>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export Data
        </Button>
      </div>

      {/* Modals */}
      <AirportDirectoryModal
        isOpen={isAirportDirectoryOpen}
        onClose={() => setIsAirportDirectoryOpen(false)}
      />

      <FlightChecklistModal
        isOpen={isChecklistModalOpen}
        onClose={() => setIsChecklistModalOpen(false)}
        flight={selectedFlight}
      />

      <HandlingRequestModal
        isOpen={isHandlingRequestOpen}
        onClose={() => setIsHandlingRequestOpen(false)}
        flight={selectedFlight}
      />

      <DocumentGenerationModal
        isOpen={isDocumentModalOpen}
        onClose={() => setIsDocumentModalOpen(false)}
        flight={selectedFlight}
      />

      <CrewAssignmentModal
        isOpen={isCrewAssignmentOpen}
        onClose={() => setIsCrewAssignmentOpen(false)}
        flight={selectedFlight}
      />
    </div>
  );
};
