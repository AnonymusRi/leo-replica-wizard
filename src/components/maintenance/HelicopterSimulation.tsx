
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Plane, 
  Users, 
  Calendar, 
  Activity,
  AlertTriangle,
  TrendingUp,
  Clock,
  Wrench
} from "lucide-react";
import { useHelicopterSimulation } from "@/hooks/useHelicopterSimulation";
import { useFlights } from "@/hooks/useFlights";
import { useMaintenanceRecords } from "@/hooks/useMaintenanceRecords";
import { useCrewMembers } from "@/hooks/useCrewMembers";
import { useAircraft } from "@/hooks/useAircraft";

export const HelicopterSimulation = () => {
  const simulationMutation = useHelicopterSimulation();
  const { data: flightsData } = useFlights(50, 0);
  const flights = flightsData?.data || [];
  const { data: maintenanceData } = useMaintenanceRecords(50, 0);
  const maintenanceRecords = maintenanceData?.data || [];
  const { data: crewMembers = [] } = useCrewMembers();
  const { data: aircraft = [] } = useAircraft();

  // Statistiche attuali
  const helicopters = aircraft.filter(a => a.aircraft_type === 'helicopter');
  const pilots = crewMembers.filter(c => c.position === 'captain' || c.position === 'first_officer');
  const mechanics = crewMembers.filter(c => c.position === 'mechanic');
  const cabinCrew = crewMembers.filter(c => c.position === 'cabin_crew');
  
  const passengerFlights = flights.filter(f => f.flight_number?.startsWith('TRM'));
  const rescueFlights = flights.filter(f => f.flight_number?.startsWith('RESC'));
  const completedFlights = flights.filter(f => f.status === 'completed');
  
  // Calcoli stress test
  const totalFlightHours = completedFlights.length * 1.2; // Media 1.2h per volo
  const avgFlightHoursPerPilot = totalFlightHours / pilots.length;
  const avgFlightHoursPerHelicopter = totalFlightHours / helicopters.length;
  
  const getStressLevel = (hours: number, type: 'pilot' | 'helicopter') => {
    const limits = type === 'pilot' ? { low: 80, medium: 120, high: 160 } : { low: 100, medium: 200, high: 300 };
    
    if (hours < limits.low) return { level: 'low', color: 'bg-green-100 text-green-800' };
    if (hours < limits.medium) return { level: 'medium', color: 'bg-yellow-100 text-yellow-800' };
    if (hours < limits.high) return { level: 'high', color: 'bg-orange-100 text-orange-800' };
    return { level: 'critical', color: 'bg-red-100 text-red-800' };
  };

  const pilotStress = getStressLevel(avgFlightHoursPerPilot, 'pilot');
  const helicopterStress = getStressLevel(avgFlightHoursPerHelicopter, 'helicopter');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Simulazione Compagnia Elicotteri</h2>
          <p className="text-gray-600">
            Simulazione 5 mesi di operazioni: trasporto passeggeri Foggia-Tremiti ed elisoccorso
          </p>
        </div>
        <Button 
          onClick={() => simulationMutation.mutate()}
          disabled={simulationMutation.isPending}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {simulationMutation.isPending ? 'Generando...' : 'Avvia Simulazione'}
        </Button>
      </div>

      {/* Configurazione Compagnia */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Plane className="w-4 h-4 mr-2" />
              Elicotteri
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{helicopters.length}</div>
            <div className="text-xs text-gray-500 mt-1">
              2 AW139 (passeggeri) + 8 AW109 (soccorso)
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Users className="w-4 h-4 mr-2" />
              Piloti
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{pilots.length}</div>
            <div className="text-xs text-gray-500 mt-1">
              4 Comandanti + 4 Primi Ufficiali
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Wrench className="w-4 h-4 mr-2" />
              Supporto
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{mechanics.length + cabinCrew.length}</div>
            <div className="text-xs text-gray-500 mt-1">
              {mechanics.length} Meccanici + {cabinCrew.length} Hostess
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Activity className="w-4 h-4 mr-2" />
              Operazioni
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{flights.length}</div>
            <div className="text-xs text-gray-500 mt-1">
              Voli totali generati
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analisi Operazioni */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Dettaglio Operazioni
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Voli Foggia-Tremiti</span>
              <Badge variant="outline">{passengerFlights.length}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Missioni Elisoccorso</span>
              <Badge variant="outline">{rescueFlights.length}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Voli Completati</span>
              <Badge variant="outline" className="bg-green-100 text-green-800">
                {completedFlights.length}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Record Manutenzione</span>
              <Badge variant="outline">{maintenanceRecords.length}</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2" />
              Stress Test - Analisi Carico Lavoro
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Carico Piloti</span>
                <Badge className={pilotStress.color}>
                  {avgFlightHoursPerPilot.toFixed(1)}h/mese
                </Badge>
              </div>
              <div className="text-xs text-gray-500">
                Media ore di volo per pilota negli ultimi 5 mesi
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Utilizzo Elicotteri</span>
                <Badge className={helicopterStress.color}>
                  {avgFlightHoursPerHelicopter.toFixed(1)}h/mese
                </Badge>
              </div>
              <div className="text-xs text-gray-500">
                Media ore di volo per elicottero negli ultimi 5 mesi
              </div>
            </div>

            <div className="pt-2 border-t">
              <div className="text-xs text-gray-500 space-y-1">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-100 rounded mr-2"></div>
                  <span>Normale (entro limiti)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-yellow-100 rounded mr-2"></div>
                  <span>Attenzione (vicino ai limiti)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-100 rounded mr-2"></div>
                  <span>Critico (oltre i limiti)</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rotte Operative */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            Rotte e Missioni
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">Trasporto Passeggeri</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Rotta: LIBF ↔ LIIT</span>
                  <Badge variant="secondary">Foggia-Tremiti</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Frequenza:</span>
                  <span>4 voli/giorno (LUN-SAB)</span>
                </div>
                <div className="flex justify-between">
                  <span>Elicotteri:</span>
                  <span>2x Leonardo AW139</span>
                </div>
                <div className="flex justify-between">
                  <span>Capacità:</span>
                  <span>12 passeggeri</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-3">Elisoccorso</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Area: Puglia</span>
                  <Badge variant="secondary">LIBN</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Area: Campania</span>
                  <Badge variant="secondary">LIRN</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Elicotteri:</span>
                  <span>8x Leonardo AW109</span>
                </div>
                <div className="flex justify-between">
                  <span>Missioni:</span>
                  <span>2-8 al giorno (24/7)</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
