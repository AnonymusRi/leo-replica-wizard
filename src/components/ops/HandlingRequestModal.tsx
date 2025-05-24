
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Send, 
  Copy, 
  Mail,
  FileText,
  Clock,
  CheckCircle
} from "lucide-react";
import { useSendHandlingRequest } from "@/hooks/useFlightDocuments";
import { toast } from "sonner";

interface HandlingRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  flight: any;
}

export const HandlingRequestModal = ({ isOpen, onClose, flight }: HandlingRequestModalProps) => {
  const [requestDetails, setRequestDetails] = useState("");
  const [selectedAirport, setSelectedAirport] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [emailContent, setEmailContent] = useState(`
From
Manual (Test User), Reply To/MVT MSG: ops@address.com,
tel: +48 99 88 77 6667,

We kindly request Handling services for the following private flight(s): PAX CHARTER

Schedule
STD          From        To          STA         PAX    Handling         ICAO Type
01 SEP 10:00Z   EPWA     EGGW    01 SEP 12:25Z    5    Warszawski SUPERHANDLER    G
01 SEP 12:00LT                  01 SEP 13:25LT
  `);

  const sendRequest = useSendHandlingRequest();

  if (!flight) return null;

  const handleSendRequest = () => {
    if (!selectedAirport || !serviceType || !requestDetails) {
      toast.error("Compilare tutti i campi obbligatori");
      return;
    }

    sendRequest.mutate({
      flight_id: flight.id,
      airport_code: selectedAirport,
      service_type: serviceType,
      request_details: requestDetails,
      requested_by: "Current User"
    });
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(emailContent);
    toast.success("Contenuto copiato negli appunti");
  };

  // Mock handling data based on the images
  const handlingData = {
    operator: "MAN AIRLINES LTD",
    flightNo: "ABCD",
    aircraftType: "A319 • A319-100",
    registration: "A-BCDE",
    mtow: "130000lbs",
    fireCat: "4",
    maxSeats: "10"
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Handling Requests</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="request" className="w-full">
          <TabsList>
            <TabsTrigger value="request">New Request</TabsTrigger>
            <TabsTrigger value="history">Request History</TabsTrigger>
          </TabsList>

          <TabsContent value="request" className="space-y-4">
            <div className="grid grid-cols-2 gap-6">
              {/* Left panel - Form */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Airport</label>
                  <Select value={selectedAirport} onValueChange={setSelectedAirport}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select airport" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="EPWA">EPWA - Warsaw Chopin</SelectItem>
                      <SelectItem value="EGGW">EGGW - London Luton</SelectItem>
                      <SelectItem value="EDDB">EDDB - Berlin Brandenburg</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Service Type</label>
                  <Select value={serviceType} onValueChange={setServiceType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select service type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ground_handling">Ground Handling</SelectItem>
                      <SelectItem value="catering">Catering</SelectItem>
                      <SelectItem value="fuel">Fuel Services</SelectItem>
                      <SelectItem value="parking">Parking</SelectItem>
                      <SelectItem value="crew_transport">Crew Transport</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Request Details</label>
                  <Textarea
                    placeholder="Describe the handling services required..."
                    value={requestDetails}
                    onChange={(e) => setRequestDetails(e.target.value)}
                    rows={4}
                  />
                </div>

                {/* Flight details table */}
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-3">Flight Details</h4>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Operator</TableHead>
                        <TableHead>Flight no.</TableHead>
                        <TableHead>A/C Type</TableHead>
                        <TableHead>Registration</TableHead>
                        <TableHead>MTOW</TableHead>
                        <TableHead>Fire cat</TableHead>
                        <TableHead>Max Seats</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>{handlingData.operator}</TableCell>
                        <TableCell>{handlingData.flightNo}</TableCell>
                        <TableCell>{handlingData.aircraftType}</TableCell>
                        <TableCell>{handlingData.registration}</TableCell>
                        <TableCell>{handlingData.mtow}</TableCell>
                        <TableCell>{handlingData.fireCat}</TableCell>
                        <TableCell>{handlingData.maxSeats}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>

                {/* Schedule table */}
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-3">Schedule</h4>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>STD</TableHead>
                        <TableHead>From</TableHead>
                        <TableHead>To</TableHead>
                        <TableHead>STA</TableHead>
                        <TableHead>PAX</TableHead>
                        <TableHead>Handling</TableHead>
                        <TableHead>ICAO Type</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>01 SEP 10:00Z<br />01 SEP 12:00LT</TableCell>
                        <TableCell>EPWA</TableCell>
                        <TableCell>EGGW</TableCell>
                        <TableCell>01 SEP 12:25Z<br />01 SEP 13:25LT</TableCell>
                        <TableCell>5</TableCell>
                        <TableCell>Warszawski SUPERHANDLER</TableCell>
                        <TableCell>G</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>

                <div className="flex space-x-2">
                  <Button 
                    onClick={handleSendRequest}
                    disabled={sendRequest.isPending}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    SEND NEW(1)
                  </Button>
                  <Button variant="outline">
                    CLOSE WINDOW
                  </Button>
                </div>
              </div>

              {/* Right panel - Email preview */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Email Preview</h4>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleCopyToClipboard}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    COPY TO CLIPBOARD
                  </Button>
                </div>

                <div className="border rounded-lg p-4 bg-gray-50">
                  <Textarea
                    value={emailContent}
                    onChange={(e) => setEmailContent(e.target.value)}
                    rows={20}
                    className="font-mono text-sm"
                  />
                </div>

                {/* Attachments section */}
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium mb-2">Attachments</h5>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input type="checkbox" className="mr-2" defaultChecked />
                      <FileText className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="text-sm">Attach General Declaration USA</span>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" className="mr-2" defaultChecked />
                      <FileText className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="text-sm">Attach General Declaration</span>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <FileText className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="text-sm">Attach General Declaration</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <div className="text-center text-gray-500 py-8">
              <Mail className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium">No previous requests</h3>
              <p>Le richieste di handling precedenti appariranno qui</p>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
