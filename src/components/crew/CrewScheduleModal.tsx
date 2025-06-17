
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { AlertTriangle, Clock, User } from "lucide-react";
import { useCrewMembers } from "@/hooks/useCrewMembers";
import { useCreatePilotSchedule, useUpdatePilotSchedule } from "@/hooks/usePilotSchedule";
import { toast } from "sonner";

interface CrewScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  schedule?: any;
  preselectedCrewMember?: string;
}

interface ScheduleFormData {
  pilot_id: string;
  start_date: string;
  end_date: string;
  schedule_type: string;
  notes?: string;
}

export const CrewScheduleModal = ({ 
  isOpen, 
  onClose, 
  schedule, 
  preselectedCrewMember 
}: CrewScheduleModalProps) => {
  const [ftlWarnings, setFtlWarnings] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { data: crewMembers = [] } = useCrewMembers();
  const pilots = crewMembers.filter(crew => ['captain', 'first_officer'].includes(crew.position));
  
  const createSchedule = useCreatePilotSchedule();
  const updateSchedule = useUpdatePilotSchedule();

  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<ScheduleFormData>({
    defaultValues: {
      pilot_id: preselectedCrewMember || '',
      schedule_type: 'flight_duty',
      start_date: format(new Date(), 'yyyy-MM-ddTHH:mm'),
      end_date: format(new Date(Date.now() + 8 * 60 * 60 * 1000), 'yyyy-MM-ddTHH:mm')
    }
  });

  const watchedValues = watch();

  useEffect(() => {
    if (schedule) {
      reset({
        pilot_id: schedule.pilot_id,
        start_date: format(new Date(schedule.start_date), 'yyyy-MM-ddTHH:mm'),
        end_date: format(new Date(schedule.end_date), 'yyyy-MM-ddTHH:mm'),
        schedule_type: schedule.schedule_type,
        notes: schedule.notes || ''
      });
    } else if (preselectedCrewMember) {
      setValue('pilot_id', preselectedCrewMember);
    }
  }, [schedule, preselectedCrewMember, reset, setValue]);

  // FTL Validation
  useEffect(() => {
    if (watchedValues.pilot_id && watchedValues.start_date && watchedValues.end_date) {
      validateFTL();
    }
  }, [watchedValues]);

  const validateFTL = () => {
    const warnings: string[] = [];
    const startDate = new Date(watchedValues.start_date);
    const endDate = new Date(watchedValues.end_date);
    const durationHours = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);

    // Basic FTL checks
    if (watchedValues.schedule_type === 'flight_duty') {
      if (durationHours > 14) {
        warnings.push('Il servizio di volo supera le 14 ore massime giornaliere');
      }
      if (durationHours > 10 && startDate.getHours() < 6) {
        warnings.push('Servizio notturno limitato a 10 ore');
      }
    }

    if (watchedValues.schedule_type === 'simulator' && durationHours > 8) {
      warnings.push('Il training al simulatore supera le 8 ore massime');
    }

    // Check rest periods (simplified)
    const restHours = 24 - durationHours;
    if (restHours < 12 && watchedValues.schedule_type === 'flight_duty') {
      warnings.push('Periodo di riposo insufficiente (minimo 12 ore)');
    }

    setFtlWarnings(warnings);
  };

  const onSubmit = async (data: ScheduleFormData) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    console.log('Submitting schedule data:', data);

    try {
      // Enhanced validation
      if (!data.pilot_id) {
        toast.error('Seleziona un pilota');
        return;
      }
      
      if (!data.start_date || !data.end_date) {
        toast.error('Inserisci data e ora di inizio e fine');
        return;
      }

      // Validate that end date is after start date
      const startDate = new Date(data.start_date);
      const endDate = new Date(data.end_date);
      
      if (endDate <= startDate) {
        toast.error('La data di fine deve essere successiva alla data di inizio');
        return;
      }

      // Verify pilot exists
      const selectedPilot = pilots.find(p => p.id === data.pilot_id);
      if (!selectedPilot) {
        toast.error('Pilota selezionato non valido');
        return;
      }

      console.log('Validation passed, preparing schedule data');

      // Prepare schedule data for database
      const scheduleData = {
        pilot_id: data.pilot_id,
        start_date: data.start_date, // Will be converted to ISO in the hook
        end_date: data.end_date, // Will be converted to ISO in the hook
        schedule_type: data.schedule_type,
        notes: data.notes || undefined
      };

      console.log('Final schedule data to be sent:', scheduleData);

      if (schedule?.id) {
        console.log('Updating existing schedule:', schedule.id);
        await updateSchedule.mutateAsync({
          id: schedule.id,
          ...scheduleData
        });
      } else {
        console.log('Creating new schedule');
        await createSchedule.mutateAsync(scheduleData);
      }
      
      console.log('Schedule operation completed successfully');
      onClose();
      reset();
    } catch (error: any) {
      console.error('Error saving schedule:', error);
      toast.error('Errore nel salvare l\'orario: ' + (error.message || 'Errore sconosciuto'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const getScheduleTypeLabel = (type: string) => {
    const types = {
      'flight_duty': 'Servizio di Volo',
      'simulator': 'Simulatore',
      'standby': 'Standby',
      'rest': 'Riposo',
      'training': 'Training',
      'unavailable': 'Non Disponibile'
    };
    return types[type as keyof typeof types] || type;
  };

  const selectedPilot = pilots.find(p => p.id === watchedValues.pilot_id);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {schedule ? 'Modifica Orario' : 'Nuovo Orario'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Pilot Selection */}
          <div className="space-y-2">
            <Label htmlFor="pilot_id">Pilota *</Label>
            <Select value={watchedValues.pilot_id} onValueChange={(value) => setValue('pilot_id', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Seleziona pilota" />
              </SelectTrigger>
              <SelectContent>
                {pilots.map((pilot) => (
                  <SelectItem key={pilot.id} value={pilot.id}>
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      {pilot.first_name} {pilot.last_name} ({pilot.position})
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.pilot_id && <p className="text-sm text-red-500">Pilota obbligatorio</p>}
          </div>

          {/* Schedule Type */}
          <div className="space-y-2">
            <Label htmlFor="schedule_type">Tipo di Servizio *</Label>
            <Select value={watchedValues.schedule_type} onValueChange={(value) => setValue('schedule_type', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Seleziona tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="flight_duty">Servizio di Volo</SelectItem>
                <SelectItem value="simulator">Simulatore</SelectItem>
                <SelectItem value="standby">Standby</SelectItem>
                <SelectItem value="rest">Riposo</SelectItem>
                <SelectItem value="training">Training</SelectItem>
                <SelectItem value="unavailable">Non Disponibile</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start_date">Data/Ora Inizio *</Label>
              <Input
                type="datetime-local"
                {...register('start_date', { required: 'Data inizio obbligatoria' })}
              />
              {errors.start_date && <p className="text-sm text-red-500">{errors.start_date.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="end_date">Data/Ora Fine *</Label>
              <Input
                type="datetime-local"
                {...register('end_date', { required: 'Data fine obbligatoria' })}
              />
              {errors.end_date && <p className="text-sm text-red-500">{errors.end_date.message}</p>}
            </div>
          </div>

          {/* Duration Info */}
          {watchedValues.start_date && watchedValues.end_date && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  Informazioni Durata
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm">
                  <p>Durata: {Math.round((new Date(watchedValues.end_date).getTime() - new Date(watchedValues.start_date).getTime()) / (1000 * 60 * 60) * 10) / 10} ore</p>
                  <p>Tipo: {getScheduleTypeLabel(watchedValues.schedule_type)}</p>
                  {selectedPilot && (
                    <p>Pilota: {selectedPilot.first_name} {selectedPilot.last_name}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* FTL Warnings */}
          {ftlWarnings.length > 0 && (
            <Card className="border-orange-200 bg-orange-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center text-orange-800">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Avvisi FTL
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  {ftlWarnings.map((warning, index) => (
                    <div key={index} className="flex items-center text-sm text-orange-700">
                      <span className="w-2 h-2 bg-orange-400 rounded-full mr-2"></span>
                      {warning}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Note</Label>
            <Textarea
              {...register('notes')}
              placeholder="Note aggiuntive sull'orario..."
              rows={3}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Annulla
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting || createSchedule.isPending || updateSchedule.isPending}
            >
              {isSubmitting ? 'Salvando...' : schedule ? 'Aggiorna' : 'Salva'} Orario
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
