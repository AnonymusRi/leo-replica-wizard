
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
  Plane
} from "lucide-react";
import { useCrewMembers } from "@/hooks/useCrewMembers";
import { usePilotFlightHours, usePilotSchedule, useFlightTimeLimits } from "@/hooks/usePilotFlightHours";
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, differenceInHours } from "date-fns";
import { PilotTimeModal } from "./PilotTimeModal";

export const PilotTimeTableModule = () => {
  const [selectedPilot, setSelectedPilot] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("schedule");

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

      {/* FTL Compliance Alert */}
      {selectedPilot && (() => {
        const compliance = checkFTLCompliance(selectedPilot);
        return !compliance.compliant && (
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="text-red-800 flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2" />
                Avvisi FTL - {selectedPilotData?.first_name} {selectedPilotData?.last_name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside text-red-700 space-y-1">
                {compliance.warnings.map((warning, index) => (
                  <li key={index}>{warning}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        );
      })()}

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="hours">Ore di Volo</TabsTrigger>
          <TabsTrigger value="compliance">Compliance FTL</TabsTrigger>
          <TabsTrigger value="trading">Trading</TabsTrigger>
        </TabsList>

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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  Limiti Regolamentari
                </CardTitle>
              </CardHeader>
              <CardContent>
                {limits.map((limit) => (
                  <div key={limit.id} className="space-y-3 p-4 border rounded-lg">
                    <h4 className="font-semibold">{limit.regulation_name}</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Giornaliero:</span>
                        <span className="ml-2 font-medium">{limit.daily_limit}h</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Settimanale:</span>
                        <span className="ml-2 font-medium">{limit.weekly_limit}h</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Mensile:</span>
                        <span className="ml-2 font-medium">{limit.monthly_limit}h</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Annuale:</span>
                        <span className="ml-2 font-medium">{limit.yearly_limit}h</span>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">
                      <div>Riposo minimo tra servizi: {limit.min_rest_between_duties}h</div>
                      <div>Riposo settimanale minimo: {limit.min_weekly_rest}h</div>
                    </div>
                  </div>
                ))}
                {limits.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    Nessuna regolamentazione configurata
                  </div>
                )}
              </CardContent>
            </Card>

            {selectedPilot && limits.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Status Compliance - {selectedPilotData?.first_name} {selectedPilotData?.last_name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {(() => {
                    const compliance = checkFTLCompliance(selectedPilot);
                    const hours = compliance.hours;
                    const regulation = limits[0];
                    
                    return (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-3 border rounded-lg">
                            <div className="text-sm text-gray-600">Oggi</div>
                            <div className="text-lg font-semibold">
                              {hours?.dailyHours.toFixed(1)}h / {regulation.daily_limit}h
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                              <div 
                                className={`h-2 rounded-full ${
                                  (hours?.dailyHours || 0) > regulation.daily_limit ? 'bg-red-500' : 'bg-green-500'
                                }`}
                                style={{ width: `${Math.min(((hours?.dailyHours || 0) / regulation.daily_limit) * 100, 100)}%` }}
                              />
                            </div>
                          </div>
                          
                          <div className="p-3 border rounded-lg">
                            <div className="text-sm text-gray-600">Settimana</div>
                            <div className="text-lg font-semibold">
                              {hours?.weeklyHours.toFixed(1)}h / {regulation.weekly_limit}h
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                              <div 
                                className={`h-2 rounded-full ${
                                  (hours?.weeklyHours || 0) > regulation.weekly_limit ? 'bg-red-500' : 'bg-green-500'
                                }`}
                                style={{ width: `${Math.min(((hours?.weeklyHours || 0) / regulation.weekly_limit) * 100, 100)}%` }}
                              />
                            </div>
                          </div>
                          
                          <div className="p-3 border rounded-lg">
                            <div className="text-sm text-gray-600">Mese</div>
                            <div className="text-lg font-semibold">
                              {hours?.monthlyHours.toFixed(1)}h / {regulation.monthly_limit}h
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                              <div 
                                className={`h-2 rounded-full ${
                                  (hours?.monthlyHours || 0) > regulation.monthly_limit ? 'bg-red-500' : 'bg-green-500'
                                }`}
                                style={{ width: `${Math.min(((hours?.monthlyHours || 0) / regulation.monthly_limit) * 100, 100)}%` }}
                              />
                            </div>
                          </div>
                          
                          <div className="p-3 border rounded-lg">
                            <div className="text-sm text-gray-600">Anno</div>
                            <div className="text-lg font-semibold">
                              {hours?.yearlyHours.toFixed(1)}h / {regulation.yearly_limit}h
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                              <div 
                                className={`h-2 rounded-full ${
                                  (hours?.yearlyHours || 0) > regulation.yearly_limit ? 'bg-red-500' : 'bg-green-500'
                                }`}
                                style={{ width: `${Math.min(((hours?.yearlyHours || 0) / regulation.yearly_limit) * 100, 100)}%` }}
                              />
                            </div>
                          </div>
                        </div>
                        
                        <div className={`p-3 rounded-lg ${compliance.compliant ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                          <div className={`font-semibold ${compliance.compliant ? 'text-green-800' : 'text-red-800'}`}>
                            {compliance.compliant ? 'Compliance OK' : 'Violazioni FTL Rilevate'}
                          </div>
                          {!compliance.compliant && (
                            <ul className="mt-2 text-sm text-red-700 list-disc list-inside">
                              {compliance.warnings.map((warning, index) => (
                                <li key={index}>{warning}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    );
                  })()}
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="trading" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Trading e Scambi Turni
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center py-8 text-gray-500">
                  <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium mb-2">Sistema Trading</h3>
                  <p className="text-sm">Funzionalità per scambio turni tra piloti in sviluppo</p>
                </div>
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
