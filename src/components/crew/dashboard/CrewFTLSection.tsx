
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Clock, AlertTriangle, CheckCircle, Shield } from "lucide-react";
import { useCrewFlightAssignments } from "@/hooks/useCrewFlightAssignments";
import { useFlightTimeLimits } from "@/hooks/useFlightTimeLimits";
import { format, subDays, isAfter, isBefore, addHours } from "date-fns";
import { it } from "date-fns/locale";

interface CrewFTLSectionProps {
  crewMemberId: string;
}

export const CrewFTLSection = ({ crewMemberId }: CrewFTLSectionProps) => {
  const { data: assignments = [] } = useCrewFlightAssignments();
  const { data: ftlLimits = [] } = useFlightTimeLimits();

  // Filter assignments for this crew member
  const myAssignments = assignments.filter(assignment => assignment.crew_member_id === crewMemberId);

  // Calculate current periods
  const now = new Date();
  const last24Hours = myAssignments.filter(assignment => {
    const startTime = new Date(assignment.duty_start_time || 0);
    return isAfter(startTime, subDays(now, 1));
  });

  const last7Days = myAssignments.filter(assignment => {
    const startTime = new Date(assignment.duty_start_time || 0);
    return isAfter(startTime, subDays(now, 7));
  });

  const last28Days = myAssignments.filter(assignment => {
    const startTime = new Date(assignment.duty_start_time || 0);
    return isAfter(startTime, subDays(now, 28));
  });

  // Calculate totals - ensure values are numbers
  const daily = {
    flight: last24Hours.reduce((sum, a) => sum + (Number(a.flight_time_hours) || 0), 0),
    duty: last24Hours.reduce((sum, a) => sum + (Number(a.duty_time_hours) || 0), 0)
  };

  const weekly = {
    flight: last7Days.reduce((sum, a) => sum + (Number(a.flight_time_hours) || 0), 0),
    duty: last7Days.reduce((sum, a) => sum + (Number(a.duty_time_hours) || 0), 0)
  };

  const monthly = {
    flight: last28Days.reduce((sum, a) => sum + (Number(a.flight_time_hours) || 0), 0),
    duty: last28Days.reduce((sum, a) => sum + (Number(a.duty_time_hours) || 0), 0)
  };

  // Get default FTL limits (EASA standard)
  const defaultLimits = {
    dailyDuty: 14,
    dailyFlight: 13,
    weeklyDuty: 60,
    weeklyFlight: 100,
    monthlyDuty: 190,
    monthlyFlight: 100
  };

  // Check for violations
  const violations = [];
  if (daily.duty > defaultLimits.dailyDuty) {
    violations.push({ type: 'daily_duty', current: daily.duty, limit: defaultLimits.dailyDuty });
  }
  if (daily.flight > defaultLimits.dailyFlight) {
    violations.push({ type: 'daily_flight', current: daily.flight, limit: defaultLimits.dailyFlight });
  }
  if (weekly.duty > defaultLimits.weeklyDuty) {
    violations.push({ type: 'weekly_duty', current: weekly.duty, limit: defaultLimits.weeklyDuty });
  }
  if (weekly.flight > defaultLimits.weeklyFlight) {
    violations.push({ type: 'weekly_flight', current: weekly.flight, limit: defaultLimits.weeklyFlight });
  }

  const getComplianceStatus = (current: number, limit: number) => {
    const percentage = (current / limit) * 100;
    if (percentage >= 100) return { status: 'violation', color: 'red' };
    if (percentage >= 80) return { status: 'warning', color: 'yellow' };
    return { status: 'compliant', color: 'green' };
  };

  return (
    <div className="space-y-6">
      {/* Violations Alert */}
      {violations.length > 0 && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>Attenzione:</strong> Rilevate {violations.length} violazione{violations.length > 1 ? 'i' : ''} FTL.
            Contattare immediatamente il dipartimento operazioni.
          </AlertDescription>
        </Alert>
      )}

      {/* Current Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              Stato FTL
            </CardTitle>
          </CardHeader>
          <CardContent>
            {violations.length === 0 ? (
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-green-600 font-medium">Conforme</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <span className="text-red-600 font-medium">Non Conforme</span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Prossimo Riposo Minimo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">10h</div>
            <p className="text-sm text-gray-500">Richiesto tra turni</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Ultimo Riposo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">12h</div>
            <p className="text-sm text-gray-500">Durata ultimo riposo</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed FTL Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="w-5 h-5" />
              <span>Limiti Giornalieri (24h)</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Ore di Servizio</span>
                <Badge 
                  variant="outline" 
                  className={`bg-${getComplianceStatus(daily.duty, defaultLimits.dailyDuty).color}-100 text-${getComplianceStatus(daily.duty, defaultLimits.dailyDuty).color}-800`}
                >
                  {(Number(daily.duty) || 0).toFixed(1)}/{defaultLimits.dailyDuty}h
                </Badge>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full bg-${getComplianceStatus(daily.duty, defaultLimits.dailyDuty).color}-600`}
                  style={{ width: `${Math.min((daily.duty / defaultLimits.dailyDuty) * 100, 100)}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Ore di Volo</span>
                <Badge 
                  variant="outline" 
                  className={`bg-${getComplianceStatus(daily.flight, defaultLimits.dailyFlight).color}-100 text-${getComplianceStatus(daily.flight, defaultLimits.dailyFlight).color}-800`}
                >
                  {(Number(daily.flight) || 0).toFixed(1)}/{defaultLimits.dailyFlight}h
                </Badge>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full bg-${getComplianceStatus(daily.flight, defaultLimits.dailyFlight).color}-600`}
                  style={{ width: `${Math.min((daily.flight / defaultLimits.dailyFlight) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="w-5 h-5" />
              <span>Limiti Settimanali (7 giorni)</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Ore di Servizio</span>
                <Badge 
                  variant="outline" 
                  className={`bg-${getComplianceStatus(weekly.duty, defaultLimits.weeklyDuty).color}-100 text-${getComplianceStatus(weekly.duty, defaultLimits.weeklyDuty).color}-800`}
                >
                  {(Number(weekly.duty) || 0).toFixed(1)}/{defaultLimits.weeklyDuty}h
                </Badge>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full bg-${getComplianceStatus(weekly.duty, defaultLimits.weeklyDuty).color}-600`}
                  style={{ width: `${Math.min((weekly.duty / defaultLimits.weeklyDuty) * 100, 100)}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Ore di Volo</span>
                <Badge 
                  variant="outline" 
                  className={`bg-${getComplianceStatus(weekly.flight, defaultLimits.weeklyFlight).color}-100 text-${getComplianceStatus(weekly.flight, defaultLimits.weeklyFlight).color}-800`}
                >
                  {(Number(weekly.flight) || 0).toFixed(1)}/{defaultLimits.weeklyFlight}h
                </Badge>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full bg-${getComplianceStatus(weekly.flight, defaultLimits.weeklyFlight).color}-600`}
                  style={{ width: `${Math.min((weekly.flight / defaultLimits.weeklyFlight) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Attività Recente (Ultimi 7 giorni)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {last7Days.slice(0, 10).map((assignment) => (
              <div key={assignment.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="font-medium">
                    {assignment.duty_start_time && format(new Date(assignment.duty_start_time), "dd MMM yyyy", { locale: it })}
                  </div>
                  <div className="text-sm text-gray-600">
                    {assignment.duty_start_time && assignment.duty_end_time && (
                      <>
                        {format(new Date(assignment.duty_start_time), "HH:mm")} - {format(new Date(assignment.duty_end_time), "HH:mm")}
                      </>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">
                    Volo: {assignment.flight_time_hours || 0}h
                  </div>
                  <div className="text-sm text-gray-600">
                    Servizio: {assignment.duty_time_hours || 0}h
                  </div>
                </div>
              </div>
            ))}
            
            {last7Days.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Clock className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                <p>Nessuna attività registrata negli ultimi 7 giorni</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
