
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, Plus, X, CheckCircle, AlertTriangle } from "lucide-react";
import { useAircraft } from "@/hooks/useAircraft";
import { useCrewMembers } from "@/hooks/useCrewMembers";

interface LicenseRequirementsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  aircraftId?: string;
}

export const LicenseRequirementsModal = ({ open, onOpenChange, aircraftId }: LicenseRequirementsModalProps) => {
  const [selectedAircraftId, setSelectedAircraftId] = useState(aircraftId || "");
  const [newLicense, setNewLicense] = useState("");
  
  const { data: aircraft = [] } = useAircraft();
  const { data: crewMembers = [] } = useCrewMembers();

  // Mock data per licenze richieste
  const [licenseRequirements, setLicenseRequirements] = useState({
    "Citation CJ3+": ["ATPL", "Type Rating CJ3+", "IR", "Medical Class 1"],
    "Falcon 7X": ["ATPL", "Type Rating DA7X", "IR", "Medical Class 1", "RVSM"],
    "Gulfstream G650": ["ATPL", "Type Rating GLEX", "IR", "Medical Class 1", "RVSM", "ETOPS"],
    "King Air 350": ["CPL", "Type Rating BE20", "IR", "Medical Class 1"]
  });

  const selectedAircraft = aircraft.find(ac => ac.id === selectedAircraftId);
  const currentLicenses = selectedAircraft ? licenseRequirements[selectedAircraft.model as keyof typeof licenseRequirements] || [] : [];
  
  const pilots = crewMembers.filter(member => 
    member.position === "captain" || member.position === "first_officer"
  );

  const commonLicenses = [
    "ATPL", "CPL", "PPL", "IR", "Medical Class 1", "Medical Class 2",
    "Type Rating", "RVSM", "ETOPS", "PBN", "UPRT"
  ];

  const addLicense = () => {
    if (newLicense && selectedAircraft && !currentLicenses.includes(newLicense)) {
      setLicenseRequirements(prev => ({
        ...prev,
        [selectedAircraft.model]: [...currentLicenses, newLicense]
      }));
      setNewLicense("");
    }
  };

  const removeLicense = (license: string) => {
    if (selectedAircraft) {
      setLicenseRequirements(prev => ({
        ...prev,
        [selectedAircraft.model]: currentLicenses.filter(l => l !== license)
      }));
    }
  };

  // Simula il controllo delle licenze di un pilota
  const checkPilotHasLicense = (pilotId: string, license: string) => {
    // Mock logic - in produzione verificherebbe le licenze dal database
    return Math.random() > 0.4; // 60% dei piloti hanno la licenza
  };

  const getPilotComplianceStatus = (pilotId: string) => {
    const hasAllLicenses = currentLicenses.every(license => 
      checkPilotHasLicense(pilotId, license)
    );
    return hasAllLicenses;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Settings className="w-5 h-5 mr-2 text-blue-600" />
            Gestione Licenze Richieste
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Selezione Aeromobile */}
          <div>
            <Label htmlFor="aircraft">Seleziona Aeromobile</Label>
            <Select value={selectedAircraftId} onValueChange={setSelectedAircraftId}>
              <SelectTrigger>
                <SelectValue placeholder="Seleziona un aeromobile" />
              </SelectTrigger>
              <SelectContent>
                {aircraft.map((ac) => (
                  <SelectItem key={ac.id} value={ac.id}>
                    {ac.tail_number} - {ac.manufacturer} {ac.model}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedAircraft && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Licenze Richieste */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Licenze per {selectedAircraft.model}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {currentLicenses.map((license) => (
                      <Badge key={license} variant="secondary" className="flex items-center">
                        {license}
                        <button
                          onClick={() => removeLicense(license)}
                          className="ml-1 text-red-500 hover:text-red-700"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex space-x-2">
                      <Select value={newLicense} onValueChange={setNewLicense}>
                        <SelectTrigger className="flex-1">
                          <SelectValue placeholder="Seleziona licenza" />
                        </SelectTrigger>
                        <SelectContent>
                          {commonLicenses.filter(l => !currentLicenses.includes(l)).map((license) => (
                            <SelectItem key={license} value={license}>
                              {license}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button onClick={addLicense} disabled={!newLicense}>
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
                            addLicense();
                          }
                        }}
                      />
                      <Button onClick={addLicense} disabled={!newLicense}>
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Status Piloti */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Status Certificazione Piloti
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {pilots.map((pilot) => {
                      const isCompliant = getPilotComplianceStatus(pilot.id);
                      return (
                        <div key={pilot.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">
                              {pilot.first_name} {pilot.last_name}
                            </div>
                            <div className="text-sm text-gray-600 capitalize">
                              {pilot.position}
                            </div>
                          </div>
                          <div className="flex items-center">
                            {isCompliant ? (
                              <Badge className="bg-green-100 text-green-800">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Certificato
                              </Badge>
                            ) : (
                              <Badge className="bg-red-100 text-red-800">
                                <AlertTriangle className="w-3 h-3 mr-1" />
                                Non Certificato
                              </Badge>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  {pilots.length === 0 && (
                    <div className="text-center text-gray-500 py-4">
                      Nessun pilota disponibile
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {!selectedAircraft && (
            <div className="text-center text-gray-500 py-8">
              Seleziona un aeromobile per gestire le licenze richieste
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Chiudi
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            Salva Modifiche
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
