
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
  TrendingUp
} from "lucide-react";
import { usePilotFlightHours } from "@/hooks/usePilotFlightHours";
import { useCrewMembers } from "@/hooks/useCrewMembers";
import { FTLComplianceCard } from "./FTLComplianceCard";
import { format } from "date-fns";
import { it } from "date-fns/locale";

export const FlightHoursModule = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPilot, setSelectedPilot] = useState<string>("all");
  const [selectedFlightType, setSelectedFlightType] = useState<string>("all");

  const { data: flightHours = [], isLoading: hoursLoading } = usePilotFlightHours(
    selectedPilot !== "all" ? selectedPilot : undefined
  );
  const { data: crewMembers = [], isLoading: crewLoading } = useCrewMembers();

  const pilots = crewMembers.filter(member => 
    member.position === "captain" || member.position === "first_officer"
  );

  const filteredHours = flightHours.filter(hour => {
    const pilot = pilots.find(p => p.id === hour.pilot_id);
    const pilotName = pilot ? `${pilot.first_name} ${pilot.last_name}` : '';
    
    const matchesSearch = pilotName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hour.flight_type.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFlightType = selectedFlightType === "all" || hour.flight_type === selectedFlightType;
    
    return matchesSearch && matchesFlightType;
  });

  // Calcola le ore totali per il pilota selezionato
  const calculatePilotHours = (pilotId: string) => {
    const pilotHours = flightHours.filter(h => h.pilot_id === pilotId);
    const now = new Date();
    
    const dailyHours = pilotHours
      .filter(h => new Date(h.flight_date).toDateString() === now.toDateString())
      .reduce((sum, h) => sum + Number(h.flight_hours), 0);
    
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    const weeklyHours = pilotHours
      .filter(h => new Date(h.flight_date) >= weekStart)
      .reduce((sum, h) => sum + Number(h.flight_hours), 0);
    
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthlyHours = pilotHours
      .filter(h => new Date(h.flight_date) >= monthStart)
      .reduce((sum, h) => sum + Number(h.flight_hours), 0);
    
    const yearStart = new Date(now.getFullYear(), 0, 1);
    const yearlyHours = pilotHours
      .filter(h => new Date(h.flight_date) >= yearStart)
      .reduce((sum, h) => sum + Number(h.flight_hours), 0);

    return { dailyHours, weeklyHours, monthlyHours, yearlyHours };
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
      hours
    };
  };

  const getFlightTypeLabel = (type: string) => {
    const types = {
      'commercial': 'Commerciale',
      'training': 'Addestramento',
      'positioning': 'Posizionamento',
      'maintenance': 'Manutenzione',
      'charter': 'Charter'
    };
    return types[type as keyof typeof types] || type;
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
            Ore di Volo
          </h1>
          <p className="text-gray-600">Gestione e monitoraggio ore di volo piloti</p>
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
                placeholder="Cerca per pilota o tipo volo..."
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

            <Select value={selectedFlightType} onValueChange={setSelectedFlightType}>
              <SelectTrigger>
                <SelectValue placeholder="Tipo volo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tutti i tipi</SelectItem>
                <SelectItem value="commercial">Commerciale</SelectItem>
                <SelectItem value="training">Addestramento</SelectItem>
                <SelectItem value="positioning">Posizionamento</SelectItem>
                <SelectItem value="maintenance">Manutenzione</SelectItem>
                <SelectItem value="charter">Charter</SelectItem>
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

      {/* Flight Hours Records */}
      <div className="grid gap-4">
        {filteredHours.map((hour) => {
          const pilot = pilots.find(p => p.id === hour.pilot_id);
          
          return (
            <Card key={hour.id}>
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
                        <Plane className="w-3 h-3 mr-1" />
                        {getFlightTypeLabel(hour.flight_type)}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        {format(new Date(hour.flight_date), "dd MMM yyyy", { locale: it })}
                      </div>
                      
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2" />
                        {Number(hour.flight_hours).toFixed(1)}h
                      </div>
                      
                      {hour.flight_id && (
                        <div className="flex items-center">
                          <Plane className="w-4 h-4 mr-2" />
                          Volo ID: {hour.flight_id.substring(0, 8)}
                        </div>
                      )}
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
              <h3 className="text-lg font-medium mb-2">Nessuna ora di volo trovata</h3>
              <p className="text-gray-500 mb-4">
                Non ci sono ore di volo che corrispondono ai filtri selezionati
              </p>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Aggiungi prime ore di volo
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
              Riepilogo Ore di Volo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {pilots.map((pilot) => {
                const pilotHours = flightHours.filter(h => h.pilot_id === pilot.id);
                const totalHours = pilotHours.reduce((sum, h) => sum + Number(h.flight_hours), 0);
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
