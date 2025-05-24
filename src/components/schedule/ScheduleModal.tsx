
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Plane, MapPin, Users } from "lucide-react";

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ScheduleModal = ({ isOpen, onClose }: ScheduleModalProps) => {
  const [formData, setFormData] = useState({
    flightId: "",
    aircraft: "",
    departure: "",
    arrival: "",
    departureDate: "",
    departureTime: "",
    arrivalTime: "",
    passengers: "",
    crew: [] as string[],
    flightType: "charter"
  });

  const aircraftOptions = [
    "N123AB - Citation X",
    "N456CD - Gulfstream G650",
    "N789EF - Bombardier Global 7500"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Schedule created:", formData);
    onClose();
  };

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
              <Label htmlFor="flightId">Flight ID</Label>
              <Input
                id="flightId"
                placeholder="FL001"
                value={formData.flightId}
                onChange={(e) => setFormData(prev => ({ ...prev, flightId: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="flightType">Flight Type</Label>
              <Select 
                value={formData.flightType}
                onValueChange={(value) => setFormData(prev => ({ ...prev, flightType: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="charter">Charter</SelectItem>
                  <SelectItem value="positioning">Positioning</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="training">Training</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="aircraft">Aircraft</Label>
            <Select 
              value={formData.aircraft}
              onValueChange={(value) => setFormData(prev => ({ ...prev, aircraft: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select aircraft" />
              </SelectTrigger>
              <SelectContent>
                {aircraftOptions.map((aircraft) => (
                  <SelectItem key={aircraft} value={aircraft}>
                    <div className="flex items-center">
                      <Plane className="w-4 h-4 mr-2" />
                      {aircraft}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="departure">Departure Airport</Label>
              <Input
                id="departure"
                placeholder="KJFK"
                value={formData.departure}
                onChange={(e) => setFormData(prev => ({ ...prev, departure: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="arrival">Arrival Airport</Label>
              <Input
                id="arrival"
                placeholder="KLAX"
                value={formData.arrival}
                onChange={(e) => setFormData(prev => ({ ...prev, arrival: e.target.value }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="departureDate">Departure Date</Label>
              <Input
                id="departureDate"
                type="date"
                value={formData.departureDate}
                onChange={(e) => setFormData(prev => ({ ...prev, departureDate: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="departureTime">Departure Time</Label>
              <Input
                id="departureTime"
                type="time"
                value={formData.departureTime}
                onChange={(e) => setFormData(prev => ({ ...prev, departureTime: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="arrivalTime">Arrival Time</Label>
              <Input
                id="arrivalTime"
                type="time"
                value={formData.arrivalTime}
                onChange={(e) => setFormData(prev => ({ ...prev, arrivalTime: e.target.value }))}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="passengers">Number of Passengers</Label>
            <Input
              id="passengers"
              type="number"
              placeholder="8"
              value={formData.passengers}
              onChange={(e) => setFormData(prev => ({ ...prev, passengers: e.target.value }))}
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
                  <span className="ml-2">{formData.departure || "---"} → {formData.arrival || "---"}</span>
                </div>
                <div className="flex items-center">
                  <Plane className="w-4 h-4 mr-2 text-gray-400" />
                  <span className="font-medium">Aircraft:</span>
                  <span className="ml-2">{formData.aircraft || "Not selected"}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-2 text-gray-400" />
                  <span className="font-medium">Passengers:</span>
                  <span className="ml-2">{formData.passengers || "0"}</span>
                </div>
                <div className="flex items-center">
                  <Badge variant="outline" className="ml-6">
                    {formData.flightType}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Create Schedule
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
