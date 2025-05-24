
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCreatePilotFlightHour, useCreatePilotSchedule } from "@/hooks/usePilotFlightHours";
import { Clock, Calendar, User } from "lucide-react";
import { CrewMember } from "@/types/database";

interface PilotTimeModalProps {
  isOpen: boolean;
  onClose: () => void;
  pilots: CrewMember[];
}

export const PilotTimeModal = ({ isOpen, onClose, pilots }: PilotTimeModalProps) => {
  const [recordType, setRecordType] = useState<'flight_hours' | 'schedule'>('flight_hours');
  const [formData, setFormData] = useState({
    pilot_id: '',
    flight_date: '',
    flight_hours: '',
    flight_type: 'commercial',
    start_date: '',
    end_date: '',
    schedule_type: 'available',
    notes: ''
  });

  const createFlightHour = useCreatePilotFlightHour();
  const createSchedule = useCreatePilotSchedule();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (recordType === 'flight_hours') {
        await createFlightHour.mutateAsync({
          pilot_id: formData.pilot_id,
          flight_date: formData.flight_date,
          flight_hours: parseFloat(formData.flight_hours),
          flight_type: formData.flight_type
        });
      } else {
        await createSchedule.mutateAsync({
          pilot_id: formData.pilot_id,
          start_date: formData.start_date,
          end_date: formData.end_date,
          schedule_type: formData.schedule_type,
          notes: formData.notes
        });
      }
      
      onClose();
      setFormData({
        pilot_id: '',
        flight_date: '',
        flight_hours: '',
        flight_type: 'commercial',
        start_date: '',
        end_date: '',
        schedule_type: 'available',
        notes: ''
      });
    } catch (error) {
      console.error('Errore durante il salvataggio:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            {recordType === 'flight_hours' ? (
              <Clock className="w-5 h-5 mr-2 text-blue-600" />
            ) : (
              <Calendar className="w-5 h-5 mr-2 text-green-600" />
            )}
            {recordType === 'flight_hours' ? 'Registra Ore di Volo' : 'Pianifica Schedule'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Tipo di Registrazione */}
          <div>
            <Label>Tipo Registrazione</Label>
            <Select value={recordType} onValueChange={(value: 'flight_hours' | 'schedule') => setRecordType(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="flight_hours">Ore di Volo</SelectItem>
                <SelectItem value="schedule">Pianificazione</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Selezione Pilota */}
          <div>
            <Label>Pilota</Label>
            <Select value={formData.pilot_id} onValueChange={(value) => setFormData({...formData, pilot_id: value})}>
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
          </div>

          {recordType === 'flight_hours' ? (
            <>
              {/* Data Volo */}
              <div>
                <Label>Data Volo</Label>
                <Input
                  type="date"
                  value={formData.flight_date}
                  onChange={(e) => setFormData({...formData, flight_date: e.target.value})}
                  required
                />
              </div>

              {/* Ore di Volo */}
              <div>
                <Label>Ore di Volo</Label>
                <Input
                  type="number"
                  step="0.1"
                  min="0"
                  max="24"
                  value={formData.flight_hours}
                  onChange={(e) => setFormData({...formData, flight_hours: e.target.value})}
                  placeholder="8.5"
                  required
                />
              </div>

              {/* Tipo Volo */}
              <div>
                <Label>Tipo Volo</Label>
                <Select value={formData.flight_type} onValueChange={(value) => setFormData({...formData, flight_type: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="commercial">Commerciale</SelectItem>
                    <SelectItem value="training">Addestramento</SelectItem>
                    <SelectItem value="ferry">Ferry</SelectItem>
                    <SelectItem value="positioning">Posizionamento</SelectItem>
                    <SelectItem value="maintenance">Manutenzione</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          ) : (
            <>
              {/* Data Inizio */}
              <div>
                <Label>Data/Ora Inizio</Label>
                <Input
                  type="datetime-local"
                  value={formData.start_date}
                  onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                  required
                />
              </div>

              {/* Data Fine */}
              <div>
                <Label>Data/Ora Fine</Label>
                <Input
                  type="datetime-local"
                  value={formData.end_date}
                  onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                  required
                />
              </div>

              {/* Tipo Schedule */}
              <div>
                <Label>Tipo Pianificazione</Label>
                <Select value={formData.schedule_type} onValueChange={(value) => setFormData({...formData, schedule_type: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">Disponibile</SelectItem>
                    <SelectItem value="rest">Riposo</SelectItem>
                    <SelectItem value="trading">Trading</SelectItem>
                    <SelectItem value="unavailable">Non Disponibile</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Note */}
              <div>
                <Label>Note</Label>
                <Textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  placeholder="Note aggiuntive..."
                  rows={3}
                />
              </div>
            </>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Annulla
            </Button>
            <Button 
              type="submit" 
              className="bg-blue-600 hover:bg-blue-700"
              disabled={createFlightHour.isPending || createSchedule.isPending}
            >
              {createFlightHour.isPending || createSchedule.isPending ? 'Salvando...' : 'Salva'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
