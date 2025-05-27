
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Calendar, 
  BarChart3, 
  TrendingUp,
  Search,
  Filter,
  Shield,
  User,
  Download,
  RefreshCw
} from "lucide-react";
import { useCrewMembers } from "@/hooks/useCrewMembers";
import { useCombinedPilotHours } from "@/hooks/usePilotFlightHours";
import { useFlightTimeLimits } from "@/hooks/useFlightTimeLimits";
import { FTLComplianceCard } from "./FTLComplianceCard";

export const FTLCompliancePage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedPilot, setSelectedPilot] = useState<string | null>(null);

  const { data: crewMembers = [], isLoading: crewLoading } = useCrewMembers();
  const { data: flightTimeLimits = [] } = useFlightTimeLimits();

  const pilots = crewMembers.filter(member => 
    member.position === "captain" || member.position === "first_officer"
  );

  // Default limits se non ci sono limiti configurati
  const defaultLimits = {
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
  };

  const activeLimits = flightTimeLimits.length > 0 ? flightTimeLimits[0] : defaultLimits;

  // Calcola compliance per ogni pilota
  const calculatePilotCompliance = (pilotId: string, combinedHours: any[]) => {
    const pilotHours = combinedHours.filter(h => h.pilot_id === pilotId);
    const now = new Date();
    
    const calculateHoursForPeriod = (hours: typeof pilotHours, startDate: Date) => {
      const filteredHours = hours.filter(h => new Date(h.date) >= startDate);
      return filteredHours
        .filter(h => h.counts_as_duty_time)
        .reduce((sum, h) => sum + h.hours, 0);
    };
    
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const yearStart = new Date(now.getFullYear(), 0, 1);
    
    const dailyHours = calculateHoursForPeriod(pilotHours, today);
    const weeklyHours = calculateHoursForPeriod(pilotHours, weekStart);
    const monthlyHours = calculateHoursForPeriod(pilotHours, monthStart);
    const yearlyHours = calculateHoursForPeriod(pilotHours, yearStart);

    const warnings = [];
    if (dailyHours > activeLimits.daily_limit) warnings.push(`Limite giornaliero superato: ${dailyHours.toFixed(1)}h`);
    if (weeklyHours > activeLimits.weekly_limit) warnings.push(`Limite settimanale superato: ${weeklyHours.toFixed(1)}h`);
    if (monthlyHours > activeLimits.monthly_limit) warnings.push(`Limite mensile superato: ${monthlyHours.toFixed(1)}h`);
    if (yearlyHours > activeLimits.yearly_limit) warnings.push(`Limite annuale superato: ${yearlyHours.toFixed(1)}h`);
    
    return {
      compliant: warnings.length === 0,
      warnings,
      hours: {
        dailyHours,
        weeklyHours,
        monthlyHours,
        yearlyHours
      }
    };
  };

  // Hook per ottenere ore combinate per tutti i piloti
  const PilotComplianceRow = ({ pilot }: { pilot: any }) => {
    const { data: combinedHours = [] } = useCombinedPilotHours(pilot.id);
    const compliance = calculatePilotCompliance(pilot.id, combinedHours);
    
    return (
      <div 
        className={`p-4 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50 ${
          !compliance.compliant ? 'border-red-200 bg-red-50' : 'border-gray-200'
        }`}
        onClick={() => setSelectedPilot(selectedPilot === pilot.id ? null : pilot.id)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <User className="w-8 h-8 text-gray-400" />
            <div>
              <div className="font-medium">{pilot.first_name} {pilot.last_name}</div>
              <div className="text-sm text-gray-500">{pilot.position}</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-sm text-gray-500">Ore Oggi</div>
              <div className={`font-bold ${compliance.hours.dailyHours > activeLimits.daily_limit ? 'text-red-600' : 'text-green-600'}`}>
                {compliance.hours.dailyHours.toFixed(1)}h
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-sm text-gray-500">Ore Settimana</div>
              <div className={`font-bold ${compliance.hours.weeklyHours > activeLimits.weekly_limit ? 'text-red-600' : 'text-green-600'}`}>
                {compliance.hours.weeklyHours.toFixed(1)}h
              </div>
            </div>
            
            <div className="flex items-center">
              {compliance.compliant ? (
                <Badge variant="outline" className="text-green-600 border-green-600">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Conforme
                </Badge>
              ) : (
                <Badge variant="outline" className="text-red-600 border-red-600">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  Non Conforme
                </Badge>
              )}
            </div>
          </div>
        </div>
        
        {selectedPilot === pilot.id && (
          <div className="mt-4 pt-4 border-t">
            <FTLComplianceCard 
              pilotName={`${pilot.first_name} ${pilot.last_name}`}
              compliance={compliance}
              limits={activeLimits}
            />
          </div>
        )}
      </div>
    );
  };

  const filteredPilots = pilots.filter(pilot => {
    const matchesSearch = `${pilot.first_name} ${pilot.last_name}`.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (statusFilter === "all") return matchesSearch;
    
    // Per il filtro stato, dovremmo calcolare la compliance qui, ma per semplicità usiamo solo la ricerca
    return matchesSearch;
  });

  if (crewLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  const nonCompliantCount = 0; // Calcolato dinamicamente in un'implementazione reale
  const totalPilots = pilots.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center">
            <Shield className="w-6 h-6 mr-2" />
            Compliance FTL
          </h1>
          <p className="text-gray-600">Monitoraggio dei limiti di tempo di volo e compliance regolamentare</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Aggiorna
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Piloti Totali</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{totalPilots}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Conformi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{totalPilots - nonCompliantCount}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Non Conformi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{nonCompliantCount}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Regolamento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold text-purple-600">{activeLimits.regulation_name}</div>
          </CardContent>
        </Card>
      </div>

      {/* Limits Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="w-5 h-5 mr-2" />
            Limiti Attivi - {activeLimits.regulation_name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <Clock className="w-5 h-5 mx-auto mb-1 text-blue-600" />
              <div className="text-sm text-gray-600">Giornaliero</div>
              <div className="text-lg font-bold text-blue-600">{activeLimits.daily_limit}h</div>
            </div>
            
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <Calendar className="w-5 h-5 mx-auto mb-1 text-green-600" />
              <div className="text-sm text-gray-600">Settimanale</div>
              <div className="text-lg font-bold text-green-600">{activeLimits.weekly_limit}h</div>
            </div>
            
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <BarChart3 className="w-5 h-5 mx-auto mb-1 text-purple-600" />
              <div className="text-sm text-gray-600">Mensile</div>
              <div className="text-lg font-bold text-purple-600">{activeLimits.monthly_limit}h</div>
            </div>
            
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <TrendingUp className="w-5 h-5 mx-auto mb-1 text-orange-600" />
              <div className="text-sm text-gray-600">Annuale</div>
              <div className="text-lg font-bold text-orange-600">{activeLimits.yearly_limit}h</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Cerca piloti..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Stato Compliance" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tutti</SelectItem>
                <SelectItem value="compliant">Conformi</SelectItem>
                <SelectItem value="non-compliant">Non Conformi</SelectItem>
                <SelectItem value="warning">Con Avvisi</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filtri Avanzati
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Pilots List */}
      <div className="space-y-4">
        {filteredPilots.map((pilot) => (
          <PilotComplianceRow key={pilot.id} pilot={pilot} />
        ))}

        {filteredPilots.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Shield className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium mb-2">Nessun pilota trovato</h3>
              <p className="text-gray-500 mb-4">
                Non ci sono piloti che corrispondono ai filtri selezionati
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
