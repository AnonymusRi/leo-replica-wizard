
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Phone, Clock, Fuel, Utensils } from "lucide-react";
import { useAirportDirectory } from "@/hooks/useAirportDirectory";

interface AirportDirectoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AirportDirectoryModal = ({ isOpen, onClose }: AirportDirectoryModalProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: airports = [], isLoading } = useAirportDirectory();

  const filteredAirports = airports.filter(airport =>
    airport.airport_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    airport.airport_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Airport Directory
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Cerca aeroporto per codice o nome..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {isLoading ? (
            <div className="text-center py-8">Caricamento...</div>
          ) : (
            <div className="grid gap-4 max-h-96 overflow-y-auto">
              {filteredAirports.map((airport) => (
                <Card key={airport.id}>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{airport.airport_code}</Badge>
                        <span className="text-lg">{airport.airport_name}</span>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {airport.contact_info && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-500" />
                        <span className="text-sm">{airport.contact_info.phone || 'N/A'}</span>
                      </div>
                    )}
                    
                    {airport.opening_hours && (
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="text-sm">
                          Operativo: {airport.opening_hours.general || 'H24'}
                        </span>
                      </div>
                    )}

                    {airport.fuel_suppliers && (
                      <div className="flex items-center gap-2">
                        <Fuel className="w-4 h-4 text-gray-500" />
                        <span className="text-sm">
                          Carburante: {Array.isArray(airport.fuel_suppliers) ? 
                            airport.fuel_suppliers.join(', ') : 'Disponibile'}
                        </span>
                      </div>
                    )}

                    {airport.catering_suppliers && (
                      <div className="flex items-center gap-2">
                        <Utensils className="w-4 h-4 text-gray-500" />
                        <span className="text-sm">
                          Catering: {Array.isArray(airport.catering_suppliers) ? 
                            airport.catering_suppliers.join(', ') : 'Disponibile'}
                        </span>
                      </div>
                    )}

                    {airport.notes && (
                      <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                        {airport.notes}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Chiudi
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
