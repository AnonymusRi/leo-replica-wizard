
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { 
  Clock, 
  Plus, 
  Search, 
  Filter,
  Calendar,
  User,
  Plane,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  GraduationCap
} from "lucide-react";
import { useCombinedPilotHours, usePilotFlightHours } from "@/hooks/usePilotFlightHours";
import { useCrewMembers } from "@/hooks/useCrewMembers";
import { FTLComplianceCard } from "./FTLComplianceCard";
import { format } from "date-fns";
import { it } from "date-fns/locale";

export const FlightHoursModule = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPilot, setSelectedPilot] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");

  const { data: combinedHours = [], isLoading: hoursLoading } = useCombinedPilotHours(
    selectedPilot !== "all" ? selectedPilot : undefined
  );
  const { data: crewMembers = [], isLoading: crewLoading } = useCrewMembers();

  const pilots = crewMembers.filter(member => 
    member.position === "captain" || member.position === "first_officer"
  );

  const filteredHours = combinedHours.filter(hour => {
    const pilot = pilots.find(p => p.id === hour.pilot_id);
    const pilotName = pilot ? `${pilot.first_name} ${pilot.last_name}` : '';
    
    const matchesSearch = pilotName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hour.type.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = selectedType === "all" || hour.type === selectedType;
    
    return matchesSearch && matchesType;
  });

  // Calcola le ore totali per il pilota selezionato considerando duty time e flight time
  const calculatePilotHours = (pilotId: string) => {
    const pilotHours = combinedHours.filter(h => h.pilot_id === pilotId);
    const now = new Date();
    
    const calculateHoursForPeriod = (hours: typeof pilotHours, startDate: Date) => {
      const filteredHours = hours.filter(h => new Date(h.date) >= startDate);
      
      const dutyHours = filteredHours
        .filter(h => h.counts_as_duty_time)
        .reduce((sum, h) => sum + h.hours, 0);
      
      const flightHours = filteredHours
        .filter(h => h.counts_as_flight_time)
        .reduce((sum, h) => sum + h.hours, 0);
      
      return { dutyHours, flightHours };
    };
    
    // Calcola per diversi periodi
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const yearStart = new Date(now.getFullYear(), 0, 1);
    
    const daily = calculateHoursForPeriod(pilotHours, today);
    const weekly = calculateHoursForPeriod(pilotHours, weekStart);
    const monthly = calculateHoursForPeriod(pilotHours, monthStart);
    const yearly = calculateHoursForPeriod(pilotHours, yearStart);

    return {
      dailyHours: daily.dutyHours, // Per FTL usiamo duty time
      weeklyHours: weekly.dutyHours,
      monthlyHours: monthly.dutyHours,
      yearlyHours: yearly.dutyHours,
      dailyFlightHours: daily.flightHours,
      weeklyFlightHours: weekly.flightHours,
      monthlyFlightHours: monthly.flightHours,
      yearlyFlightHours: yearly.flightHours
    };
  };

  // Determina compliance per il pilota selezionato
  const getComplianceForPilot = (pilotId: string) => {
    const hours = calculatePilotHours(pilotId);
    const warnings = [];
    
    if (hours.dailyHours > 8) warnings.push(`Limite giornaliero superato: ${hours.dailyHours.toFixed(1)}h`);
    if (hours.weeklyHours > 40) warnings.push(`Limite settimanale superato: ${hours.weeklyHours.toFixed(1)}h`);
    if (hours.monthlyHours > 100) warnings.push(`Limite mensile superato: ${hours.monthlyHours.toFixed(1)}h`);
    if (hours.yearlyHours > 1000) warnings.push(`Limite annuale superato: ${hours.yearlyHours.toFixed(1)}h`);
    
    return {
      compliant: warnings.length === 0,
      warnings,
      hours: {
        dailyHours: hours.dailyHours,
        weeklyHours: hours.weeklyHours,
        monthlyHours: hours.monthlyHours,
        yearlyHours: hours.yearlyHours
      }
    };
  };

  const getTypeIcon = (type: string) => {
    return type === 'training' ? <GraduationCap className="w-3 h-3 mr-1" /> : <Plane className="w-3 h-3 mr-1" />;
  };

  const getTypeLabel = (type: string) => {
    return type === 'training' ? 'Addestramento' : 'Volo';
  };

  if (crewLoading || hoursLoading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center">
            <Clock className="w-6 h-6 mr-2" />
            Ore di Volo e Addestramento
          </h1>
          <p className="text-gray-600">Gestione e monitoraggio ore di volo e addestramento piloti</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Aggiungi Ore
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Cerca per pilota..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={selectedPilot} onValueChange={setSelectedPilot}>
              <SelectTrigger>
                <SelectValue placeholder="Filtra per pilota" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tutti i piloti</SelectItem>
                {pilots.map((pilot) => (
                  <SelectItem key={pilot.id} value={pilot.id}>
                    {pilot.first_name} {pilot.last_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger>
                <SelectValue placeholder="Tipo attività" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tutti i tipi</SelectItem>
                <SelectItem value="flight">Volo</SelectItem>
                <SelectItem value="training">Addestramento</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filtri Avanzati
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* FTL Compliance per pilota selezionato */}
      {selectedPilot !== "all" && (
        <div>
          {(() => {
            const pilot = pilots.find(p => p.id === selectedPilot);
            const compliance = getComplianceForPilot(selectedPilot);
            
            return (
              <FTLComplianceCard 
                pilotName={pilot ? `${pilot.first_name} ${pilot.last_name}` : 'Pilota'}
                compliance={compliance}
                limits={{
                  id: "default-limit",
                  regulation_name: "EASA FTL",
                  daily_limit: 8,
                  weekly_limit: 40,
                  monthly_limit: 100,
                  yearly_limit: 1000,
                  min_rest_between_duties: 12,
                  min_weekly_rest: 36,
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString()
                }}
              />
            );
          })()}
        </div>
      )}

      {/* Records */}
      <div className="grid gap-4">
        {filteredHours.map((hour) => {
          const pilot = pilots.find(p => p.id === hour.pilot_id);
          
          return (
            <Card key={`${hour.source}-${hour.id}`}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="font-medium">
                          {pilot ? `${pilot.first_name} ${pilot.last_name}` : 'Pilota non trovato'}
                        </span>
                      </div>
                      
                      <Badge variant="outline">
                        {getTypeIcon(hour.type)}
                        {getTypeLabel(hour.type)}
                      </Badge>

                      {hour.counts_as_duty_time && (
                        <Badge variant="secondary" className="text-blue-600">
                          Duty Time
                        </Badge>
                      )}

                      {hour.counts_as_flight_time && (
                        <Badge variant="secondary" className="text-green-600">
                          Flight Time
                        </Badge>
                      )}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        {format(new Date(hour.date), "dd MMM yyyy", { locale: it })}
                      </div>
                      
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2" />
                        {hour.hours.toFixed(1)}h
                      </div>
                      
                      <div className="flex items-center">
                        <span className="text-xs text-gray-500">
                          Fonte: {hour.source === 'flight_hours' ? 'Ore Volo' : 'Addestramento'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Button variant="ghost" size="sm">
                    •••
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {filteredHours.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Clock className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium mb-2">Nessuna attività trovata</h3>
              <p className="text-gray-500 mb-4">
                Non ci sono ore di volo o addestramento che corrispondono ai filtri selezionati
              </p>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Aggiungi prima attività
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Summary per tutti i piloti */}
      {selectedPilot === "all" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              Riepilogo Attività Piloti
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {pilots.map((pilot) => {
                const pilotHours = combinedHours.filter(h => h.pilot_id === pilot.id);
                const totalHours = pilotHours.reduce((sum, h) => sum + h.hours, 0);
                const compliance = getComplianceForPilot(pilot.id);
                
                return (
                  <div key={pilot.id} className="text-center p-4 border rounded-lg">
                    <div className="font-medium mb-1">
                      {pilot.first_name} {pilot.last_name}
                    </div>
                    <div className="text-2xl font-bold mb-2">
                      {totalHours.toFixed(1)}h
                    </div>
                    <div className="flex items-center justify-center">
                      {compliance.compliant ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-red-500" />
                      )}
                      <span className={`ml-1 text-xs ${compliance.compliant ? 'text-green-600' : 'text-red-600'}`}>
                        {compliance.compliant ? 'Conforme' : 'Non conforme'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
