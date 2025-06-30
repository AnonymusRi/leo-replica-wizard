
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Plane, MapPin } from "lucide-react";
import { useCrewFlightAssignments } from "@/hooks/useCrewFlightAssignments";
import { format, addDays, startOfDay } from "date-fns";
import { it } from "date-fns/locale";

interface CrewScheduleSectionProps {
  crewMemberId: string;
}

export const CrewScheduleSection = ({ crewMemberId }: CrewScheduleSectionProps) => {
  const { data: assignments = [] } = useCrewFlightAssignments();
  
  // Filter assignments for this crew member for the next 30 days
  const upcomingAssignments = assignments
    .filter(assignment => assignment.crew_member_id === crewMemberId)
    .filter(assignment => {
      const assignmentDate = new Date(assignment.duty_start_time || new Date());
      return assignmentDate >= startOfDay(new Date()) && 
             assignmentDate <= addDays(new Date(), 30);
    })
    .sort((a, b) => new Date(a.duty_start_time || 0).getTime() - new Date(b.duty_start_time || 0).getTime());

  const getPositionLabel = (position: string) => {
    switch (position) {
      case "captain": return "Comandante";
      case "first_officer": return "Primo Ufficiale";
      case "cabin_crew": return "Assistente di Volo";
      default: return position;
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Prossimi Voli</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{upcomingAssignments.length}</div>
            <p className="text-sm text-gray-500">Nei prossimi 30 giorni</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Ore di Volo Programmate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {upcomingAssignments.reduce((sum, assignment) => sum + (assignment.flight_time_hours || 0), 0).toFixed(1)}h
            </div>
            <p className="text-sm text-gray-500">Nei prossimi 30 giorni</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Ore di Servizio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {upcomingAssignments.reduce((sum, assignment) => sum + (assignment.duty_time_hours || 0), 0).toFixed(1)}h
            </div>
            <p className="text-sm text-gray-500">Nei prossimi 30 giorni</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="w-5 h-5" />
            <span>Programma Voli</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {upcomingAssignments.map((assignment) => (
              <div key={assignment.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <Plane className="w-5 h-5 text-blue-600" />
                    <div>
                      <h4 className="font-medium">Volo {assignment.flight_id}</h4>
                      <p className="text-sm text-gray-600">
                        {assignment.duty_start_time && format(new Date(assignment.duty_start_time), "dd MMMM yyyy", { locale: it })}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline">
                    {getPositionLabel(assignment.position)}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-gray-600">Inizio Servizio</p>
                      <p className="font-medium">
                        {assignment.duty_start_time && format(new Date(assignment.duty_start_time), "HH:mm")}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-gray-600">Fine Servizio</p>
                      <p className="font-medium">
                        {assignment.duty_end_time && format(new Date(assignment.duty_end_time), "HH:mm")}
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-gray-600">Ore Volo</p>
                    <p className="font-medium">{assignment.flight_time_hours || 0}h</p>
                  </div>
                  
                  <div>
                    <p className="text-gray-600">Ore Servizio</p>
                    <p className="font-medium">{assignment.duty_time_hours || 0}h</p>
                  </div>
                </div>
                
                {assignment.notes && (
                  <div className="mt-3 pt-3 border-t">
                    <p className="text-sm text-gray-600">{assignment.notes}</p>
                  </div>
                )}
              </div>
            ))}
            
            {upcomingAssignments.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                <p>Nessun volo programmato nei prossimi 30 giorni</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
