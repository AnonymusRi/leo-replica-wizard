
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format, addDays } from "date-fns";
import { 
  useCreatePilotSchedule, 
  useUpdatePilotSchedule, 
  useDeletePilotSchedule 
} from "@/hooks/usePilotFlightHours";
import { CrewMember } from "@/types/database";
import { Calendar, Copy, Plus, X, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const scheduleSchema = z.object({
  pilot_id: z.string().min(1, "Seleziona un pilota"),
  schedule_type: z.string().min(1, "Seleziona tipo turno"),
  start_time: z.string().min(1, "Inserisci ora inizio"),
  end_time: z.string().min(1, "Inserisci ora fine"),
  notes: z.string().optional()
});

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  pilots: CrewMember[];
  selectedDate?: Date;
  selectedPilot?: string;
  existingSchedule?: any;
  mode?: 'create' | 'edit' | 'duplicate';
}

export const ScheduleModal = ({ 
  isOpen, 
  onClose, 
  pilots, 
  selectedDate, 
  selectedPilot,
  existingSchedule,
  mode = 'create'
}: ScheduleModalProps) => {
  const [selectedDates, setSelectedDates] = useState<Date[]>(selectedDate ? [selectedDate] : []);
  const { toast } = useToast();
  
  const createScheduleMutation = useCreatePilotSchedule();
  const updateScheduleMutation = useUpdatePilotSchedule();
  const deleteScheduleMutation = useDeletePilotSchedule();

  const form = useForm({
    resolver: zodResolver(scheduleSchema),
    defaultValues: {
      pilot_id: selectedPilot || existingSchedule?.pilot_id || "",
      schedule_type: existingSchedule?.schedule_type || "duty",
      start_time: existingSchedule ? format(new Date(existingSchedule.start_date), "HH:mm") : "08:00",
      end_time: existingSchedule ? format(new Date(existingSchedule.end_date), "HH:mm") : "16:00",
      notes: existingSchedule?.notes || ""
    }
  });

  const scheduleTypes = [
    { value: "duty", label: "Servizio", color: "bg-blue-500" },
    { value: "rest", label: "Riposo", color: "bg-green-500" },
    { value: "training", label: "Addestramento", color: "bg-purple-500" },
    { value: "available", label: "Disponibile", color: "bg-gray-400" },
    { value: "unavailable", label: "Non Disponibile", color: "bg-red-500" },
    { value: "vacation", label: "Ferie", color: "bg-yellow-500" },
    { value: "sick", label: "Malattia", color: "bg-orange-500" }
  ];

  const addDateForDuplication = () => {
    if (selectedDate) {
      const nextDay = addDays(selectedDate, selectedDates.length);
      setSelectedDates([...selectedDates, nextDay]);
    }
  };

  const removeDateFromDuplication = (indexToRemove: number) => {
    setSelectedDates(selectedDates.filter((_, index) => index !== indexToRemove));
  };

  const handleDelete = async () => {
    if (!existingSchedule?.id) return;
    
    try {
      await deleteScheduleMutation.mutateAsync(existingSchedule.id);
      toast({
        title: "Turno eliminato",
        description: "Il turno è stato eliminato con successo"
      });
      onClose();
    } catch (error) {
      toast({
        title: "Errore",
        description: "Errore durante l'eliminazione del turno",
        variant: "destructive"
      });
    }
  };

  const onSubmit = async (data: any) => {
    try {
      if (mode === 'edit' && existingSchedule?.id) {
        // Modifica turno esistente
        const startDateTime = new Date(selectedDate || existingSchedule.start_date);
        const [startHour, startMinute] = data.start_time.split(':');
        startDateTime.setHours(parseInt(startHour), parseInt(startMinute), 0);

        const endDateTime = new Date(selectedDate || existingSchedule.start_date);
        const [endHour, endMinute] = data.end_time.split(':');
        endDateTime.setHours(parseInt(endHour), parseInt(endMinute), 0);

        await updateScheduleMutation.mutateAsync({
          id: existingSchedule.id,
          pilot_id: data.pilot_id,
          start_date: startDateTime.toISOString(),
          end_date: endDateTime.toISOString(),
          schedule_type: data.schedule_type,
          notes: data.notes
        });

        toast({
          title: "Turno aggiornato",
          description: "Il turno è stato aggiornato con successo"
        });
      } else {
        // Crea nuovi turni (creazione o duplicazione)
        const promises = selectedDates.map(date => {
          const startDateTime = new Date(date);
          const [startHour, startMinute] = data.start_time.split(':');
          startDateTime.setHours(parseInt(startHour), parseInt(startMinute), 0);

          const endDateTime = new Date(date);
          const [endHour, endMinute] = data.end_time.split(':');
          endDateTime.setHours(parseInt(endHour), parseInt(endMinute), 0);

          return createScheduleMutation.mutateAsync({
            pilot_id: data.pilot_id,
            start_date: startDateTime.toISOString(),
            end_date: endDateTime.toISOString(),
            schedule_type: data.schedule_type,
            notes: data.notes
          });
        });

        await Promise.all(promises);
        
        toast({
          title: mode === 'duplicate' ? "Turno duplicato" : "Turno creato",
          description: `${selectedDates.length} turno/i ${mode === 'duplicate' ? 'duplicato/i' : 'creato/i'} con successo`
        });
      }
      
      onClose();
      form.reset();
      setSelectedDates(selectedDate ? [selectedDate] : []);
    } catch (error) {
      toast({
        title: "Errore",
        description: `Errore durante ${mode === 'edit' ? 'l\'aggiornamento' : 'la creazione'} del turno`,
        variant: "destructive"
      });
    }
  };

  const getModalTitle = () => {
    switch (mode) {
      case 'edit': return 'Modifica Turno';
      case 'duplicate': return 'Duplica Turno';
      default: return 'Nuovo Turno';
    }
  };

  const getModalIcon = () => {
    switch (mode) {
      case 'edit': return <Edit className="w-5 h-5 mr-2" />;
      case 'duplicate': return <Copy className="w-5 h-5 mr-2" />;
      default: return <Plus className="w-5 h-5 mr-2" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            {getModalIcon()}
            {getModalTitle()}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="pilot_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pilota</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleziona pilota" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {pilots.map((pilot) => (
                        <SelectItem key={pilot.id} value={pilot.id}>
                          {pilot.first_name} {pilot.last_name} ({pilot.position})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="schedule_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo Turno</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleziona tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {scheduleTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex items-center">
                            <div className={`w-3 h-3 rounded ${type.color} mr-2`} />
                            {type.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="start_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ora Inizio</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="end_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ora Fine</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Date Duplication Section - Solo per creazione e duplicazione */}
            {mode !== 'edit' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Date Selezionate</label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addDateForDuplication}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Aggiungi Giorno
                  </Button>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {selectedDates.map((date, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="flex items-center gap-1"
                    >
                      <Calendar className="w-3 h-3" />
                      {format(date, "dd/MM")}
                      {selectedDates.length > 1 && (
                        <X
                          className="w-3 h-3 cursor-pointer hover:text-red-500"
                          onClick={() => removeDateFromDuplication(index)}
                        />
                      )}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Note</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Note aggiuntive..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-between items-center pt-4">
              {/* Pulsante Elimina - Solo per modalità edit */}
              {mode === 'edit' && (
                <Button 
                  type="button" 
                  variant="destructive" 
                  size="sm"
                  onClick={handleDelete}
                  disabled={deleteScheduleMutation.isPending}
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  {deleteScheduleMutation.isPending ? "Eliminando..." : "Elimina"}
                </Button>
              )}
              
              <div className="flex space-x-2 ml-auto">
                <Button type="button" variant="outline" onClick={onClose}>
                  Annulla
                </Button>
                <Button 
                  type="submit" 
                  disabled={createScheduleMutation.isPending || updateScheduleMutation.isPending}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {createScheduleMutation.isPending || updateScheduleMutation.isPending ? 
                    "Salvando..." : 
                    mode === 'edit' ? "Aggiorna" : "Salva"
                  }
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
