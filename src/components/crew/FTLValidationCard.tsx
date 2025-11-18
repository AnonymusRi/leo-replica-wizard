
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Shield, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { usePilotSchedule, usePilotTrainingHours } from "@/hooks/usePilotSchedule";
import { useCrewMembers } from "@/hooks/useCrewMembers";
import { format, differenceInHours } from "date-fns";

interface FTLValidationCardProps {
  selectedCrewMember?: string;
  weekStart: Date;
  weekEnd: Date;
}

export const FTLValidationCard = ({ selectedCrewMember, weekStart, weekEnd }: FTLValidationCardProps) => {
  const { data: crewMembers = [] } = useCrewMembers();
  const { data: schedules = [] } = usePilotSchedule(
    selectedCrewMember,
    {
      start: format(weekStart, 'yyyy-MM-dd'),
      end: format(weekEnd, 'yyyy-MM-dd')
    }
  );

  const { data: trainingHours = [] } = usePilotTrainingHours(
    selectedCrewMember,
    {
      start: format(weekStart, 'yyyy-MM-dd'),
      end: format(weekEnd, 'yyyy-MM-dd')
    }
  );

  // Calculate FTL compliance for the selected period
  const calculateFTLCompliance = () => {
    if (!selectedCrewMember || schedules.length === 0) {
      return {
        weeklyHours: 0,
        dailyMax: 0,
        violations: [],
        restViolations: [],
        complianceScore: 100
      };
    }

    let weeklyHours = 0;
    let dailyMax = 0;
    const violations: string[] = [];
    const restViolations: string[] = [];

    // Calculate total flight duty hours
    const flightDutySchedules = schedules.filter(s => s.schedule_type === 'flight_duty');
    
    flightDutySchedules.forEach(schedule => {
      const duration = differenceInHours(
        new Date(schedule.end_date),
        new Date(schedule.start_date)
      );
      
      weeklyHours += duration;
      
      if (duration > dailyMax) {
        dailyMax = duration;
      }

      // Check daily limits
      if (duration > 14) {
        violations.push(`${format(new Date(schedule.start_date), 'dd/MM')}: Superato limite giornaliero (${duration}h)`);
      }

      // Check night duty limits
      const startHour = new Date(schedule.start_date).getHours();
      if (startHour >= 22 || startHour <= 6) {
        if (duration > 10) {
          violations.push(`${format(new Date(schedule.start_date), 'dd/MM')}: Superato limite notturno (${duration}h)`);
        }
      }
    });

    // Check weekly limits
    if (weeklyHours > 60) {
      violations.push(`Superato limite settimanale: ${weeklyHours}h/60h`);
    }

    // Check rest periods
    for (let i = 0; i < flightDutySchedules.length - 1; i++) {
      const currentEnd = new Date(flightDutySchedules[i].end_date);
      const nextStart = new Date(flightDutySchedules[i + 1].start_date);
      const restHours = differenceInHours(nextStart, currentEnd);
      
      if (restHours < 12) {
        restViolations.push(
          `${format(currentEnd, 'dd/MM HH:mm')} - ${format(nextStart, 'dd/MM HH:mm')}: Riposo insufficiente (${restHours}h)`
        );
      }
    }

    const totalViolations = violations.length + restViolations.length;
    const complianceScore = Math.max(0, 100 - (totalViolations * 20));

    return {
      weeklyHours,
      dailyMax,
      violations,
      restViolations,
      complianceScore
    };
  };

  const ftlData = calculateFTLCompliance();
  const selectedCrew = selectedCrewMember ? crewMembers.find(c => c.id === selectedCrewMember) : null;

  const getCompliantStatus = (score: number) => {
    if (score >= 90) return { icon: CheckCircle, color: 'text-green-500', label: 'Conforme' };
    if (score >= 70) return { icon: AlertTriangle, color: 'text-yellow-500', label: 'Attenzione' };
    return { icon: AlertTriangle, color: 'text-red-500', label: 'Violazione' };
  };

  const status = getCompliantStatus(ftlData.complianceScore);
  const StatusIcon = status.icon;

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          <Shield className="w-5 h-5 mr-2" />
          Validazione FTL
          {selectedCrew && (
            <Badge variant="outline" className="ml-2">
              {selectedCrew.first_name} {selectedCrew.last_name}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!selectedCrewMember ? (
          <div className="text-center py-8 text-gray-500">
            <Shield className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Seleziona un membro dell'equipaggio per visualizzare la validazione FTL</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Compliance Score */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <StatusIcon className={`w-5 h-5 mr-2 ${status.color}`} />
                <span className="font-medium">Stato Compliance</span>
              </div>
              <div className="flex items-center space-x-2">
                <Progress value={ftlData.complianceScore} className="w-24" />
                <Badge className={status.color.replace('text-', 'bg-').replace('500', '100') + ' ' + status.color}>
                  {status.label}
                </Badge>
              </div>
            </div>

            {/* Flight Hours Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <Clock className="w-6 h-6 mx-auto mb-1 text-blue-500" />
                <div className="text-2xl font-bold text-blue-600">{ftlData.weeklyHours}h</div>
                <div className="text-xs text-blue-600">Ore Settimanali</div>
                <div className="text-xs text-gray-500">max 60h</div>
              </div>
              
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <Clock className="w-6 h-6 mx-auto mb-1 text-green-500" />
                <div className="text-2xl font-bold text-green-600">{ftlData.dailyMax}h</div>
                <div className="text-xs text-green-600">Max Giornaliere</div>
                <div className="text-xs text-gray-500">max 14h</div>
              </div>

              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <Clock className="w-6 h-6 mx-auto mb-1 text-purple-500" />
                <div className="text-2xl font-bold text-purple-600">{trainingHours.length}</div>
                <div className="text-xs text-purple-600">Sessioni Training</div>
                <div className="text-xs text-gray-500">questa settimana</div>
              </div>

              <div className="text-center p-3 bg-orange-50 rounded-lg">
                <AlertTriangle className="w-6 h-6 mx-auto mb-1 text-orange-500" />
                <div className="text-2xl font-bold text-orange-600">
                  {ftlData.violations.length + ftlData.restViolations.length}
                </div>
                <div className="text-xs text-orange-600">Violazioni</div>
                <div className="text-xs text-gray-500">potenziali</div>
              </div>
            </div>

            {/* Violations */}
            {(ftlData.violations.length > 0 || ftlData.restViolations.length > 0) && (
              <div className="space-y-2">
                <h4 className="font-medium text-red-600 flex items-center">
                  <AlertTriangle className="w-4 h-4 mr-1" />
                  Violazioni Rilevate
                </h4>
                <div className="space-y-1">
                  {ftlData.violations.map((violation, index) => (
                    <div key={index} className="text-sm text-red-600 bg-red-50 p-2 rounded">
                      • {violation}
                    </div>
                  ))}
                  {ftlData.restViolations.map((violation, index) => (
                    <div key={index} className="text-sm text-orange-600 bg-orange-50 p-2 rounded">
                      • {violation}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* No violations message */}
            {ftlData.violations.length === 0 && ftlData.restViolations.length === 0 && (
              <div className="text-center py-4 text-green-600 bg-green-50 rounded-lg">
                <CheckCircle className="w-8 h-8 mx-auto mb-2" />
                <p className="font-medium">Nessuna violazione FTL rilevata</p>
                <p className="text-sm">Tutti gli orari rispettano le normative</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
