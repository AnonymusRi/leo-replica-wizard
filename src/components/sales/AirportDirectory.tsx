
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Globe, Clock, Plane, Phone, Mail } from "lucide-react";
import { useAirports } from "@/hooks/useAirports";

interface AirportDirectoryProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedAirport?: string;
}

export const AirportDirectory = ({ open, onOpenChange, selectedAirport }: AirportDirectoryProps) => {
  const [searchTerm, setSearchTerm] = useState(selectedAirport || "");
  const { data: airports = [], isLoading } = useAirports();

  const filteredAirports = airports.filter(airport =>
    airport.icao_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    airport.iata_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    airport.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    airport.city?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedAirportData = airports.find(airport => 
    airport.icao_code === searchTerm || airport.iata_code === searchTerm
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Plane className="w-5 h-5 mr-2 text-blue-600" />
            Airport Directory
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Search and List */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="search">Search Airport</Label>
              <Input
                id="search"
                placeholder="Search by ICAO, IATA, name or city..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Results ({filteredAirports.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="max-h-96 overflow-y-auto space-y-2">
                  {filteredAirports.slice(0, 20).map((airport) => (
                    <div
                      key={airport.id}
                      className={`p-3 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                        selectedAirportData?.id === airport.id ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                      }`}
                      onClick={() => setSearchTerm(airport.icao_code)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{airport.icao_code}</Badge>
                            {airport.iata_code && (
                              <Badge variant="secondary">{airport.iata_code}</Badge>
                            )}
                          </div>
                          <p className="font-medium text-sm mt-1">{airport.name}</p>
                          <p className="text-sm text-gray-600 flex items-center">
                            <MapPin className="w-3 h-3 mr-1" />
                            {airport.city}, {airport.country}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Airport Details */}
          <div>
            {selectedAirportData ? (
              <AirportDetailsPanel airport={selectedAirportData} />
            ) : (
              <Card>
                <CardContent className="p-6 text-center text-gray-500">
                  <Plane className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Select an airport to view details</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const AirportDetailsPanel = ({ airport }: { airport: any }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Badge className="bg-blue-100 text-blue-800">{airport.icao_code}</Badge>
          {airport.iata_code && (
            <Badge className="bg-green-100 text-green-800">{airport.iata_code}</Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="taxi">Taxi & Extra</TabsTrigger>
            <TabsTrigger value="handling">Handling</TabsTrigger>
            <TabsTrigger value="fuel">Fuel</TabsTrigger>
            <TabsTrigger value="hotels">Hotels</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg">{airport.name}</h3>
              <p className="text-gray-600 flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                {airport.city}, {airport.country}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">ICAO Code</Label>
                <p className="font-mono">{airport.icao_code}</p>
              </div>
              {airport.iata_code && (
                <div>
                  <Label className="text-sm font-medium">IATA Code</Label>
                  <p className="font-mono">{airport.iata_code}</p>
                </div>
              )}
            </div>

            {airport.latitude && airport.longitude && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Latitude</Label>
                  <p>{airport.latitude}°</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Longitude</Label>
                  <p>{airport.longitude}°</p>
                </div>
              </div>
            )}

            {airport.elevation && (
              <div>
                <Label className="text-sm font-medium">Elevation</Label>
                <p>{airport.elevation} ft</p>
              </div>
            )}

            {airport.timezone && (
              <div>
                <Label className="text-sm font-medium">Timezone</Label>
                <p className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {airport.timezone}
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="taxi" className="space-y-4">
            <div className="text-center text-gray-500 py-8">
              <p>Taxi and extra services information</p>
              <p className="text-sm">Contact airport services for details</p>
            </div>
          </TabsContent>

          <TabsContent value="handling" className="space-y-4">
            <div className="text-center text-gray-500 py-8">
              <p>Ground handling services</p>
              <p className="text-sm">FBO and handling agent information</p>
            </div>
          </TabsContent>

          <TabsContent value="fuel" className="space-y-4">
            <div className="text-center text-gray-500 py-8">
              <p>Fuel suppliers and pricing</p>
              <p className="text-sm">Contact for current fuel rates</p>
            </div>
          </TabsContent>

          <TabsContent value="hotels" className="space-y-4">
            <div className="text-center text-gray-500 py-8">
              <p>Nearby accommodation</p>
              <p className="text-sm">Hotel recommendations and crew rest facilities</p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
