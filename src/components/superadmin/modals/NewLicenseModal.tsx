
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Calendar, CalendarIcon } from "lucide-react";
import { toast } from "sonner";

interface NewLicenseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const NewLicenseModal = ({ open, onOpenChange }: NewLicenseModalProps) => {
  const [formData, setFormData] = useState({
    organizationName: "",
    contactPerson: "",
    email: "",
    phone: "",
    licenseType: "",
    maxUsers: "",
    modules: [] as string[],
    monthlyFee: "",
    startDate: "",
    endDate: "",
    notes: ""
  });

  const availableModules = [
    { id: "SCHED", name: "Schedule Management" },
    { id: "SALES", name: "Sales & Quotes" },
    { id: "OPS", name: "Operations" },
    { id: "CREW", name: "Crew Management" },
    { id: "MX", name: "Maintenance" },
    { id: "REPORTS", name: "Reports & Analytics" },
    { id: "ADMIN", name: "Administration" }
  ];

  const handleModuleToggle = (moduleId: string) => {
    setFormData(prev => ({
      ...prev,
      modules: prev.modules.includes(moduleId)
        ? prev.modules.filter(id => id !== moduleId)
        : [...prev.modules, moduleId]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validazione base
    if (!formData.organizationName || !formData.email || !formData.licenseType) {
      toast.error("Compila tutti i campi obbligatori");
      return;
    }

    console.log("Nuova licenza:", formData);
    toast.success("Licenza creata con successo!");
    onOpenChange(false);
    
    // Reset form
    setFormData({
      organizationName: "",
      contactPerson: "",
      email: "",
      phone: "",
      licenseType: "",
      maxUsers: "",
      modules: [],
      monthlyFee: "",
      startDate: "",
      endDate: "",
      notes: ""
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nuova Licenza</DialogTitle>
          <DialogDescription>
            Crea una nuova licenza per un'organizzazione
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informazioni Organizzazione */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Informazioni Organizzazione</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="organizationName">Nome Organizzazione *</Label>
                <Input
                  id="organizationName"
                  value={formData.organizationName}
                  onChange={(e) => setFormData(prev => ({ ...prev, organizationName: e.target.value }))}
                  placeholder="Nome dell'organizzazione"
                  required
                />
              </div>
              <div>
                <Label htmlFor="contactPerson">Persona di Contatto</Label>
                <Input
                  id="contactPerson"
                  value={formData.contactPerson}
                  onChange={(e) => setFormData(prev => ({ ...prev, contactPerson: e.target.value }))}
                  placeholder="Nome del referente"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="email@organizzazione.com"
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">Telefono</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="+39 xxx xxxxxxx"
                />
              </div>
            </div>
          </div>

          {/* Configurazione Licenza */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Configurazione Licenza</h3>
            
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="licenseType">Tipo Licenza *</Label>
                <Select value={formData.licenseType} onValueChange={(value) => setFormData(prev => ({ ...prev, licenseType: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleziona tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="trial">Trial (30 giorni)</SelectItem>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                    <SelectItem value="enterprise">Enterprise</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="maxUsers">Massimo Utenti</Label>
                <Input
                  id="maxUsers"
                  type="number"
                  value={formData.maxUsers}
                  onChange={(e) => setFormData(prev => ({ ...prev, maxUsers: e.target.value }))}
                  placeholder="10"
                />
              </div>
              <div>
                <Label htmlFor="monthlyFee">Canone Mensile (€)</Label>
                <Input
                  id="monthlyFee"
                  type="number"
                  value={formData.monthlyFee}
                  onChange={(e) => setFormData(prev => ({ ...prev, monthlyFee: e.target.value }))}
                  placeholder="299"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">Data Inizio</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="endDate">Data Scadenza</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                />
              </div>
            </div>
          </div>

          {/* Moduli Attivi */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Moduli Attivi</h3>
            <div className="grid grid-cols-2 gap-3">
              {availableModules.map((module) => (
                <div key={module.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={module.id}
                    checked={formData.modules.includes(module.id)}
                    onCheckedChange={() => handleModuleToggle(module.id)}
                  />
                  <Label htmlFor={module.id} className="flex-1 cursor-pointer">
                    <div className="flex items-center justify-between">
                      <span>{module.name}</span>
                      <Badge variant="outline" className="text-xs">{module.id}</Badge>
                    </div>
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Note */}
          <div>
            <Label htmlFor="notes">Note</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Note aggiuntive sulla licenza..."
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annulla
            </Button>
            <Button type="submit">
              Crea Licenza
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
