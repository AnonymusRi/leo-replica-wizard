
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, CalendarIcon, Clock, MapPin, Plane, Plus, X } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface QuoteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface Aircraft {
  id: string;
  model: string;
  capacity: number;
  range: string;
  hourlyRate: number;
}

export const QuoteModal = ({ open, onOpenChange }: QuoteModalProps) => {
  const [selectedAircraft, setSelectedAircraft] = useState<Aircraft[]>([]);
  const [departureDate, setDepartureDate] = useState<Date>();
  const [returnDate, setReturnDate] = useState<Date>();

  const availableAircraft: Aircraft[] = [
    { id: "1", model: "Citation CJ3+", capacity: 8, range: "2,040 nm", hourlyRate: 3500 },
    { id: "2", model: "Falcon 7X", capacity: 14, range: "5,950 nm", hourlyRate: 8500 },
    { id: "3", model: "Gulfstream G650", capacity: 16, range: "7,000 nm", hourlyRate: 12000 },
    { id: "4", model: "Citation X", capacity: 12, range: "3,460 nm", hourlyRate: 6500 },
    { id: "5", model: "King Air 350", capacity: 11, range: "1,806 nm", hourlyRate: 2800 }
  ];

  const addAircraft = (aircraft: Aircraft) => {
    if (!selectedAircraft.find(a => a.id === aircraft.id)) {
      setSelectedAircraft([...selectedAircraft, aircraft]);
    }
  };

  const removeAircraft = (aircraftId: string) => {
    setSelectedAircraft(selectedAircraft.filter(a => a.id !== aircraftId));
  };

  const calculateEstimate = (aircraft: Aircraft) => {
    // Calcolo semplificato per 2 ore di volo
    return aircraft.hourlyRate * 2;
  };

  const handleSubmit = () => {
    // Qui implementeresti la logica per salvare la quotazione
    console.log("Creating quote with:", { selectedAircraft, departureDate, returnDate });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Plane className="w-5 h-5 mr-2 text-blue-600" />
            Create New Quote
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Flight Details */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="client">Client Name</Label>
              <Input id="client" placeholder="Enter client name" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="departure">Departure Airport</Label>
                <Input id="departure" placeholder="EGLL" />
              </div>
              <div>
                <Label htmlFor="arrival">Arrival Airport</Label>
                <Input id="arrival" placeholder="KJFK" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Departure Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !departureDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {departureDate ? format(departureDate, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={departureDate}
                      onSelect={setDepartureDate}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <Label>Return Date (Optional)</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !returnDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {returnDate ? format(returnDate, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={returnDate}
                      onSelect={setReturnDate}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="passengers">Passengers</Label>
                <Input id="passengers" type="number" placeholder="8" />
              </div>
              <div>
                <Label htmlFor="priority">Priority</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="notes">Special Requirements</Label>
              <Textarea id="notes" placeholder="Any special requirements or notes..." className="h-24" />
            </div>
          </div>

          {/* Aircraft Selection */}
          <div className="space-y-4">
            <div>
              <Label>Available Aircraft</Label>
              <div className="max-h-48 overflow-y-auto border rounded-md p-2 space-y-2">
                {availableAircraft.map((aircraft) => (
                  <div
                    key={aircraft.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-md hover:bg-gray-100 cursor-pointer"
                    onClick={() => addAircraft(aircraft)}
                  >
                    <div>
                      <div className="font-medium">{aircraft.model}</div>
                      <div className="text-sm text-gray-500">
                        {aircraft.capacity} pax • {aircraft.range} • ${aircraft.hourlyRate}/hr
                      </div>
                    </div>
                    <Plus className="w-4 h-4 text-green-600" />
                  </div>
                ))}
              </div>
            </div>

            {/* Selected Aircraft */}
            {selectedAircraft.length > 0 && (
              <div>
                <Label>Selected Aircraft for Quote</Label>
                <div className="space-y-2">
                  {selectedAircraft.map((aircraft) => (
                    <Card key={aircraft.id}>
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium flex items-center">
                              <Plane className="w-4 h-4 mr-2 text-blue-600" />
                              {aircraft.model}
                            </div>
                            <div className="text-sm text-gray-500">
                              {aircraft.capacity} passengers • {aircraft.range}
                            </div>
                            <div className="text-sm font-medium text-green-600">
                              Estimated: ${calculateEstimate(aircraft).toLocaleString()}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeAircraft(aircraft.id)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700">
            Create Quote
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
