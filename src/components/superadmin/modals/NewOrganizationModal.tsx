
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface NewOrganizationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const NewOrganizationModal = ({ open, onOpenChange }: NewOrganizationModalProps) => {
  const [formData, setFormData] = useState({
    organizationName: "",
    contactPerson: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "",
    licenseType: "",
    estimatedUsers: "",
    businessType: "",
    fleetSize: "",
    notes: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.organizationName || !formData.email || !formData.contactPerson) {
      toast.error("Compila tutti i campi obbligatori");
      return;
    }

    console.log("Nuova richiesta organizzazione:", formData);
    toast.success("Richiesta inviata con successo! Sarà processata entro 24 ore.");
    onOpenChange(false);
    
    // Reset form
    setFormData({
      organizationName: "",
      contactPerson: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      country: "",
      licenseType: "",
      estimatedUsers: "",
      businessType: "",
      fleetSize: "",
      notes: ""
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nuova Richiesta Organizzazione</DialogTitle>
          <DialogDescription>
            Inserisci una nuova richiesta di setup per un'organizzazione
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informazioni Organizzazione */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Informazioni Organizzazione</h3>
            
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

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="contactPerson">Persona di Contatto *</Label>
                <Input
                  id="contactPerson"
                  value={formData.contactPerson}
                  onChange={(e) => setFormData(prev => ({ ...prev, contactPerson: e.target.value }))}
                  placeholder="Nome del referente"
                  required
                />
              </div>
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
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">Telefono</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="+39 xxx xxxxxxx"
                />
              </div>
              <div>
                <Label htmlFor="businessType">Tipo di Business</Label>
                <Select value={formData.businessType} onValueChange={(value) => setFormData(prev => ({ ...prev, businessType: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleziona tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="airline">Compagnia Aerea</SelectItem>
                    <SelectItem value="charter">Charter</SelectItem>
                    <SelectItem value="private">Aviazione Privata</SelectItem>
                    <SelectItem value="helicopter">Servizi Elicotteristici</SelectItem>
                    <SelectItem value="maintenance">Centro Manutenzione</SelectItem>
                    <SelectItem value="training">Centro Addestramento</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Indirizzo */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Indirizzo</h3>
            
            <div>
              <Label htmlFor="address">Indirizzo</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                placeholder="Via, numero civico"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">Città</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                  placeholder="Città"
                />
              </div>
              <div>
                <Label htmlFor="country">Paese</Label>
                <Select value={formData.country} onValueChange={(value) => setFormData(prev => ({ ...prev, country: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleziona paese" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="IT">Italia</SelectItem>
                    <SelectItem value="FR">Francia</SelectItem>
                    <SelectItem value="DE">Germania</SelectItem>
                    <SelectItem value="ES">Spagna</SelectItem>
                    <SelectItem value="UK">Regno Unito</SelectItem>
                    <SelectItem value="CH">Svizzera</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Requisiti Licenza */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Requisiti Licenza</h3>
            
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="licenseType">Tipo Licenza Richiesta</Label>
                <Select value={formData.licenseType} onValueChange={(value) => setFormData(prev => ({ ...prev, licenseType: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleziona" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="trial">Trial</SelectItem>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                    <SelectItem value="enterprise">Enterprise</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="estimatedUsers">Utenti Stimati</Label>
                <Input
                  id="estimatedUsers"
                  type="number"
                  value={formData.estimatedUsers}
                  onChange={(e) => setFormData(prev => ({ ...prev, estimatedUsers: e.target.value }))}
                  placeholder="10"
                />
              </div>
              <div>
                <Label htmlFor="fleetSize">Dimensione Flotta</Label>
                <Input
                  id="fleetSize"
                  type="number"
                  value={formData.fleetSize}
                  onChange={(e) => setFormData(prev => ({ ...prev, fleetSize: e.target.value }))}
                  placeholder="5"
                />
              </div>
            </div>
          </div>

          {/* Note */}
          <div>
            <Label htmlFor="notes">Note Aggiuntive</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Eventuali note o richieste speciali..."
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annulla
            </Button>
            <Button type="submit">
              Invia Richiesta
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
