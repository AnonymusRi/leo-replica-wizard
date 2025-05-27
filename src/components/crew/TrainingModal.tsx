
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useCreateTrainingRecord, useUpdateTrainingRecord, TrainingRecord } from "@/hooks/useTrainingRecords";
import { format } from "date-fns";

interface TrainingModalProps {
  isOpen: boolean;
  onClose: () => void;
  pilots: Array<{ id: string; first_name: string; last_name: string }>;
  selectedPilot?: string;
  existingRecord?: TrainingRecord | null;
  mode: 'create' | 'edit';
}

export const TrainingModal = ({
  isOpen,
  onClose,
  pilots,
  selectedPilot,
  existingRecord,
  mode
}: TrainingModalProps) => {
  const [formData, setFormData] = useState({
    pilot_id: selectedPilot || '',
    training_type: 'simulator' as 'simulator' | 'aircraft' | 'ground_school' | 'recurrent' | 'type_rating' | 'proficiency_check',
    training_date: format(new Date(), 'yyyy-MM-dd'),
    duration_hours: 2,
    instructor_id: '',
    training_organization: '',
    training_description: '',
    certification_achieved: '',
    expiry_date: '',
    counts_as_duty_time: true,
    counts_as_flight_time: false,
    ftl_applicable: true,
    status: 'scheduled' as 'scheduled' | 'in_progress' | 'completed' | 'cancelled',
    notes: ''
  });

  const createMutation = useCreateTrainingRecord();
  const updateMutation = useUpdateTrainingRecord();

  useEffect(() => {
    if (existingRecord && mode === 'edit') {
      setFormData({
        pilot_id: existingRecord.pilot_id,
        training_type: existingRecord.training_type,
        training_date: format(new Date(existingRecord.training_date), 'yyyy-MM-dd'),
        duration_hours: existingRecord.duration_hours,
        instructor_id: existingRecord.instructor_id || '',
        training_organization: existingRecord.training_organization,
        training_description: existingRecord.training_description,
        certification_achieved: existingRecord.certification_achieved || '',
        expiry_date: existingRecord.expiry_date ? format(new Date(existingRecord.expiry_date), 'yyyy-MM-dd') : '',
        counts_as_duty_time: existingRecord.counts_as_duty_time,
        counts_as_flight_time: existingRecord.counts_as_flight_time,
        ftl_applicable: existingRecord.ftl_applicable,
        status: existingRecord.status,
        notes: existingRecord.notes || ''
      });
    } else if (mode === 'create') {
      setFormData(prev => ({
        ...prev,
        pilot_id: selectedPilot || ''
      }));
    }
  }, [existingRecord, mode, selectedPilot]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const submitData = {
      ...formData,
      training_date: new Date(formData.training_date).toISOString(),
      expiry_date: formData.expiry_date ? new Date(formData.expiry_date).toISOString() : undefined
    };

    if (mode === 'edit' && existingRecord) {
      updateMutation.mutate({ 
        id: existingRecord.id, 
        ...submitData 
      });
    } else {
      createMutation.mutate(submitData);
    }

    onClose();
  };

  const trainingTypes = [
    { value: 'simulator', label: 'Simulatore' },
    { value: 'aircraft', label: 'Aeromobile' },
    { value: 'ground_school', label: 'Scuola a Terra' },
    { value: 'recurrent', label: 'Ricorrente' },
    { value: 'type_rating', label: 'Abilitazione al Tipo' },
    { value: 'proficiency_check', label: 'Controllo di Competenza' }
  ];

  const statusOptions = [
    { value: 'scheduled', label: 'Programmato' },
    { value: 'in_progress', label: 'In Corso' },
    { value: 'completed', label: 'Completato' },
    { value: 'cancelled', label: 'Annullato' }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === 'edit' ? 'Modifica Addestramento' : 'Nuovo Addestramento'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="pilot_id">Pilota *</Label>
              <Select value={formData.pilot_id} onValueChange={(value) => setFormData(prev => ({ ...prev, pilot_id: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleziona pilota" />
                </SelectTrigger>
                <SelectContent>
                  {pilots.map((pilot) => (
                    <SelectItem key={pilot.id} value={pilot.id}>
                      {pilot.first_name} {pilot.last_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="training_type">Tipo Addestramento *</Label>
              <Select value={formData.training_type} onValueChange={(value: typeof formData.training_type) => setFormData(prev => ({ ...prev, training_type: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {trainingTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="training_date">Data Addestramento *</Label>
              <Input
                type="date"
                value={formData.training_date}
                onChange={(e) => setFormData(prev => ({ ...prev, training_date: e.target.value }))}
                required
              />
            </div>

            <div>
              <Label htmlFor="duration_hours">Durata (ore) *</Label>
              <Input
                type="number"
                step="0.1"
                min="0"
                value={formData.duration_hours}
                onChange={(e) => setFormData(prev => ({ ...prev, duration_hours: parseFloat(e.target.value) }))}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="training_organization">Organizzazione *</Label>
              <Input
                value={formData.training_organization}
                onChange={(e) => setFormData(prev => ({ ...prev, training_organization: e.target.value }))}
                placeholder="Nome organizzazione di addestramento"
                required
              />
            </div>

            <div>
              <Label htmlFor="status">Stato</Label>
              <Select value={formData.status} onValueChange={(value: typeof formData.status) => setFormData(prev => ({ ...prev, status: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="training_description">Descrizione Addestramento *</Label>
            <Textarea
              value={formData.training_description}
              onChange={(e) => setFormData(prev => ({ ...prev, training_description: e.target.value }))}
              placeholder="Descrizione dettagliata dell'addestramento"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="certification_achieved">Certificazione Ottenuta</Label>
              <Input
                value={formData.certification_achieved}
                onChange={(e) => setFormData(prev => ({ ...prev, certification_achieved: e.target.value }))}
                placeholder="Es. ATPL, IR, MEP"
              />
            </div>

            <div>
              <Label htmlFor="expiry_date">Data Scadenza</Label>
              <Input
                type="date"
                value={formData.expiry_date}
                onChange={(e) => setFormData(prev => ({ ...prev, expiry_date: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium">Impatto sui Limiti FTL</h4>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="counts_as_duty_time">Conta come Duty Time</Label>
              <Switch
                checked={formData.counts_as_duty_time}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, counts_as_duty_time: checked }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="counts_as_flight_time">Conta come Flight Time</Label>
              <Switch
                checked={formData.counts_as_flight_time}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, counts_as_flight_time: checked }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="ftl_applicable">Soggetto a Limiti FTL</Label>
              <Switch
                checked={formData.ftl_applicable}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, ftl_applicable: checked }))}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Note</Label>
            <Textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Note aggiuntive sull'addestramento"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Annulla
            </Button>
            <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
              {mode === 'edit' ? 'Aggiorna' : 'Crea'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
