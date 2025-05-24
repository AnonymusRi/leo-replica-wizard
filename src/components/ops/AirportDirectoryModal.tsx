
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, MapPin, Clock, Phone, Globe } from "lucide-react";
import { useAirports } from "@/hooks/useAirports";

interface AirportDirectoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AirportDirectoryModal = ({ isOpen, onClose }: AirportDirectoryModalProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAirport, setSelectedAirport] = useState<any>(null);
  const { data: airports = [] } = useAirports();

  const filteredAirports = airports.filter(airport =>
    airport.icao_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    airport.iata_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    airport.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    airport.city?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAirportSelect = (airport: any) => {
    setSelectedAirport(airport);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Airport Directory Manual</DialogTitle>
        </DialogHeader>

        <div className="flex h-[600px]">
          {/* Left panel - Airport list */}
          <div className="w-1/3 border-r pr-4">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Cerca aeroporto (ICAO, IATA, nome, città)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {filteredAirports.map((airport) => (
                <div
                  key={airport.id}
                  className={`p-3 rounded border cursor-pointer transition-colors ${
                    selectedAirport?.id === airport.id 
                      ? 'bg-blue-50 border-blue-200' 
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => handleAirportSelect(airport)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{airport.icao_code}</div>
                      {airport.iata_code && (
                        <div className="text-sm text-gray-500">{airport.iata_code}</div>
                      )}
                    </div>
                    <Badge variant="outline">{airport.country || 'N/A'}</Badge>
                  </div>
                  <div className="text-sm text-gray-600 mt-1">{airport.name}</div>
                  {airport.city && (
                    <div className="text-xs text-gray-500">{airport.city}</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right panel - Airport details */}
          <div className="w-2/3 pl-4">
            {selectedAirport ? (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold flex items-center">
                    <MapPin className="w-5 h-5 mr-2" />
                    {selectedAirport.icao_code} / {selectedAirport.iata_code || 'N/A'} {selectedAirport.name}
                  </h3>
                  <p className="text-gray-600">{selectedAirport.city}, {selectedAirport.country}</p>
                </div>

                <Tabs defaultValue="details" className="w-full">
                  <TabsList>
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="taxi">Taxi & Extra</TabsTrigger>
                    <TabsTrigger value="handling">Handling / FBO</TabsTrigger>
                    <TabsTrigger value="fuel">Fuel Suppliers</TabsTrigger>
                    <TabsTrigger value="hotels">Hotels</TabsTrigger>
                    <TabsTrigger value="restrictions">Restrictions</TabsTrigger>
                    <TabsTrigger value="info">Information</TabsTrigger>
                    <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
                    <TabsTrigger value="notes">Notes & Files</TabsTrigger>
                    <TabsTrigger value="map">Map</TabsTrigger>
                  </TabsList>

                  <TabsContent value="details" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-sm text-gray-600 mb-2">Telephone</h4>
                        <div className="flex items-center">
                          <Phone className="w-4 h-4 mr-2 text-gray-400" />
                          <span>+1 718 553 1648</span>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm text-gray-600 mb-2">Website</h4>
                        <div className="flex items-center">
                          <Globe className="w-4 h-4 mr-2 text-gray-400" />
                          <span>www.cbp.gov</span>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm text-gray-600 mb-2">Hours</h4>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-2 text-gray-400" />
                          <span>H24</span>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm text-gray-600 mb-2">Email</h4>
                        <span>mrw@cbp.dhs.gov</span>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-sm text-gray-600 mb-2">Coordinates</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-sm text-gray-500">Latitude:</span>
                          <span className="ml-2">{selectedAirport.latitude || 'N/A'}</span>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">Longitude:</span>
                          <span className="ml-2">{selectedAirport.longitude || 'N/A'}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-sm text-gray-600 mb-2">Elevation</h4>
                      <span>{selectedAirport.elevation || 'N/A'} ft</span>
                    </div>

                    <div>
                      <h4 className="font-medium text-sm text-gray-600 mb-2">Timezone</h4>
                      <span>{selectedAirport.timezone || 'N/A'}</span>
                    </div>
                  </TabsContent>

                  <TabsContent value="taxi">
                    <div className="text-center text-gray-500 py-8">
                      Informazioni taxi e servizi extra non disponibili
                    </div>
                  </TabsContent>

                  <TabsContent value="handling">
                    <div className="text-center text-gray-500 py-8">
                      Informazioni handling/FBO non disponibili
                    </div>
                  </TabsContent>

                  <TabsContent value="fuel">
                    <div className="text-center text-gray-500 py-8">
                      Informazioni fornitori carburante non disponibili
                    </div>
                  </TabsContent>

                  <TabsContent value="hotels">
                    <div className="text-center text-gray-500 py-8">
                      Informazioni hotel non disponibili
                    </div>
                  </TabsContent>

                  <TabsContent value="restrictions">
                    <div className="text-center text-gray-500 py-8">
                      Informazioni restrizioni non disponibili
                    </div>
                  </TabsContent>

                  <TabsContent value="info">
                    <div className="text-center text-gray-500 py-8">
                      Informazioni aggiuntive non disponibili
                    </div>
                  </TabsContent>

                  <TabsContent value="suppliers">
                    <div className="text-center text-gray-500 py-8">
                      Informazioni fornitori non disponibili
                    </div>
                  </TabsContent>

                  <TabsContent value="notes">
                    <div className="text-center text-gray-500 py-8">
                      Note e file non disponibili
                    </div>
                  </TabsContent>

                  <TabsContent value="map">
                    <div className="text-center text-gray-500 py-8">
                      Mappa non disponibile
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="flex space-x-2 pt-4 border-t">
                  <Button variant="outline">UPDATE</Button>
                  <Button variant="outline">CANCEL</Button>
                  <Button>ADD NEW</Button>
                  <Button variant="outline">SAVE</Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                Seleziona un aeroporto dalla lista per visualizzare i dettagli
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
