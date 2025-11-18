
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Plane, MapPin, Users, Loader2 } from "lucide-react";
import { useAircraft } from "@/hooks/useAircraft";
import { useClients } from "@/hooks/useClients";
import { useCreateFlight } from "@/hooks/useFlights";
import { toast } from "sonner";

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ScheduleModal = ({ isOpen, onClose }: ScheduleModalProps) => {
  const [formData, setFormData] = useState({
    flight_number: "",
    aircraft_id: "",
    client_id: "",
    departure_airport: "",
    arrival_airport: "",
    departure_date: "",
    departure_time: "",
    arrival_time: "",
    passenger_count: 0,
    status: "scheduled" as const
  });

  const { data: aircraft = [], isLoading: aircraftLoading } = useAircraft();
  const { data: clients = [], isLoading: clientsLoading } = useClients();
  const createFlightMutation = useCreateFlight();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.flight_number || !formData.departure_airport || !formData.arrival_airport) {
      toast.error("Compila tutti i campi obbligatori");
      return;
    }

    try {
      const departureDateTime = new Date(`${formData.departure_date}T${formData.departure_time}`);
      const arrivalDateTime = new Date(`${formData.departure_date}T${formData.arrival_time}`);

      await createFlightMutation.mutateAsync({
        flight_number: formData.flight_number,
        aircraft_id: formData.aircraft_id || null,
        client_id: formData.client_id || null,
        departure_airport: formData.departure_airport,
        arrival_airport: formData.arrival_airport,
        departure_time: departureDateTime.toISOString(),
        arrival_time: arrivalDateTime.toISOString(),
        passenger_count: formData.passenger_count,
        status: formData.status
      });

      toast.success("Volo creato con successo!");
      onClose();
      
      // Reset form
      setFormData({
        flight_number: "",
        aircraft_id: "",
        client_id: "",
        departure_airport: "",
        arrival_airport: "",
        departure_date: "",
        departure_time: "",
        arrival_time: "",
        passenger_count: 0,
        status: "scheduled"
      });
    } catch (error) {
      console.error("Error creating flight:", error);
      toast.error("Errore nella creazione del volo");
    }
  };

  const selectedAircraft = aircraft.find(a => a.id === formData.aircraft_id);
  const selectedClient = clients.find(c => c.id === formData.client_id);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Create New Flight Schedule
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="flight_number">Flight Number *</Label>
              <Input
                id="flight_number"
                placeholder="FL001"
                value={formData.flight_number}
                onChange={(e) => setFormData(prev => ({ ...prev, flight_number: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="status">Flight Status</Label>
              <Select 
                value={formData.status}
                onValueChange={(value: any) => setFormData(prev => ({ ...prev, status: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="delayed">Delayed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="aircraft">Aircraft</Label>
            <Select 
              value={formData.aircraft_id}
              onValueChange={(value) => setFormData(prev => ({ ...prev, aircraft_id: value }))}
              disabled={aircraftLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder={aircraftLoading ? "Loading..." : "Select aircraft"} />
              </SelectTrigger>
              <SelectContent>
                {aircraft.map((ac) => (
                  <SelectItem key={ac.id} value={ac.id}>
                    <div className="flex items-center">
                      <Plane className="w-4 h-4 mr-2" />
                      {ac.tail_number} - {ac.aircraft_type}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="client">Client</Label>
            <Select 
              value={formData.client_id}
              onValueChange={(value) => setFormData(prev => ({ ...prev, client_id: value }))}
              disabled={clientsLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder={clientsLoading ? "Loading..." : "Select client"} />
              </SelectTrigger>
              <SelectContent>
                {clients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.company_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="departure_airport">Departure Airport *</Label>
              <Input
                id="departure_airport"
                placeholder="EGLL"
                value={formData.departure_airport}
                onChange={(e) => setFormData(prev => ({ ...prev, departure_airport: e.target.value.toUpperCase() }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="arrival_airport">Arrival Airport *</Label>
              <Input
                id="arrival_airport"
                placeholder="KJFK"
                value={formData.arrival_airport}
                onChange={(e) => setFormData(prev => ({ ...prev, arrival_airport: e.target.value.toUpperCase() }))}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="departure_date">Departure Date *</Label>
              <Input
                id="departure_date"
                type="date"
                value={formData.departure_date}
                onChange={(e) => setFormData(prev => ({ ...prev, departure_date: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="departure_time">Departure Time</Label>
              <Input
                id="departure_time"
                type="time"
                value={formData.departure_time}
                onChange={(e) => setFormData(prev => ({ ...prev, departure_time: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="arrival_time">Arrival Time</Label>
              <Input
                id="arrival_time"
                type="time"
                value={formData.arrival_time}
                onChange={(e) => setFormData(prev => ({ ...prev, arrival_time: e.target.value }))}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="passenger_count">Number of Passengers</Label>
            <Input
              id="passenger_count"
              type="number"
              placeholder="8"
              value={formData.passenger_count}
              onChange={(e) => setFormData(prev => ({ ...prev, passenger_count: parseInt(e.target.value) || 0 }))}
            />
          </div>

          <div className="border-t pt-4">
            <h3 className="font-medium mb-3 flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              Flight Summary
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                  <span className="font-medium">Route:</span>
                  <span className="ml-2">{formData.departure_airport || "---"} → {formData.arrival_airport || "---"}</span>
                </div>
                <div className="flex items-center">
                  <Plane className="w-4 h-4 mr-2 text-gray-400" />
                  <span className="font-medium">Aircraft:</span>
                  <span className="ml-2">{selectedAircraft?.tail_number || "Not selected"}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-2 text-gray-400" />
                  <span className="font-medium">Passengers:</span>
                  <span className="ml-2">{formData.passenger_count}</span>
                </div>
                <div className="flex items-center">
                  <span className="font-medium">Client:</span>
                  <span className="ml-2">{selectedClient?.company_name || "Not selected"}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-blue-600 hover:bg-blue-700"
              disabled={createFlightMutation.isPending}
            >
              {createFlightMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Schedule"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
