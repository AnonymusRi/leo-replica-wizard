
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Calendar, CheckCircle, AlertTriangle, Plus, X } from "lucide-react";
import { useAircraft } from "@/hooks/useAircraft";
import { useCrewMembers } from "@/hooks/useCrewMembers";

interface PilotCertificationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  aircraftId?: string;
}

export const PilotCertificationModal = ({ open, onOpenChange, aircraftId }: PilotCertificationModalProps) => {
  const [selectedPilotId, setSelectedPilotId] = useState("");
  const [selectedAircraftId, setSelectedAircraftId] = useState(aircraftId || "");
  const [newCertification, setNewCertification] = useState({
    license: "",
    expiry_date: "",
    issuing_authority: ""
  });

  const { data: aircraft = [] } = useAircraft();
  const { data: crewMembers = [] } = useCrewMembers();

  const pilots = crewMembers.filter(member => 
    member.position === "captain" || member.position === "first_officer"
  );

  // Mock data per certificazioni piloti
  const [pilotCertifications, setPilotCertifications] = useState<{[key: string]: Array<{license: string, expiry: string, authority: string, valid: boolean}>}>({});

  const selectedPilot = pilots.find(p => p.id === selectedPilotId);
  const selectedAircraft = aircraft.find(ac => ac.id === selectedAircraftId);

  // Mock licenze richieste per aeromobile
  const requiredLicenses = {
    "Citation CJ3+": ["ATPL", "Type Rating CJ3+", "IR", "Medical Class 1"],
    "Falcon 7X": ["ATPL", "Type Rating DA7X", "IR", "Medical Class 1", "RVSM"],
    "Gulfstream G650": ["ATPL", "Type Rating GLEX", "IR", "Medical Class 1", "RVSM", "ETOPS"],
    "King Air 350": ["CPL", "Type Rating BE20", "IR", "Medical Class 1"]
  };

  const getCurrentLicenses = (pilotId: string) => {
    return pilotCertifications[pilotId] || [];
  };

  const addCertification = () => {
    if (newCertification.license && selectedPilotId) {
      const certification = {
        license: newCertification.license,
        expiry: newCertification.expiry_date,
        authority: newCertification.issuing_authority,
        valid: new Date(newCertification.expiry_date) > new Date()
      };

      setPilotCertifications(prev => ({
        ...prev,
        [selectedPilotId]: [...(prev[selectedPilotId] || []), certification]
      }));

      setNewCertification({
        license: "",
        expiry_date: "",
        issuing_authority: ""
      });
    }
  };

  const removeCertification = (pilotId: string, index: number) => {
    setPilotCertifications(prev => ({
      ...prev,
      [pilotId]: prev[pilotId].filter((_, i) => i !== index)
    }));
  };

  const checkPilotComplianceForAircraft = (pilotId: string, aircraftModel: string) => {
    const required = requiredLicenses[aircraftModel as keyof typeof requiredLicenses] || [];
    const pilotLicenses = getCurrentLicenses(pilotId);
    
    return required.every(req => 
      pilotLicenses.some(cert => 
        cert.license.toLowerCase().includes(req.toLowerCase()) && cert.valid
      )
    );
  };

  const getExpiringLicenses = (pilotId: string) => {
    const licenses = getCurrentLicenses(pilotId);
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    
    return licenses.filter(cert => {
      const expiryDate = new Date(cert.expiry);
      return expiryDate <= thirtyDaysFromNow && expiryDate > new Date();
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Users className="w-5 h-5 mr-2 text-green-600" />
            Gestione Certificazioni Piloti
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Panoramica</TabsTrigger>
            <TabsTrigger value="manage">Gestisci Certificazioni</TabsTrigger>
            <TabsTrigger value="compliance">Compliance Aeromobili</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pilots.map((pilot) => {
                const licenses = getCurrentLicenses(pilot.id);
                const expiring = getExpiringLicenses(pilot.id);
                const expired = licenses.filter(cert => !cert.valid);

                return (
                  <Card key={pilot.id}>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center justify-between">
                        <span>{pilot.first_name} {pilot.last_name}</span>
                        <Badge variant="outline" className="capitalize">
                          {pilot.position}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Licenze Totali:</span>
                          <span className="font-medium">{licenses.length}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">In Scadenza:</span>
                          <span className={`font-medium ${expiring.length > 0 ? 'text-yellow-600' : 'text-green-600'}`}>
                            {expiring.length}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Scadute:</span>
                          <span className={`font-medium ${expired.length > 0 ? 'text-red-600' : 'text-green-600'}`}>
                            {expired.length}
                          </span>
                        </div>
                        
                        {expiring.length > 0 && (
                          <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded">
                            <div className="text-xs text-yellow-800 font-medium">
                              Licenze in scadenza:
                            </div>
                            {expiring.map((cert, idx) => (
                              <div key={idx} className="text-xs text-yellow-700">
                                {cert.license} - {new Date(cert.expiry).toLocaleDateString()}
                              </div>
                            ))}
                          </div>
                        )}
                        
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="w-full"
                          onClick={() => {
                            setSelectedPilotId(pilot.id);
                          }}
                        >
                          Gestisci Licenze
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="manage" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Selezione Pilota */}
              <Card>
                <CardHeader>
                  <CardTitle>Seleziona Pilota</CardTitle>
                </CardHeader>
                <CardContent>
                  <Select value={selectedPilotId} onValueChange={setSelectedPilotId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleziona un pilota" />
                    </SelectTrigger>
                    <SelectContent>
                      {pilots.map((pilot) => (
                        <SelectItem key={pilot.id} value={pilot.id}>
                          {pilot.first_name} {pilot.last_name} ({pilot.position})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>

              {/* Aggiungi Certificazione */}
              {selectedPilot && (
                <Card>
                  <CardHeader>
                    <CardTitle>Aggiungi Certificazione</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label htmlFor="license">Licenza/Certificazione</Label>
                      <Input
                        id="license"
                        placeholder="es. ATPL, Type Rating, IR"
                        value={newCertification.license}
                        onChange={(e) => setNewCertification(prev => ({ ...prev, license: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="expiry">Data Scadenza</Label>
                      <Input
                        id="expiry"
                        type="date"
                        value={newCertification.expiry_date}
                        onChange={(e) => setNewCertification(prev => ({ ...prev, expiry_date: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="authority">Autorità Rilascio</Label>
                      <Input
                        id="authority"
                        placeholder="es. EASA, FAA, ENAC"
                        value={newCertification.issuing_authority}
                        onChange={(e) => setNewCertification(prev => ({ ...prev, issuing_authority: e.target.value }))}
                      />
                    </div>
                    <Button onClick={addCertification} className="w-full">
                      <Plus className="w-4 h-4 mr-2" />
                      Aggiungi Certificazione
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Licenze Attuali */}
            {selectedPilot && (
              <Card>
                <CardHeader>
                  <CardTitle>
                    Licenze di {selectedPilot.first_name} {selectedPilot.last_name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {getCurrentLicenses(selectedPilotId).map((cert, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">{cert.license}</div>
                          <div className="text-sm text-gray-600">
                            Scadenza: {new Date(cert.expiry).toLocaleDateString()}
                            {cert.authority && ` • ${cert.authority}`}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={cert.valid ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                            {cert.valid ? (
                              <>
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Valida
                              </>
                            ) : (
                              <>
                                <AlertTriangle className="w-3 h-3 mr-1" />
                                Scaduta
                              </>
                            )}
                          </Badge>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeCertification(selectedPilotId, index)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    
                    {getCurrentLicenses(selectedPilotId).length === 0 && (
                      <div className="text-center text-gray-500 py-4">
                        Nessuna certificazione registrata
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="compliance" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {aircraft.map((ac) => {
                const required = requiredLicenses[ac.model as keyof typeof requiredLicenses] || [];
                const compliantPilots = pilots.filter(pilot => 
                  checkPilotComplianceForAircraft(pilot.id, ac.model)
                );

                return (
                  <Card key={ac.id}>
                    <CardHeader>
                      <CardTitle className="text-lg">
                        {ac.tail_number} - {ac.model}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h5 className="font-medium mb-2">Licenze Richieste:</h5>
                          <div className="flex flex-wrap gap-1">
                            {required.map((license) => (
                              <Badge key={license} variant="outline" className="text-xs">
                                {license}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h5 className="font-medium mb-2">
                            Piloti Certificati ({compliantPilots.length}/{pilots.length}):
                          </h5>
                          <div className="space-y-2">
                            {pilots.map((pilot) => {
                              const isCompliant = checkPilotComplianceForAircraft(pilot.id, ac.model);
                              return (
                                <div key={pilot.id} className="flex items-center justify-between text-sm">
                                  <span>{pilot.first_name} {pilot.last_name}</span>
                                  <Badge className={isCompliant ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                                    {isCompliant ? "Certificato" : "Non Certificato"}
                                  </Badge>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Chiudi
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
