
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  User,
  Filter,
  Plus,
  Copy,
  Edit,
  MoreHorizontal
} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useCrewMembers } from "@/hooks/useCrewMembers";
import { usePilotSchedule } from "@/hooks/usePilotSchedule";
import { format, addWeeks, subWeeks, addMonths, subMonths, startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, parseISO, addDays, subDays } from "date-fns";
import { it } from "date-fns/locale";
import { ScheduleModal } from "./ScheduleModal";

export const TimeTableView = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedCrew, setSelectedCrew] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"week" | "month" | "custom">("week");
  const [customStartDate, setCustomStartDate] = useState<string>("");
  const [customEndDate, setCustomEndDate] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedPilot, setSelectedPilot] = useState<string>("");
  const [existingSchedule, setExistingSchedule] = useState<any>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'duplicate'>('create');

  const { data: crewMembers = [], isLoading: crewLoading } = useCrewMembers();

  // Calcola range di date basato sulla modalità di visualizzazione
  const getDateRange = () => {
    switch (viewMode) {
      case "week":
        const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
        const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
        return {
          start: format(weekStart, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"),
          end: format(weekEnd, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
        };
      case "month":
        const monthStart = startOfMonth(currentDate);
        const monthEnd = endOfMonth(currentDate);
        return {
          start: format(monthStart, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"),
          end: format(monthEnd, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
        };
      case "custom":
        if (customStartDate && customEndDate) {
          return {
            start: format(new Date(customStartDate), "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"),
            end: format(new Date(customEndDate), "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
          };
        }
        // Fallback a vista settimanale se le date custom non sono valide
        const fallbackStart = startOfWeek(currentDate, { weekStartsOn: 1 });
        const fallbackEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
        return {
          start: format(fallbackStart, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"),
          end: format(fallbackEnd, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
        };
      default:
        return undefined;
    }
  };

  const dateRange = getDateRange();
  const { data: schedules = [], isLoading: scheduleLoading } = usePilotSchedule(
    selectedCrew === "all" ? undefined : selectedCrew,
    dateRange
  );

  const pilots = crewMembers.filter(member => 
    member.position === "captain" || member.position === "first_officer"
  );

  const filteredCrewMembers = selectedCrew === "all" 
    ? pilots 
    : pilots.filter(pilot => pilot.id === selectedCrew);

  // Genera i giorni da visualizzare basati sulla modalità
  const getDisplayDays = () => {
    switch (viewMode) {
      case "week":
        const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
        const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
        return eachDayOfInterval({ start: weekStart, end: weekEnd });
      case "month":
        const monthStart = startOfMonth(currentDate);
        const monthEnd = endOfMonth(currentDate);
        return eachDayOfInterval({ start: monthStart, end: monthEnd });
      case "custom":
        if (customStartDate && customEndDate) {
          return eachDayOfInterval({ 
            start: new Date(customStartDate), 
            end: new Date(customEndDate) 
          });
        }
        // Fallback a vista settimanale
        const fallbackStart = startOfWeek(currentDate, { weekStartsOn: 1 });
        const fallbackEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
        return eachDayOfInterval({ start: fallbackStart, end: fallbackEnd });
      default:
        return [];
    }
  };

  const displayDays = getDisplayDays();
  const timeSlots = Array.from({ length: 24 }, (_, i) => i);

  const getScheduleTypeColor = (type: string) => {
    switch (type) {
      case "duty": return "bg-blue-500 text-white";
      case "rest": return "bg-green-500 text-white";
      case "training": return "bg-purple-500 text-white";
      case "available": return "bg-gray-400 text-white";
      case "unavailable": return "bg-red-500 text-white";
      case "vacation": return "bg-yellow-500 text-black";
      case "sick": return "bg-orange-500 text-white";
      default: return "bg-gray-400 text-white";
    }
  };

  const getScheduleForTimeSlot = (pilotId: string, day: Date, hour: number) => {
    return schedules.find(schedule => {
      if (schedule.pilot_id !== pilotId) return false;
      
      const scheduleStart = parseISO(schedule.start_date);
      const scheduleEnd = parseISO(schedule.end_date);
      const slotTime = new Date(day);
      slotTime.setHours(hour, 0, 0, 0);
      
      return scheduleStart <= slotTime && slotTime < scheduleEnd;
    });
  };

  const handleCellClick = (pilotId: string, day: Date) => {
    setSelectedPilot(pilotId);
    setSelectedDate(day);
    setExistingSchedule(null);
    setModalMode('create');
    setIsModalOpen(true);
  };

  const handleScheduleAction = (action: 'edit' | 'duplicate', schedule: any) => {
    setExistingSchedule(schedule);
    setSelectedPilot(schedule.pilot_id);
    setSelectedDate(parseISO(schedule.start_date));
    setModalMode(action);
    setIsModalOpen(true);
  };

  const navigateDate = (direction: "prev" | "next") => {
    if (viewMode === "week") {
      setCurrentDate(prev => direction === "next" ? addWeeks(prev, 1) : subWeeks(prev, 1));
    } else if (viewMode === "month") {
      setCurrentDate(prev => direction === "next" ? addMonths(prev, 1) : subMonths(prev, 1));
    } else if (viewMode === "custom") {
      const days = displayDays.length;
      setCurrentDate(prev => direction === "next" ? addDays(prev, days) : subDays(prev, days));
    }
  };

  const getViewTitle = () => {
    switch (viewMode) {
      case "week":
        const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
        return `Settimana del ${format(weekStart, "dd MMMM yyyy", { locale: it })}`;
      case "month":
        return `${format(currentDate, "MMMM yyyy", { locale: it })}`;
      case "custom":
        if (customStartDate && customEndDate) {
          return `${format(new Date(customStartDate), "dd MMM", { locale: it })} - ${format(new Date(customEndDate), "dd MMM yyyy", { locale: it })}`;
        }
        return "Periodo personalizzato";
      default:
        return "";
    }
  };

  if (crewLoading || scheduleLoading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }

  console.log('Schedules found:', schedules.length);
  console.log('Selected crew:', selectedCrew);
  console.log('Date range:', dateRange);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Crew Time Table</h1>
          <p className="text-gray-600">Vista calendario per la gestione turni equipaggio</p>
        </div>
        <div className="flex items-center space-x-3">
          <Select value={selectedCrew} onValueChange={setSelectedCrew}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filtra per crew" />
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
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filtri
          </Button>
          <Button 
            className="bg-blue-600 hover:bg-blue-700"
            onClick={() => {
              setSelectedPilot("");
              setSelectedDate(new Date());
              setExistingSchedule(null);
              setModalMode('create');
              setIsModalOpen(true);
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Nuovo Turno
          </Button>
        </div>
      </div>

      {/* View Mode and Date Navigation */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <CardTitle className="flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                {getViewTitle()}
              </CardTitle>
              <Select value={viewMode} onValueChange={(value: "week" | "month" | "custom") => setViewMode(value)}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Vista Settimanale</SelectItem>
                  <SelectItem value="month">Vista Mensile</SelectItem>
                  <SelectItem value="custom">Periodo Personalizzato</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {viewMode !== "custom" && (
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={() => navigateDate("prev")}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
                  Oggi
                </Button>
                <Button variant="outline" size="sm" onClick={() => navigateDate("next")}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Custom Date Range */}
          {viewMode === "custom" && (
            <div className="flex items-center space-x-4 mt-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm">Da:</span>
                <Input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  className="w-40"
                />
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm">A:</span>
                <Input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  className="w-40"
                />
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setCustomStartDate(format(new Date(), "yyyy-MM-dd"));
                  setCustomEndDate(format(addDays(new Date(), 30), "yyyy-MM-dd"));
                }}
              >
                Prossimi 30 giorni
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div className="min-w-[1200px]">
              {/* Header with days */}
              <div className={`grid gap-1 mb-2`} style={{ gridTemplateColumns: `200px repeat(${displayDays.length}, 1fr)` }}>
                <div className="p-2 font-medium text-sm">Crew</div>
                {displayDays.map((day) => (
                  <div key={day.toISOString()} className="p-2 text-center">
                    <div className="font-medium text-sm">
                      {format(day, "EEE", { locale: it })}
                    </div>
                    <div className="text-xs text-gray-500">
                      {format(day, "dd/MM")}
                    </div>
                  </div>
                ))}
              </div>

              {/* Crew rows */}
              {filteredCrewMembers.map((pilot) => (
                <div key={pilot.id} className={`grid gap-1 mb-2 border-b border-gray-100 pb-2`} style={{ gridTemplateColumns: `200px repeat(${displayDays.length}, 1fr)` }}>
                  {/* Pilot name */}
                  <div className="p-2 flex items-center">
                    <User className="w-4 h-4 mr-2 text-gray-400" />
                    <div>
                      <div className="font-medium text-sm">
                        {pilot.first_name} {pilot.last_name}
                      </div>
                      <div className="text-xs text-gray-500 capitalize">
                        {pilot.position}
                      </div>
                    </div>
                  </div>

                  {/* Days */}
                  {displayDays.map((day) => (
                    <div 
                      key={day.toISOString()} 
                      className="min-h-[80px] border border-gray-200 rounded p-1 cursor-pointer hover:bg-blue-50 transition-colors"
                      onClick={() => handleCellClick(pilot.id, day)}
                    >
                      <div className="space-y-1">
                        {timeSlots.map((hour) => {
                          const schedule = getScheduleForTimeSlot(pilot.id, day, hour);
                          if (!schedule) return null;

                          const scheduleStart = parseISO(schedule.start_date);
                          const scheduleEnd = parseISO(schedule.end_date);
                          const isFirstHour = scheduleStart.getHours() === hour;
                          
                          if (!isFirstHour) return null;

                          const duration = Math.round((scheduleEnd.getTime() - scheduleStart.getTime()) / (1000 * 60 * 60));
                          
                          return (
                            <div
                              key={`${schedule.id}-${hour}`}
                              className={`${getScheduleTypeColor(schedule.schedule_type)} text-xs px-1 py-0.5 block rounded cursor-pointer hover:opacity-80 group relative`}
                              style={{ 
                                height: `${Math.max(16, duration * 4)}px`,
                                fontSize: '10px'
                              }}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <div className="truncate">
                                {schedule.schedule_type}
                              </div>
                              <div className="text-[8px] opacity-80">
                                {format(scheduleStart, "HH:mm")}-{format(scheduleEnd, "HH:mm")}
                              </div>
                              
                              {/* Action buttons */}
                              <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      className="h-4 w-4 p-0 text-white hover:bg-white/20"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <MoreHorizontal className="w-3 h-3" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => handleScheduleAction('edit', schedule)}>
                                      <Edit className="w-3 h-3 mr-2" />
                                      Modifica
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleScheduleAction('duplicate', schedule)}>
                                      <Copy className="w-3 h-3 mr-2" />
                                      Duplica
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              ))}

              {filteredCrewMembers.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  Nessun pilota selezionato o disponibile
                </div>
              )}

              {schedules.length === 0 && filteredCrewMembers.length > 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Clock className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium mb-2">Nessun turno trovato</h3>
                  <p className="text-sm">Non ci sono turni programmati per il periodo selezionato</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Legenda Turni</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {[
              { type: "duty", label: "Servizio" },
              { type: "rest", label: "Riposo" },
              { type: "training", label: "Addestramento" },
              { type: "available", label: "Disponibile" },
              { type: "unavailable", label: "Non Disponibile" },
              { type: "vacation", label: "Ferie" },
              { type: "sick", label: "Malattia" }
            ].map((item) => (
              <div key={item.type} className="flex items-center space-x-2">
                <div className={`w-4 h-4 rounded ${getScheduleTypeColor(item.type)}`} />
                <span className="text-sm">{item.label}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 text-xs text-gray-500 space-y-1">
            <div>💡 Clicca su una cella vuota per creare un nuovo turno</div>
            <div>⚙️ Clicca sui tre puntini su un turno per modificarlo o duplicarlo</div>
            <div>📅 Usa la vista mensile o personalizzata per periodi più lunghi</div>
          </div>
        </CardContent>
      </Card>

      <ScheduleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        pilots={pilots}
        selectedDate={selectedDate}
        selectedPilot={selectedPilot}
        existingSchedule={existingSchedule}
        mode={modalMode}
      />
    </div>
  );
};
