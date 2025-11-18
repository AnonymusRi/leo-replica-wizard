
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Calendar, 
  Clock, 
  User, 
  Plus,
  Plane,
  GraduationCap,
  MapPin,
  Users
} from "lucide-react";
import { usePilotSchedule } from "@/hooks/usePilotSchedule";
import { useTrainingRecords } from "@/hooks/useTrainingRecords";
import { useCrewMembers } from "@/hooks/useCrewMembers";
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, parseISO } from "date-fns";
import { it } from "date-fns/locale";

export const TimeTableView = () => {
  const [selectedWeek, setSelectedWeek] = useState(new Date());
  const [selectedPilot, setSelectedPilot] = useState<string>("all");

  const weekStart = startOfWeek(selectedWeek, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(selectedWeek, { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const { data: schedules = [], isLoading: schedulesLoading } = usePilotSchedule(
    selectedPilot !== "all" ? selectedPilot : undefined,
    {
      start: weekStart.toISOString(),
      end: weekEnd.toISOString()
    }
  );

  const { data: trainings = [], isLoading: trainingsLoading } = useTrainingRecords(
    selectedPilot !== "all" ? selectedPilot : undefined
  );

  const { data: crewMembers = [], isLoading: crewLoading } = useCrewMembers();

  const pilots = crewMembers.filter(member => 
    member.position === "captain" || member.position === "first_officer"
  );

  // Filtra i training per la settimana corrente
  const weekTrainings = trainings.filter(training => {
    const trainingDate = parseISO(training.training_date);
    return trainingDate >= weekStart && trainingDate <= weekEnd;
  });

  const getEventsForDay = (day: Date, pilotId?: string) => {
    const events = [];

    // Aggiungi schedules
    const daySchedules = schedules.filter(schedule => {
      const scheduleStart = parseISO(schedule.start_date);
      const scheduleEnd = parseISO(schedule.end_date);
      return day >= scheduleStart && day <= scheduleEnd;
    }).filter(schedule => !pilotId || schedule.pilot_id === pilotId);

    events.push(...daySchedules.map(schedule => ({
      ...schedule,
      type: 'schedule' as const,
      title: schedule.schedule_type,
      time: format(parseISO(schedule.start_date), 'HH:mm'),
      pilot: pilots.find(p => p.id === schedule.pilot_id)
    })));

    // Aggiungi training
    const dayTrainings = weekTrainings.filter(training => {
      const trainingDate = parseISO(training.training_date);
      return isSameDay(trainingDate, day);
    }).filter(training => !pilotId || training.pilot_id === pilotId);

    events.push(...dayTrainings.map(training => ({
      ...training,
      type: 'training' as const,
      title: training.training_description,
      time: format(parseISO(training.training_date), 'HH:mm'),
      pilot: pilots.find(p => p.id === training.pilot_id)
    })));

    return events.sort((a, b) => a.time.localeCompare(b.time));
  };

  const getEventBadge = (event: any) => {
    if (event.type === 'training') {
      const statusColors = {
        'scheduled': 'bg-yellow-100 text-yellow-800',
        'in_progress': 'bg-blue-100 text-blue-800',
        'completed': 'bg-green-100 text-green-800',
        'cancelled': 'bg-red-100 text-red-800'
      };
      return (
        <Badge className={`${statusColors[event.status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}`}>
          <GraduationCap className="w-3 h-3 mr-1" />
          Addestramento
        </Badge>
      );
    } else {
      return (
        <Badge variant="outline">
          <Calendar className="w-3 h-3 mr-1" />
          {event.schedule_type}
        </Badge>
      );
    }
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedWeek);
    newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    setSelectedWeek(newDate);
  };

  if (crewLoading || schedulesLoading || trainingsLoading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header e controlli */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center">
            <Calendar className="w-6 h-6 mr-2" />
            Programmazione Settimanale
          </h1>
          <p className="text-gray-600">
            Settimana dal {format(weekStart, "dd MMM", { locale: it })} al {format(weekEnd, "dd MMM yyyy", { locale: it })}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Select value={selectedPilot} onValueChange={setSelectedPilot}>
            <SelectTrigger className="w-48">
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
          <Button variant="outline" onClick={() => navigateWeek('prev')}>
            ← Settimana Prec.
          </Button>
          <Button variant="outline" onClick={() => navigateWeek('next')}>
            Settimana Succ. →
          </Button>
        </div>
      </div>

      {/* Griglia settimanale */}
      <div className="grid grid-cols-7 gap-4">
        {weekDays.map((day) => {
          const events = getEventsForDay(day, selectedPilot !== "all" ? selectedPilot : undefined);
          const isToday = isSameDay(day, new Date());
          
          return (
            <Card key={day.toISOString()} className={`${isToday ? 'ring-2 ring-blue-500' : ''}`}>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">
                  {format(day, "EEEE", { locale: it })}
                  <div className="text-lg font-bold">
                    {format(day, "dd", { locale: it })}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  {events.map((event, index) => (
                    <div key={index} className="p-2 bg-gray-50 rounded-lg text-xs">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium">{event.time}</span>
                        {getEventBadge(event)}
                      </div>
                      
                      <div className="text-gray-700 font-medium mb-1">
                        {event.title}
                      </div>
                      
                      {event.pilot && (
                        <div className="flex items-center text-gray-600">
                          <User className="w-3 h-3 mr-1" />
                          {event.pilot.first_name} {event.pilot.last_name}
                        </div>
                      )}

                      {event.type === 'training' && (
                        <div className="mt-1">
                          <div className="flex items-center text-gray-600">
                            <MapPin className="w-3 h-3 mr-1" />
                            {event.training_organization}
                          </div>
                          <div className="flex items-center text-gray-600">
                            <Clock className="w-3 h-3 mr-1" />
                            {event.duration_hours}h
                          </div>
                          {event.ftl_applicable && (
                            <Badge variant="secondary" className="text-xs mt-1">
                              Impatta FTL
                            </Badge>
                          )}
                        </div>
                      )}

                      {event.notes && (
                        <div className="text-gray-500 italic mt-1">
                          {event.notes}
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {events.length === 0 && (
                    <div className="text-center text-gray-400 py-4">
                      <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-xs">Nessun evento</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Legenda */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Legenda</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 text-xs">
            <div className="flex items-center">
              <Badge variant="outline" className="mr-2">
                <Calendar className="w-3 h-3 mr-1" />
                Programmazione
              </Badge>
              <span>Eventi di programmazione</span>
            </div>
            <div className="flex items-center">
              <Badge className="bg-yellow-100 text-yellow-800 mr-2">
                <GraduationCap className="w-3 h-3 mr-1" />
                Addestramento
              </Badge>
              <span>Sessioni di addestramento</span>
            </div>
            <div className="flex items-center">
              <Badge variant="secondary" className="mr-2">
                Impatta FTL
              </Badge>
              <span>Attività che influenzano i limiti di volo</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
