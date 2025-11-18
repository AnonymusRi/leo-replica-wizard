
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plane, 
  Plus, 
  Search, 
  Settings, 
  Users, 
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock
} from "lucide-react";
import { useAircraft } from "@/hooks/useAircraft";
import { useCrewMembers } from "@/hooks/useCrewMembers";
import { AircraftModal } from "./AircraftModal";
import { LicenseRequirementsModal } from "./LicenseRequirementsModal";
import { PilotCertificationModal } from "./PilotCertificationModal";

export const AircraftModule = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [showAircraftModal, setShowAircraftModal] = useState(false);
  const [showLicenseModal, setShowLicenseModal] = useState(false);
  const [showCertificationModal, setShowCertificationModal] = useState(false);
  const [selectedAircraft, setSelectedAircraft] = useState<string>("");

  const { data: aircraft = [], isLoading: aircraftLoading } = useAircraft();
  const { data: crewMembers = [], isLoading: crewLoading } = useCrewMembers();

  // Filtri per gli aeromobili
  const filteredAircraft = aircraft.filter(ac => {
    const matchesSearch = ac.tail_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ac.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ac.manufacturer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === "all" || ac.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  // Piloti (Captain e First Officer)
  const pilots = crewMembers.filter(member => 
    member.position === "captain" || member.position === "first_officer"
  );

  // Mock data per licenze richieste (in produzione verrebbe dal database)
  const licenseRequirements = {
    "Citation CJ3+": ["ATPL", "Type Rating CJ3+", "IR", "Medical Class 1"],
    "Falcon 7X": ["ATPL", "Type Rating DA7X", "IR", "Medical Class 1", "RVSM"],
    "Gulfstream G650": ["ATPL", "Type Rating GLEX", "IR", "Medical Class 1", "RVSM", "ETOPS"],
    "King Air 350": ["CPL", "Type Rating BE20", "IR", "Medical Class 1"]
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available": return "bg-green-100 text-green-800";
      case "maintenance": return "bg-yellow-100 text-yellow-800";
      case "aog": return "bg-red-100 text-red-800";
      case "retired": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "available": return <CheckCircle className="w-4 h-4" />;
      case "maintenance": return <Settings className="w-4 h-4" />;
      case "aog": return <AlertTriangle className="w-4 h-4" />;
      case "retired": return <Clock className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  // Controlla se un pilota ha le licenze necessarie per un aeromobile
  const checkPilotCertification = (pilotId: string, aircraftModel: string) => {
    // Mock logic - in produzione verificherebbe le licenze dal database
    const requiredLicenses = licenseRequirements[aircraftModel as keyof typeof licenseRequirements] || [];
    // Simula che alcuni piloti abbiano tutte le licenze, altri no
    return Math.random() > 0.3; // 70% dei piloti sono certificati
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Aircraft Management</h1>
          <p className="text-gray-600">Gestisci aeromobili, licenze e certificazioni piloti</p>
        </div>
        <div className="flex space-x-3">
          <Button 
            variant="outline" 
            onClick={() => setShowLicenseModal(true)}
          >
            <Settings className="w-4 h-4 mr-2" />
            Licenze Richieste
          </Button>
          <Button 
            variant="outline"
            onClick={() => setShowCertificationModal(true)}
          >
            <Users className="w-4 h-4 mr-2" />
            Certificazioni Piloti
          </Button>
          <Button 
            onClick={() => setShowAircraftModal(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nuovo Aeromobile
          </Button>
        </div>
      </div>

      {/* Filtri e Ricerca */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Cerca per tail number, modello o produttore..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex space-x-2">
              {["all", "available", "maintenance", "aog", "retired"].map((status) => (
                <Button
                  key={status}
                  variant={selectedStatus === status ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedStatus(status)}
                  className="capitalize"
                >
                  {status === "all" ? "Tutti" : status}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="aircraft" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="aircraft">Aeromobili</TabsTrigger>
          <TabsTrigger value="licenses">Licenze per Modello</TabsTrigger>
          <TabsTrigger value="certifications">Certificazioni Piloti</TabsTrigger>
        </TabsList>

        <TabsContent value="aircraft" className="space-y-4">
          {aircraftLoading ? (
            <div className="text-center py-8">Caricamento aeromobili...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAircraft.map((ac) => (
                <Card key={ac.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg font-semibold flex items-center">
                          <Plane className="w-5 h-5 mr-2 text-blue-600" />
                          {ac.tail_number}
                        </CardTitle>
                        <p className="text-sm text-gray-600">{ac.manufacturer} {ac.model}</p>
                      </div>
                      <Badge className={getStatusColor(ac.status)}>
                        {getStatusIcon(ac.status)}
                        <span className="ml-1 capitalize">{ac.status}</span>
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tipo:</span>
                        <span className="font-medium">{ac.aircraft_type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Passeggeri:</span>
                        <span className="font-medium">{ac.max_passengers || "N/A"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Anno:</span>
                        <span className="font-medium">{ac.year_manufactured || "N/A"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Base:</span>
                        <span className="font-medium">{ac.home_base || "N/A"}</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-3 border-t">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Piloti Certificati:</span>
                        <span className="font-medium text-green-600">
                          {pilots.filter(p => checkPilotCertification(p.id, ac.model)).length}/{pilots.length}
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 flex space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => {
                          setSelectedAircraft(ac.id);
                          setShowLicenseModal(true);
                        }}
                      >
                        Licenze
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => {
                          setSelectedAircraft(ac.id);
                          setShowCertificationModal(true);
                        }}
                      >
                        Piloti
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="licenses" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {Object.entries(licenseRequirements).map(([model, licenses]) => (
              <Card key={model}>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Plane className="w-5 h-5 mr-2 text-blue-600" />
                    {model}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900">Licenze Richieste:</h4>
                    <div className="flex flex-wrap gap-2">
                      {licenses.map((license) => (
                        <Badge key={license} variant="secondary">
                          {license}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="certifications" className="space-y-4">
          {crewLoading ? (
            <div className="text-center py-8">Caricamento piloti...</div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {pilots.map((pilot) => (
                <Card key={pilot.id}>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <Users className="w-5 h-5 mr-2 text-green-600" />
                      {pilot.first_name} {pilot.last_name}
                    </CardTitle>
                    <p className="text-sm text-gray-600 capitalize">{pilot.position}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Licenza:</span>
                        <span className="font-medium">{pilot.license_number || "N/A"}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Scadenza Licenza:</span>
                        <span className="font-medium">
                          {pilot.license_expiry ? new Date(pilot.license_expiry).toLocaleDateString() : "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Medical:</span>
                        <span className="font-medium">
                          {pilot.medical_expiry ? new Date(pilot.medical_expiry).toLocaleDateString() : "N/A"}
                        </span>
                      </div>
                      
                      <div className="pt-2 border-t">
                        <h5 className="text-sm font-medium text-gray-900 mb-2">Aeromobili Certificati:</h5>
                        <div className="space-y-1">
                          {aircraft.map((ac) => {
                            const isCertified = checkPilotCertification(pilot.id, ac.model);
                            return (
                              <div key={ac.id} className="flex items-center justify-between text-sm">
                                <span>{ac.model}</span>
                                <Badge 
                                  variant={isCertified ? "default" : "secondary"}
                                  className={isCertified ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                                >
                                  {isCertified ? "Certificato" : "Non Certificato"}
                                </Badge>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <AircraftModal 
        open={showAircraftModal}
        onOpenChange={setShowAircraftModal}
      />
      
      <LicenseRequirementsModal 
        open={showLicenseModal}
        onOpenChange={setShowLicenseModal}
        aircraftId={selectedAircraft}
      />
      
      <PilotCertificationModal 
        open={showCertificationModal}
        onOpenChange={setShowCertificationModal}
        aircraftId={selectedAircraft}
      />
    </div>
  );
};
