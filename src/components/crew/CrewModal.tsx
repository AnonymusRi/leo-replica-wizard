
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, Users, Loader2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useCreateCrewMember } from "@/hooks/useCrewMembers";
import { toast } from "sonner";

interface CrewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CrewModal = ({ open, onOpenChange }: CrewModalProps) => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    position: "captain" as "captain" | "first_officer" | "cabin_crew" | "mechanic",
    email: "",
    phone: "",
    license_number: "",
    license_expiry: null as Date | null,
    medical_expiry: null as Date | null,
    base_location: "",
    is_active: true
  });

  const createCrewMutation = useCreateCrewMember();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.first_name || !formData.last_name || !formData.position) {
      toast.error("Compila tutti i campi obbligatori");
      return;
    }

    try {
      await createCrewMutation.mutateAsync({
        first_name: formData.first_name,
        last_name: formData.last_name,
        position: formData.position,
        email: formData.email || null,
        phone: formData.phone || null,
        license_number: formData.license_number || null,
        license_expiry: formData.license_expiry ? formData.license_expiry.toISOString() : null,
        medical_expiry: formData.medical_expiry ? formData.medical_expiry.toISOString() : null,
        base_location: formData.base_location || null,
        is_active: formData.is_active
      });

      toast.success("Membro dell'equipaggio aggiunto con successo!");
      onOpenChange(false);
      
      // Reset form
      setFormData({
        first_name: "",
        last_name: "",
        position: "captain",
        email: "",
        phone: "",
        license_number: "",
        license_expiry: null,
        medical_expiry: null,
        base_location: "",
        is_active: true
      });
    } catch (error) {
      console.error("Error creating crew member:", error);
      toast.error("Errore nella creazione del membro dell'equipaggio");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Users className="w-5 h-5 mr-2" />
            Aggiungi Membro Equipaggio
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="first_name">Nome *</Label>
              <Input
                id="first_name"
                placeholder="Mario"
                value={formData.first_name}
                onChange={(e) => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="last_name">Cognome *</Label>
              <Input
                id="last_name"
                placeholder="Rossi"
                value={formData.last_name}
                onChange={(e) => setFormData(prev => ({ ...prev, last_name: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="position">Posizione *</Label>
              <Select 
                value={formData.position}
                onValueChange={(value: any) => setFormData(prev => ({ ...prev, position: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="captain">Comandante</SelectItem>
                  <SelectItem value="first_officer">Primo Ufficiale</SelectItem>
                  <SelectItem value="cabin_crew">Assistente di Volo</SelectItem>
                  <SelectItem value="mechanic">Meccanico</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="base_location">Base di Servizio</Label>
              <Input
                id="base_location"
                placeholder="LIRF"
                value={formData.base_location}
                onChange={(e) => setFormData(prev => ({ ...prev, base_location: e.target.value }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="mario.rossi@email.com"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="phone">Telefono</Label>
              <Input
                id="phone"
                placeholder="+39 123 456 7890"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="license_number">Numero Licenza</Label>
              <Input
                id="license_number"
                placeholder="IT-12345"
                value={formData.license_number}
                onChange={(e) => setFormData(prev => ({ ...prev, license_number: e.target.value }))}
              />
            </div>
            <div>
              <Label>Scadenza Licenza</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.license_expiry && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.license_expiry ? format(formData.license_expiry, "dd/MM/yyyy") : "Seleziona data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.license_expiry || undefined}
                    onSelect={(date) => setFormData(prev => ({ ...prev, license_expiry: date }))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Label>Scadenza Visita Medica</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.medical_expiry && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.medical_expiry ? format(formData.medical_expiry, "dd/MM/yyyy") : "Seleziona data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.medical_expiry || undefined}
                    onSelect={(date) => setFormData(prev => ({ ...prev, medical_expiry: date }))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="is_active"
              checked={formData.is_active}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
            />
            <Label htmlFor="is_active">Membro attivo</Label>
          </div>

          <div className="flex justify-end space-x-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annulla
            </Button>
            <Button 
              type="submit" 
              className="bg-blue-600 hover:bg-blue-700"
              disabled={createCrewMutation.isPending}
            >
              {createCrewMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Salvataggio...
                </>
              ) : (
                "Salva"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
