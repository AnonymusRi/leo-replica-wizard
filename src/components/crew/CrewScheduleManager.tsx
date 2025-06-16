
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, Plus, Edit, Trash2 } from "lucide-react";
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from "date-fns";
import { it } from "date-fns/locale";
import { CrewScheduleModal } from "./CrewScheduleModal";
import { FTLValidationCard } from "./FTLValidationCard";
import { useCrewMembers } from "@/hooks/useCrewMembers";
import { usePilotSchedule } from "@/hooks/usePilotSchedule";

export const CrewScheduleManager = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedCrewMember, setSelectedCrewMember] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<any>(null);

  const { data: crewMembers = [] } = useCrewMembers();
  const pilots = crewMembers.filter(crew => ['captain', 'first_officer'].includes(crew.position));

  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const { data: schedules = [] } = usePilotSchedule(
    selectedCrewMember || undefined,
    {
      start: format(weekStart, 'yyyy-MM-dd'),
      end: format(weekEnd, 'yyyy-MM-dd')
    }
  );

  const getScheduleForDay = (pilotId: string, date: Date) => {
    return schedules.filter(schedule => {
      const startDate = new Date(schedule.start_date);
      const endDate = new Date(schedule.end_date);
      return pilotId === schedule.pilot_id && 
             date >= startDate && date <= endDate;
    });
  };

  const getStatusColor = (scheduleType: string) => {
    switch (scheduleType) {
      case 'flight_duty': return 'bg-blue-100 text-blue-800';
      case 'simulator': return 'bg-green-100 text-green-800';
      case 'standby': return 'bg-yellow-100 text-yellow-800';
      case 'rest': return 'bg-gray-100 text-gray-800';
      case 'training': return 'bg-purple-100 text-purple-800';
      case 'unavailable': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleCreateSchedule = () => {
    setEditingSchedule(null);
    setIsModalOpen(true);
  };

  const handleEditSchedule = (schedule: any) => {
    setEditingSchedule(schedule);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-semibold">Gestione Orari Crew</h2>
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4" />
            <span className="text-sm text-gray-600">
              {format(weekStart, 'dd MMM', { locale: it })} - {format(weekEnd, 'dd MMM yyyy', { locale: it })}
            </span>
          </div>
        </div>
        <Button onClick={handleCreateSchedule}>
          <Plus className="w-4 h-4 mr-2" />
          Nuovo Orario
        </Button>
      </div>

      {/* Week Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => setSelectedDate(new Date(selectedDate.getTime() - 7 * 24 * 60 * 60 * 1000))}
        >
          ← Settimana Precedente
        </Button>
        <Button
          variant="outline"
          onClick={() => setSelectedDate(new Date())}
        >
          Oggi
        </Button>
        <Button
          variant="outline"
          onClick={() => setSelectedDate(new Date(selectedDate.getTime() + 7 * 24 * 60 * 60 * 1000))}
        >
          Settimana Successiva →
        </Button>
      </div>

      {/* FTL Validation Summary */}
      <FTLValidationCard selectedCrewMember={selectedCrewMember} weekStart={weekStart} weekEnd={weekEnd} />

      {/* Schedule Grid */}
      <Card>
        <CardHeader>
          <CardTitle>Pianificazione Settimanale</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div className="min-w-full">
              {/* Header with days */}
              <div className="grid grid-cols-8 gap-2 mb-4">
                <div className="font-medium text-sm text-gray-500 p-2">Pilota</div>
                {weekDays.map((day) => (
                  <div key={day.toISOString()} className="font-medium text-sm text-center p-2">
                    <div>{format(day, 'EEE', { locale: it })}</div>
                    <div className="text-xs text-gray-500">{format(day, 'dd/MM')}</div>
                  </div>
                ))}
              </div>

              {/* Pilot rows */}
              {pilots.map((pilot) => (
                <div key={pilot.id} className="grid grid-cols-8 gap-2 mb-2 items-stretch">
                  <div className="flex items-center p-2 bg-gray-50 rounded">
                    <User className="w-4 h-4 mr-2" />
                    <div>
                      <div className="font-medium text-sm">{pilot.first_name} {pilot.last_name}</div>
                      <div className="text-xs text-gray-500 capitalize">{pilot.position}</div>
                    </div>
                  </div>

                  {weekDays.map((day) => {
                    const daySchedules = getScheduleForDay(pilot.id, day);
                    
                    return (
                      <div key={day.toISOString()} className="min-h-16 p-1 border rounded">
                        {daySchedules.length === 0 ? (
                          <div className="h-full flex items-center justify-center text-gray-300">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedCrewMember(pilot.id);
                                handleCreateSchedule();
                              }}
                              className="w-full h-full"
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                          </div>
                        ) : (
                          <div className="space-y-1">
                            {daySchedules.map((schedule) => (
                              <div
                                key={schedule.id}
                                className="relative group"
                              >
                                <Badge
                                  className={`${getStatusColor(schedule.schedule_type)} text-xs cursor-pointer w-full justify-center`}
                                  onClick={() => handleEditSchedule(schedule)}
                                >
                                  <div className="text-center">
                                    <div className="font-medium">{schedule.schedule_type.replace('_', ' ')}</div>
                                    <div className="text-xs">
                                      {format(new Date(schedule.start_date), 'HH:mm')} - 
                                      {format(new Date(schedule.end_date), 'HH:mm')}
                                    </div>
                                  </div>
                                </Badge>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Legenda</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Badge className="bg-blue-100 text-blue-800">Servizio di Volo</Badge>
            <Badge className="bg-green-100 text-green-800">Simulatore</Badge>
            <Badge className="bg-yellow-100 text-yellow-800">Standby</Badge>
            <Badge className="bg-gray-100 text-gray-800">Riposo</Badge>
            <Badge className="bg-purple-100 text-purple-800">Training</Badge>
            <Badge className="bg-red-100 text-red-800">Non Disponibile</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Schedule Modal */}
      <CrewScheduleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        schedule={editingSchedule}
        preselectedCrewMember={selectedCrewMember}
      />
    </div>
  );
};
