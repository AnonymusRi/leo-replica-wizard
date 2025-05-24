
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { format } from "date-fns";

interface PublishModalProps {
  isOpen: boolean;
  onClose: () => void;
  flights: any[];
}

export const PublishModal = ({ isOpen, onClose, flights }: PublishModalProps) => {
  const [client, setClient] = useState("Based on version");
  const [tripType, setTripType] = useState("PAX Charter");
  const [option, setOption] = useState("No");
  const [commercial, setCommercial] = useState("Yes");

  const mockFlights = [
    { id: "TEST03", date: "Sun Aug 20", time: "04:00", departure: "EDDS", arrival: "LEMG", arrival_time: "06:15", type: "SP-OCT" },
    { id: "TEST04", date: "Sun Aug 20", time: "07:15", departure: "LEMG", arrival: "EDDF", arrival_time: "09:30", type: "SP-OCT" },
    { id: "TEST05", date: "Sun Aug 20", time: "11:00", departure: "EDDF", arrival: "LEPA", arrival_time: "13:00", type: "SP-OCT" },
    { id: "TEST06", date: "Sun Aug 20", time: "14:00", departure: "LEPA", arrival: "EDDS", arrival_time: "16:00", type: "SP-OCT" },
  ];

  const handlePublish = () => {
    console.log("Publishing flights with settings:", { client, tripType, option, commercial });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Publish</DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <div className="text-sm">
            You are about to publish <strong>96 flights</strong> from <strong>20 Aug</strong> to <strong>12 Sept</strong>.
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div>
              <Label htmlFor="client">Client</Label>
              <Select value={client} onValueChange={setClient}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Based on version">Based on version</SelectItem>
                  <SelectItem value="Charter Broker">Charter Broker</SelectItem>
                  <SelectItem value="Direct Client">Direct Client</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="trip_type">Trip type</Label>
              <Select value={tripType} onValueChange={setTripType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PAX Charter">PAX Charter</SelectItem>
                  <SelectItem value="Cargo Charter">Cargo Charter</SelectItem>
                  <SelectItem value="Ferry Flight">Ferry Flight</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="option">Option</Label>
              <Select value={option} onValueChange={setOption}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="No">No</SelectItem>
                  <SelectItem value="Yes">Yes</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="commercial">Commercial</Label>
              <Select value={commercial} onValueChange={setCommercial}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Yes">Yes</SelectItem>
                  <SelectItem value="No">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto border rounded">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Flight ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>STD</TableHead>
                  <TableHead>From</TableHead>
                  <TableHead>To</TableHead>
                  <TableHead>STA</TableHead>
                  <TableHead>Aircraft</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockFlights.concat(mockFlights, mockFlights, mockFlights, mockFlights).map((flight, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{flight.id}</TableCell>
                    <TableCell>{flight.date}</TableCell>
                    <TableCell>{flight.time}</TableCell>
                    <TableCell>{flight.departure}</TableCell>
                    <TableCell>{flight.arrival}</TableCell>
                    <TableCell>{flight.arrival_time}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{flight.type}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={onClose}>
              CANCEL
            </Button>
            <Button 
              onClick={handlePublish}
              className="bg-blue-600 hover:bg-blue-700"
            >
              PUBLISH
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
