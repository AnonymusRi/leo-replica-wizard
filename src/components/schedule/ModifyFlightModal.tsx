
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { X, Loader2 } from "lucide-react";
import { useUpdateFlight } from "@/hooks/useFlights";
import { useCreateScheduleChange } from "@/hooks/useScheduleChanges";
import { useAircraft } from "@/hooks/useAircraft";
import { toast } from "sonner";
import { format } from "date-fns";

interface ModifyFlightModalProps {
  isOpen: boolean;
  onClose: () => void;
  flight: any;
}

export const ModifyFlightModal = ({ isOpen, onClose, flight }: ModifyFlightModalProps) => {
  const [activeTab, setActiveTab] = useState("FLIGHT");
  const [modifyData, setModifyData] = useState({
    aircraft_id: "",
    flight_number: "",
    departure_airport: "",
    arrival_airport: "",
    departure_time: "",
    arrival_time: "",
    passenger_count: 0,
    notes: "",
    status: "scheduled" as const
  });
  const [changeReason, setChangeReason] = useState("");

  const { data: aircraft = [] } = useAircraft();
  const updateFlight = useUpdateFlight();
  const createScheduleChange = useCreateScheduleChange();

  useEffect(() => {
    if (flight) {
      setModifyData({
        aircraft_id: flight.aircraft_id || "",
        flight_number: flight.flight_number || "",
        departure_airport: flight.departure_airport || "",
        arrival_airport: flight.arrival_airport || "",
        departure_time: flight.departure_time ? format(new Date(flight.departure_time), "yyyy-MM-dd'T'HH:mm") : "",
        arrival_time: flight.arrival_time ? format(new Date(flight.arrival_time), "yyyy-MM-dd'T'HH:mm") : "",
        passenger_count: flight.passenger_count || 0,
        notes: flight.notes || "",
        status: flight.status || "scheduled"
      });
    }
  }, [flight]);

  const handleSave = async () => {
    if (!flight || !changeReason.trim()) {
      toast.error("Please provide a reason for the change");
      return;
    }

    try {
      // Record the change first
      await createScheduleChange.mutateAsync({
        flight_id: flight.id,
        change_type: "modification",
        old_value: {
          aircraft_id: flight.aircraft_id,
          flight_number: flight.flight_number,
          departure_airport: flight.departure_airport,
          arrival_airport: flight.arrival_airport,
          departure_time: flight.departure_time,
          arrival_time: flight.arrival_time,
          passenger_count: flight.passenger_count,
          status: flight.status
        },
        new_value: {
          ...modifyData,
          departure_time: new Date(modifyData.departure_time).toISOString(),
          arrival_time: new Date(modifyData.arrival_time).toISOString()
        },
        reason: changeReason,
        changed_by: "Current User" // In a real app, this would be the authenticated user
      });

      // Then update the flight
      await updateFlight.mutateAsync({
        id: flight.id,
        ...modifyData,
        departure_time: new Date(modifyData.departure_time).toISOString(),
        arrival_time: new Date(modifyData.arrival_time).toISOString()
      });

      toast.success("Flight modified successfully");
      onClose();
    } catch (error) {
      console.error("Error modifying flight:", error);
      toast.error("Failed to modify flight");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Modify Flight {flight?.flight_number}</DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-4 overflow-y-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="FLIGHT" className="bg-green-500 text-white data-[state=active]:bg-green-600">
                FLIGHT
              </TabsTrigger>
              <TabsTrigger value="HISTORY">CHANGE HISTORY</TabsTrigger>
            </TabsList>

            <TabsContent value="FLIGHT" className="space-y-4">
              <div className="grid grid-cols-2 gap-6">
                {/* Left Panel - Modification Form */}
                <div className="space-y-4">
                  <div>
                    <Label>Flight Number</Label>
                    <Input
                      value={modifyData.flight_number}
                      onChange={(e) => setModifyData(prev => ({ ...prev, flight_number: e.target.value }))}
                    />
                  </div>

                  <div>
                    <Label>Aircraft</Label>
                    <Select 
                      value={modifyData.aircraft_id} 
                      onValueChange={(value) => setModifyData(prev => ({ ...prev, aircraft_id: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select aircraft" />
                      </SelectTrigger>
                      <SelectContent>
                        {aircraft.map((ac) => (
                          <SelectItem key={ac.id} value={ac.id}>
                            {ac.tail_number} - {ac.aircraft_type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Departure Airport</Label>
                      <Input
                        value={modifyData.departure_airport}
                        onChange={(e) => setModifyData(prev => ({ ...prev, departure_airport: e.target.value.toUpperCase() }))}
                      />
                    </div>
                    <div>
                      <Label>Arrival Airport</Label>
                      <Input
                        value={modifyData.arrival_airport}
                        onChange={(e) => setModifyData(prev => ({ ...prev, arrival_airport: e.target.value.toUpperCase() }))}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Departure Time</Label>
                      <Input
                        type="datetime-local"
                        value={modifyData.departure_time}
                        onChange={(e) => setModifyData(prev => ({ ...prev, departure_time: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label>Arrival Time</Label>
                      <Input
                        type="datetime-local"
                        value={modifyData.arrival_time}
                        onChange={(e) => setModifyData(prev => ({ ...prev, arrival_time: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Passenger Count</Label>
                    <Input
                      type="number"
                      value={modifyData.passenger_count}
                      onChange={(e) => setModifyData(prev => ({ ...prev, passenger_count: parseInt(e.target.value) || 0 }))}
                    />
                  </div>

                  <div>
                    <Label>Status</Label>
                    <Select 
                      value={modifyData.status} 
                      onValueChange={(value: any) => setModifyData(prev => ({ ...prev, status: value }))}
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

                  <div>
                    <Label>Reason for Change *</Label>
                    <Input
                      value={changeReason}
                      onChange={(e) => setChangeReason(e.target.value)}
                      placeholder="Enter reason for modification..."
                      required
                    />
                  </div>

                  <div>
                    <Label>Notes</Label>
                    <Input
                      value={modifyData.notes}
                      onChange={(e) => setModifyData(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="Additional notes..."
                    />
                  </div>
                </div>

                {/* Right Panel - Flight Summary */}
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium mb-3">Current Flight Details</h3>
                    {flight && (
                      <div className="space-y-2 text-sm">
                        <div><strong>Flight:</strong> {flight.flight_number}</div>
                        <div><strong>Aircraft:</strong> {flight.aircraft?.tail_number || 'TBD'}</div>
                        <div><strong>Route:</strong> {flight.departure_airport} → {flight.arrival_airport}</div>
                        <div><strong>Departure:</strong> {format(new Date(flight.departure_time), 'dd/MM/yyyy HH:mm')}</div>
                        <div><strong>Arrival:</strong> {format(new Date(flight.arrival_time), 'dd/MM/yyyy HH:mm')}</div>
                        <div><strong>Passengers:</strong> {flight.passenger_count}</div>
                        <div><strong>Status:</strong> {flight.status}</div>
                      </div>
                    )}
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-medium mb-3">Proposed Changes</h3>
                    <div className="space-y-2 text-sm">
                      <div><strong>Flight:</strong> {modifyData.flight_number}</div>
                      <div><strong>Aircraft:</strong> {aircraft.find(a => a.id === modifyData.aircraft_id)?.tail_number || 'TBD'}</div>
                      <div><strong>Route:</strong> {modifyData.departure_airport} → {modifyData.arrival_airport}</div>
                      {modifyData.departure_time && (
                        <div><strong>Departure:</strong> {format(new Date(modifyData.departure_time), 'dd/MM/yyyy HH:mm')}</div>
                      )}
                      {modifyData.arrival_time && (
                        <div><strong>Arrival:</strong> {format(new Date(modifyData.arrival_time), 'dd/MM/yyyy HH:mm')}</div>
                      )}
                      <div><strong>Passengers:</strong> {modifyData.passenger_count}</div>
                      <div><strong>Status:</strong> {modifyData.status}</div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="HISTORY">
              <div className="text-center py-8 text-gray-500">
                Change history will be displayed here once implemented
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              CANCEL
            </Button>
            <Button 
              onClick={handleSave}
              className="bg-blue-600 hover:bg-blue-700"
              disabled={updateFlight.isPending || createScheduleChange.isPending || !changeReason.trim()}
            >
              {updateFlight.isPending || createScheduleChange.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "SAVE CHANGES"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
