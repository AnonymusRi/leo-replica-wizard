
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plane, Plus, X } from "lucide-react";
import { toast } from "sonner";

interface AircraftModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AircraftModal = ({ open, onOpenChange }: AircraftModalProps) => {
  const [formData, setFormData] = useState({
    tail_number: "",
    manufacturer: "",
    model: "",
    aircraft_type: "",
    year_manufactured: "",
    max_passengers: "",
    home_base: "",
    status: "available" as const
  });

  const [requiredLicenses, setRequiredLicenses] = useState<string[]>([]);
  const [newLicense, setNewLicense] = useState("");

  const commonLicenses = [
    "ATPL", "CPL", "PPL", "IR", "Medical Class 1", "Medical Class 2",
    "Type Rating", "RVSM", "ETOPS", "PBN", "UPRT"
  ];

  const addLicense = (license: string) => {
    if (license && !requiredLicenses.includes(license)) {
      setRequiredLicenses([...requiredLicenses, license]);
      setNewLicense("");
    }
  };

  const removeLicense = (license: string) => {
    setRequiredLicenses(requiredLicenses.filter(l => l !== license));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.tail_number || !formData.manufacturer || !formData.model) {
      toast.error("Compila tutti i campi obbligatori");
      return;
    }

    try {
      // Qui implementeresti la logica per salvare l'aeromobile
      console.log("Creating aircraft:", { ...formData, requiredLicenses });
      toast.success("Aeromobile creato con successo!");
      onOpenChange(false);
      
      // Reset form
      setFormData({
        tail_number: "",
        manufacturer: "",
        model: "",
        aircraft_type: "",
        year_manufactured: "",
        max_passengers: "",
        home_base: "",
        status: "available"
      });
      setRequiredLicenses([]);
    } catch (error) {
      console.error("Error creating aircraft:", error);
      toast.error("Errore nella creazione dell'aeromobile");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Plane className="w-5 h-5 mr-2 text-blue-600" />
            Nuovo Aeromobile
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="tail_number">Tail Number *</Label>
              <Input
                id="tail_number"
                placeholder="N123AB"
                value={formData.tail_number}
                onChange={(e) => setFormData(prev => ({ ...prev, tail_number: e.target.value.toUpperCase() }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select 
                value={formData.status}
                onValueChange={(value: any) => setFormData(prev => ({ ...prev, status: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="aog">AOG</SelectItem>
                  <SelectItem value="retired">Retired</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="manufacturer">Produttore *</Label>
              <Input
                id="manufacturer"
                placeholder="Cessna"
                value={formData.manufacturer}
                onChange={(e) => setFormData(prev => ({ ...prev, manufacturer: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="model">Modello *</Label>
              <Input
                id="model"
                placeholder="Citation CJ3+"
                value={formData.model}
                onChange={(e) => setFormData(prev => ({ ...prev, model: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="aircraft_type">Tipo Aeromobile</Label>
              <Select 
                value={formData.aircraft_type}
                onValueChange={(value) => setFormData(prev => ({ ...prev, aircraft_type: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleziona tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Light Jet">Light Jet</SelectItem>
                  <SelectItem value="Mid Jet">Mid Jet</SelectItem>
                  <SelectItem value="Heavy Jet">Heavy Jet</SelectItem>
                  <SelectItem value="Ultra Long Range">Ultra Long Range</SelectItem>
                  <SelectItem value="Turboprop">Turboprop</SelectItem>
                  <SelectItem value="Helicopter">Helicopter</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="year_manufactured">Anno Produzione</Label>
              <Input
                id="year_manufactured"
                type="number"
                placeholder="2020"
                value={formData.year_manufactured}
                onChange={(e) => setFormData(prev => ({ ...prev, year_manufactured: e.target.value }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="max_passengers">Passeggeri Max</Label>
              <Input
                id="max_passengers"
                type="number"
                placeholder="8"
                value={formData.max_passengers}
                onChange={(e) => setFormData(prev => ({ ...prev, max_passengers: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="home_base">Base di Casa</Label>
              <Input
                id="home_base"
                placeholder="EGLL"
                value={formData.home_base}
                onChange={(e) => setFormData(prev => ({ ...prev, home_base: e.target.value.toUpperCase() }))}
              />
            </div>
          </div>

          {/* Licenze Richieste */}
          <div>
            <Label>Licenze Richieste per Pilotare</Label>
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {requiredLicenses.map((license) => (
                  <Badge key={license} variant="secondary" className="flex items-center">
                    {license}
                    <button
                      type="button"
                      onClick={() => removeLicense(license)}
                      className="ml-1 text-red-500 hover:text-red-700"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              
              <div className="flex space-x-2">
                <Select value={newLicense} onValueChange={setNewLicense}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Seleziona licenza" />
                  </SelectTrigger>
                  <SelectContent>
                    {commonLicenses.map((license) => (
                      <SelectItem key={license} value={license}>
                        {license}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => addLicense(newLicense)}
                  disabled={!newLicense}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="flex space-x-2">
                <Input
                  placeholder="Licenza personalizzata"
                  value={newLicense}
                  onChange={(e) => setNewLicense(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addLicense(newLicense);
                    }
                  }}
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => addLicense(newLicense)}
                  disabled={!newLicense}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annulla
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Crea Aeromobile
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
