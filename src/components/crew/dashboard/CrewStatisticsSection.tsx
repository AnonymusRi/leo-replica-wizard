
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, TrendingUp, Clock, Plane } from "lucide-react";
import { useCrewStatistics, useCurrentMonthStatistics } from "@/hooks/useCrewStatistics";
import { format } from "date-fns";
import { it } from "date-fns/locale";

interface CrewStatisticsSectionProps {
  crewMemberId: string;
}

export const CrewStatisticsSection = ({ crewMemberId }: CrewStatisticsSectionProps) => {
  const { data: statistics = [] } = useCrewStatistics(crewMemberId, 12);
  const { data: currentMonth } = useCurrentMonthStatistics(crewMemberId);

  const totalFlightHours = statistics.reduce((sum, stat) => sum + stat.total_flight_hours, 0);
  const totalFlights = statistics.reduce((sum, stat) => sum + stat.total_flights, 0);
  const averageRating = statistics.length > 0 
    ? statistics.reduce((sum, stat) => sum + (stat.performance_rating || 0), 0) / statistics.filter(s => s.performance_rating).length
    : 0;

  return (
    <div className="space-y-6">
      {/* Current Month Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Ore Volo (Mese)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {currentMonth?.total_flight_hours || 0}h
            </div>
            <p className="text-sm text-gray-500">Mese corrente</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Voli (Mese)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {currentMonth?.total_flights || 0}
            </div>
            <p className="text-sm text-gray-500">Voli completati</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Ore Servizio (Mese)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {currentMonth?.total_duty_hours || 0}h
            </div>
            <p className="text-sm text-gray-500">Ore di servizio</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Giorni Liberi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {currentMonth?.days_off || 0}
            </div>
            <p className="text-sm text-gray-500">Giorni di riposo</p>
          </CardContent>
        </Card>
      </div>

      {/* Annual Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="w-5 h-5" />
              <span>Totale Annuale</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Ore di Volo</span>
              <span className="font-bold text-lg">{totalFlightHours.toFixed(1)}h</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Numero Voli</span>
              <span className="font-bold text-lg">{totalFlights}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Valutazione Media</span>
              <span className="font-bold text-lg">
                {averageRating > 0 ? averageRating.toFixed(1) : 'N/A'}/10
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5" />
              <span>Performance</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Ore Notturne</span>
              <span className="font-bold text-lg">
                {statistics.reduce((sum, stat) => sum + stat.night_hours, 0).toFixed(1)}h
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Ore Simulatore</span>
              <span className="font-bold text-lg">
                {statistics.reduce((sum, stat) => sum + stat.simulator_hours, 0).toFixed(1)}h
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Violazioni FTL</span>
              <span className="font-bold text-lg text-red-600">
                {statistics.reduce((sum, stat) => sum + stat.ftl_violations, 0)}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5" />
              <span>Formazione</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Ore Formazione</span>
              <span className="font-bold text-lg">
                {statistics.reduce((sum, stat) => sum + stat.training_hours, 0).toFixed(1)}h
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Settori Volati</span>
              <span className="font-bold text-lg">
                {statistics.reduce((sum, stat) => sum + stat.total_sectors, 0)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Giorni Liberi</span>
              <span className="font-bold text-lg">
                {statistics.reduce((sum, stat) => sum + stat.days_off, 0)}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Statistiche Mensili</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {statistics.map((stat) => (
              <div key={stat.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">
                    {format(new Date(stat.month_year), "MMMM yyyy", { locale: it })}
                  </h4>
                  {stat.performance_rating && (
                    <Badge variant="outline">
                      Valutazione: {stat.performance_rating}/10
                    </Badge>
                  )}
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Ore Volo</p>
                    <p className="font-medium">{stat.total_flight_hours}h</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Voli</p>
                    <p className="font-medium">{stat.total_flights}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Ore Servizio</p>
                    <p className="font-medium">{stat.total_duty_hours}h</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Giorni Liberi</p>
                    <p className="font-medium">{stat.days_off}</p>
                  </div>
                </div>
                
                {stat.ftl_violations > 0 && (
                  <div className="mt-3 pt-3 border-t">
                    <Badge variant="destructive">
                      {stat.ftl_violations} Violazione{stat.ftl_violations > 1 ? 'i' : ''} FTL
                    </Badge>
                  </div>
                )}
              </div>
            ))}
            
            {statistics.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <BarChart3 className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                <p>Nessuna statistica disponibile</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
