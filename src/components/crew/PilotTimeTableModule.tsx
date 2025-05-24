import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Calendar, 
  Clock, 
  AlertTriangle, 
  Plus, 
  Users, 
  Timer,
  TrendingUp,
  Moon,
  Sun,
  CheckCircle,
  XCircle,
  BarChart3,
  User,
  Briefcase,
  Coffee,
  GraduationCap,
  Plane,
  CalendarDays
} from "lucide-react";
import { useCrewMembers } from "@/hooks/useCrewMembers";
import { usePilotFlightHours } from "@/hooks/usePilotFlightHours";
import { usePilotSchedule } from "@/hooks/usePilotSchedule";
import { useFlightTimeLimits } from "@/hooks/useFlightTimeLimits";
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, differenceInHours } from "date-fns";
import { PilotTimeModal } from "./PilotTimeModal";
import { TimeTableView } from "./TimeTableView";
import { FTLComplianceCard } from "./FTLComplianceCard";

export const PilotTimeTableModule = () => {
  const [selectedPilot, setSelectedPilot] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("timetable");

  const { data: crewMembers = [], isLoading: crewLoading } = useCrewMembers();
  const { data: flightHours = [], isLoading: hoursLoading } = usePilotFlightHours(selectedPilot);
  const { data: schedule = [], isLoading: scheduleLoading } = usePilotSchedule(selectedPilot);
  const { data: limits = [], isLoading: limitsLoading } = useFlightTimeLimits();

  const pilots = crewMembers.filter(member => 
    member.position === "captain" || member.position === "first_officer"
  );

  const selectedPilotData = pilots.find(p => p.id === selectedPilot);

  // Calcola le ore di volo per periodo
  const calculateFlightHours = (pilotId: string, period: 'daily' | 'weekly' | 'monthly' | 'yearly') => {
    const pilotHours = flightHours.filter(h => h.pilot_id === pilotId);
    const now = new Date();
    let startDate: Date;

    switch (period) {
      case 'daily':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case 'weekly':
        startDate = startOfWeek(now, { weekStartsOn: 1 });
        break;
      case 'monthly':
        startDate = startOfMonth(now);
        break;
      case 'yearly':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
    }

    return pilotHours
      .filter(h => new Date(h.flight_date) >= startDate)
      .reduce((total, h) => total + h.flight_hours, 0);
  };

  // Verifica compliance FTL
  const checkFTLCompliance = (pilotId: string) => {
    if (limits.length === 0) return { compliant: true, warnings: [] };
    
    const regulation = limits[0];
    const warnings = [];
    
    const dailyHours = calculateFlightHours(pilotId, 'daily');
    const weeklyHours = calculateFlightHours(pilotId, 'weekly');
    const monthlyHours = calculateFlightHours(pilotId, 'monthly');
    const yearlyHours = calculateFlightHours(pilotId, 'yearly');

    if (dailyHours > regulation.daily_limit) {
      warnings.push(`Limite giornaliero superato: ${dailyHours.toFixed(1)}h/${regulation.daily_limit}h`);
    }
    if (weeklyHours > regulation.weekly_limit) {
      warnings.push(`Limite settimanale superato: ${weeklyHours.toFixed(1)}h/${regulation.weekly_limit}h`);
    }
    if (monthlyHours > regulation.monthly_limit) {
      warnings.push(`Limite mensile superato: ${monthlyHours.toFixed(1)}h/${regulation.monthly_limit}h`);
    }
    if (yearlyHours > regulation.yearly_limit) {
      warnings.push(`Limite annuale superato: ${yearlyHours.toFixed(1)}h/${regulation.yearly_limit}h`);
    }

    return {
      compliant: warnings.length === 0,
      warnings,
      hours: { dailyHours, weeklyHours, monthlyHours, yearlyHours }
    };
  };

  const getScheduleTypeColor = (type: string) => {
    switch (type) {
      case "duty": return "bg-blue-100 text-blue-800";
      case "rest": return "bg-green-100 text-green-800";
      case "training": return "bg-purple-100 text-purple-800";
      case "available": return "bg-gray-100 text-gray-800";
      case "unavailable": return "bg-red-100 text-red-800";
      case "vacation": return "bg-yellow-100 text-yellow-800";
      case "sick": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getScheduleTypeIcon = (type: string) => {
    switch (type) {
      case "duty": return <Briefcase className="w-4 h-4" />;
      case "rest": return <Moon className="w-4 h-4" />;
      case "training": return <GraduationCap className="w-4 h-4" />;
      case "available": return <CheckCircle className="w-4 h-4" />;
      case "unavailable": return <XCircle className="w-4 h-4" />;
      case "vacation": return <Coffee className="w-4 h-4" />;
      case "sick": return <AlertTriangle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getFlightTypeIcon = (type: string) => {
    switch (type) {
      case "commercial": return <Plane className="w-4 h-4" />;
      case "training": return <GraduationCap className="w-4 h-4" />;
      case "ferry": return <Users className="w-4 h-4" />;
      case "positioning": return <Users className="w-4 h-4" />;
      case "maintenance": return <AlertTriangle className="w-4 h-4" />;
      default: return <Plane className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Pilot Time Table & FTL Management</h1>
          <p className="text-gray-600">Gestione orari di lavoro, ore di volo e compliance regolamentari</p>
        </div>
        <div className="flex items-center space-x-3">
          <Select value={selectedPilot} onValueChange={setSelectedPilot}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Seleziona pilota" />
            </SelectTrigger>
            <SelectContent>
              {pilots.map((pilot) => (
                <SelectItem key={pilot.id} value={pilot.id}>
                  {pilot.first_name} {pilot.last_name} ({pilot.position})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button 
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nuova Registrazione
          </Button>
        </div>
      </div>

      {/* Pilot Summary Cards */}
      {selectedPilot && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <Sun className="w-4 h-4 mr-1" />
                Ore Oggi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {calculateFlightHours(selectedPilot, 'daily').toFixed(1)}h
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                Ore Settimana
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {calculateFlightHours(selectedPilot, 'weekly').toFixed(1)}h
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <BarChart3 className="w-4 h-4 mr-1" />
                Ore Mese
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {calculateFlightHours(selectedPilot, 'monthly').toFixed(1)}h
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <TrendingUp className="w-4 h-4 mr-1" />
                Ore Anno
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {calculateFlightHours(selectedPilot, 'yearly').toFixed(1)}h
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* FTL Compliance Alert with new component */}
      {selectedPilot && selectedPilotData && limits.length > 0 && (() => {
        const compliance = checkFTLCompliance(selectedPilot);
        return !compliance.compliant && (
          <FTLComplianceCard
            pilotName={`${selectedPilotData.first_name} ${selectedPilotData.last_name}`}
            compliance={compliance}
            limits={limits[0]}
          />
        );
      })()}

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="timetable">Time Table</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="hours">Ore di Volo</TabsTrigger>
          <TabsTrigger value="compliance">Compliance FTL</TabsTrigger>
          <TabsTrigger value="trading">Trading</TabsTrigger>
        </TabsList>

        <TabsContent value="timetable" className="space-y-4">
          <TimeTableView />
        </TabsContent>

        <TabsContent value="schedule" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Pianificazione Turni
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Pilota</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Data Inizio</TableHead>
                    <TableHead>Data Fine</TableHead>
                    <TableHead>Durata</TableHead>
                    <TableHead>Note</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {schedule
                    .filter(s => !selectedPilot || s.pilot_id === selectedPilot)
                    .map((item) => {
                      const pilot = pilots.find(p => p.id === item.pilot_id);
                      const duration = differenceInHours(new Date(item.end_date), new Date(item.start_date));
                      
                      return (
                        <TableRow key={item.id}>
                          <TableCell>
                            <div className="flex items-center">
                              <User className="w-4 h-4 mr-2 text-gray-400" />
                              {pilot ? `${pilot.first_name} ${pilot.last_name}` : 'N/A'}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getScheduleTypeColor(item.schedule_type)}>
                              {getScheduleTypeIcon(item.schedule_type)}
                              <span className="ml-1 capitalize">{item.schedule_type}</span>
                            </Badge>
                          </TableCell>
                          <TableCell>{format(new Date(item.start_date), 'dd/MM/yyyy HH:mm')}</TableCell>
                          <TableCell>{format(new Date(item.end_date), 'dd/MM/yyyy HH:mm')}</TableCell>
                          <TableCell>{duration}h</TableCell>
                          <TableCell>{item.notes || '-'}</TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
              {schedule.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  Nessuna pianificazione presente
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hours" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                Registro Ore di Volo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Pilota</TableHead>
                    <TableHead>Data Volo</TableHead>
                    <TableHead>Ore Volate</TableHead>
                    <TableHead>Tipo Volo</TableHead>
                    <TableHead>Volo ID</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {flightHours
                    .filter(h => !selectedPilot || h.pilot_id === selectedPilot)
                    .slice(0, 20)
                    .map((hour) => {
                      const pilot = pilots.find(p => p.id === hour.pilot_id);
                      
                      return (
                        <TableRow key={hour.id}>
                          <TableCell>
                            <div className="flex items-center">
                              <User className="w-4 h-4 mr-2 text-gray-400" />
                              {pilot ? `${pilot.first_name} ${pilot.last_name}` : 'N/A'}
                            </div>
                          </TableCell>
                          <TableCell>{format(new Date(hour.flight_date), 'dd/MM/yyyy')}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Timer className="w-4 h-4 mr-1 text-blue-500" />
                              {hour.flight_hours.toFixed(1)}h
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="capitalize">
                              {getFlightTypeIcon(hour.flight_type)}
                              <span className="ml-1">{hour.flight_type}</span>
                            </Badge>
                          </TableCell>
                          <TableCell>{hour.flight_id || '-'}</TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
              {flightHours.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  Nessuna registrazione ore di volo
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2" />
                Compliance FTL (Flight Time Limitations)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {limits.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium mb-2">Nessun Limite FTL Configurato</h3>
                  <p className="text-sm">Configurare i limiti FTL per monitorare la compliance</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* FTL Limits Overview */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {limits.map((limit) => (
                      <Card key={limit.id} className="border border-gray-200">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg">{limit.regulation_name}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div>
                              <span className="text-gray-600">Limite Giornaliero:</span>
                              <div className="font-semibold">{limit.daily_limit}h</div>
                            </div>
                            <div>
                              <span className="text-gray-600">Limite Settimanale:</span>
                              <div className="font-semibold">{limit.weekly_limit}h</div>
                            </div>
                            <div>
                              <span className="text-gray-600">Limite Mensile:</span>
                              <div className="font-semibold">{limit.monthly_limit}h</div>
                            </div>
                            <div>
                              <span className="text-gray-600">Limite Annuale:</span>
                              <div className="font-semibold">{limit.yearly_limit}h</div>
                            </div>
                          </div>
                          <div className="border-t pt-3 space-y-2 text-sm">
                            <div>
                              <span className="text-gray-600">Riposo min. tra servizi:</span>
                              <span className="font-semibold ml-2">{limit.min_rest_between_duties}h</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Riposo settimanale min.:</span>
                              <span className="font-semibold ml-2">{limit.min_weekly_rest}h</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Individual Pilot Compliance */}
                  {selectedPilot && selectedPilotData && (
                    <Card>
                      <CardHeader>
                        <CardTitle>
                          Compliance {selectedPilotData.first_name} {selectedPilotData.last_name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {(() => {
                          const compliance = checkFTLCompliance(selectedPilot);
                          const regulation = limits[0];
                          
                          return (
                            <div className="space-y-4">
                              <div className="flex items-center space-x-2">
                                <Badge variant={compliance.compliant ? "default" : "destructive"}>
                                  {compliance.compliant ? "Conforme" : "Non Conforme"}
                                </Badge>
                                {!compliance.compliant && (
                                  <span className="text-sm text-red-600">
                                    {compliance.warnings.length} violazione/i rilevata/e
                                  </span>
                                )}
                              </div>

                              {compliance.hours && (
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                  <div className="text-center p-3 border rounded">
                                    <div className="text-sm text-gray-600 mb-1">Ore Oggi</div>
                                    <div className={`text-xl font-bold ${compliance.hours.dailyHours > regulation.daily_limit ? 'text-red-600' : 'text-green-600'}`}>
                                      {compliance.hours.dailyHours.toFixed(1)}h
                                    </div>
                                    <div className="text-xs text-gray-500">di {regulation.daily_limit}h</div>
                                  </div>
                                  <div className="text-center p-3 border rounded">
                                    <div className="text-sm text-gray-600 mb-1">Ore Settimana</div>
                                    <div className={`text-xl font-bold ${compliance.hours.weeklyHours > regulation.weekly_limit ? 'text-red-600' : 'text-green-600'}`}>
                                      {compliance.hours.weeklyHours.toFixed(1)}h
                                    </div>
                                    <div className="text-xs text-gray-500">di {regulation.weekly_limit}h</div>
                                  </div>
                                  <div className="text-center p-3 border rounded">
                                    <div className="text-sm text-gray-600 mb-1">Ore Mese</div>
                                    <div className={`text-xl font-bold ${compliance.hours.monthlyHours > regulation.monthly_limit ? 'text-red-600' : 'text-green-600'}`}>
                                      {compliance.hours.monthlyHours.toFixed(1)}h
                                    </div>
                                    <div className="text-xs text-gray-500">di {regulation.monthly_limit}h</div>
                                  </div>
                                  <div className="text-center p-3 border rounded">
                                    <div className="text-sm text-gray-600 mb-1">Ore Anno</div>
                                    <div className={`text-xl font-bold ${compliance.hours.yearlyHours > regulation.yearly_limit ? 'text-red-600' : 'text-green-600'}`}>
                                      {compliance.hours.yearlyHours.toFixed(1)}h
                                    </div>
                                    <div className="text-xs text-gray-500">di {regulation.yearly_limit}h</div>
                                  </div>
                                </div>
                              )}

                              {compliance.warnings.length > 0 && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                  <h4 className="font-medium text-red-800 mb-2">Violazioni Rilevate:</h4>
                                  <ul className="space-y-1">
                                    {compliance.warnings.map((warning, index) => (
                                      <li key={index} className="text-sm text-red-700 flex items-center">
                                        <AlertTriangle className="w-4 h-4 mr-2 flex-shrink-0" />
                                        {warning}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          );
                        })()}
                      </CardContent>
                    </Card>
                  )}

                  {/* All Pilots Compliance Summary */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Riepilogo Compliance Tutti i Piloti</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {pilots.map((pilot) => {
                          const compliance = checkFTLCompliance(pilot.id);
                          return (
                            <div key={pilot.id} className="flex items-center justify-between p-3 border rounded">
                              <div className="flex items-center space-x-3">
                                <User className="w-4 h-4 text-gray-400" />
                                <span className="font-medium">
                                  {pilot.first_name} {pilot.last_name}
                                </span>
                                <Badge variant="outline" className="text-xs">
                                  {pilot.position}
                                </Badge>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Badge variant={compliance.compliant ? "default" : "destructive"}>
                                  {compliance.compliant ? "Conforme" : "Non Conforme"}
                                </Badge>
                                {!compliance.compliant && (
                                  <span className="text-xs text-red-600">
                                    {compliance.warnings.length} violazione/i
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trading" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Trading Turni Equipaggio
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center text-gray-500 py-12">
                <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium mb-2">Trading Turni</h3>
                <p className="text-sm">Funzionalità per lo scambio turni tra membri dell'equipaggio</p>
                <p className="text-xs text-gray-400 mt-2">Feature in sviluppo</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <PilotTimeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        pilots={pilots}
      />
    </div>
  );
};
