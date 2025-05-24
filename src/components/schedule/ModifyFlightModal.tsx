
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { X } from "lucide-react";

interface ModifyFlightModalProps {
  isOpen: boolean;
  onClose: () => void;
  flight: any;
}

export const ModifyFlightModal = ({ isOpen, onClose, flight }: ModifyFlightModalProps) => {
  const [activeTab, setActiveTab] = useState("FLIGHT");
  const [modifyData, setModifyData] = useState({
    shift: "01:00",
    blockTime: "No change",
    aircraft: "SP-APR",
    flightNo: "No change",
    arcid: "No change",
    adep: "",
    ades: "",
    altn: "",
    distance: "No change",
    codeShareFlightNo: "No change",
    ferry: "No change"
  });

  const mockFlightData = [
    { id: "TEST03", date: "Sun Aug 20", time: "04:00", from: "STR", to: "AGP", arrival: "06:15", type: "SP-OCT" },
    { id: "TEST04", date: "Sun Aug 20", time: "07:15", from: "AGP", to: "FRA", arrival: "09:30", type: "SP-OCT" },
    { id: "TEST05", date: "Sun Aug 20", time: "11:00", from: "FRA", to: "PMI", arrival: "13:00", type: "SP-OCT" },
    { id: "TEST06", date: "Sun Aug 20", time: "14:00", from: "PMI", to: "STR", arrival: "16:00", type: "SP-OCT" },
  ];

  useEffect(() => {
    if (flight) {
      setModifyData({
        shift: "01:00",
        blockTime: "No change",
        aircraft: flight.aircraft?.tail_number || "SP-APR",
        flightNo: flight.flight_number || "No change",
        arcid: "No change",
        adep: flight.departure_airport || "",
        ades: flight.arrival_airport || "",
        altn: "",
        distance: "No change",
        codeShareFlightNo: "No change",
        ferry: "No change"
      });
    }
  }, [flight]);

  const handleSave = () => {
    console.log("Saving flight modifications:", modifyData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Modify</DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="FLIGHT" className="bg-green-500 text-white data-[state=active]:bg-green-600">
                FLIGHT
              </TabsTrigger>
              <TabsTrigger value="TRIP">TRIP</TabsTrigger>
            </TabsList>

            <TabsContent value="FLIGHT" className="space-y-4">
              <div className="flex space-x-8">
                {/* Left Panel - Modification Form */}
                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Shift</Label>
                      <div className="flex items-center space-x-2">
                        <Input
                          value={modifyData.shift}
                          onChange={(e) => setModifyData(prev => ({ ...prev, shift: e.target.value }))}
                          className="w-20"
                        />
                        <span className="text-sm">h</span>
                      </div>
                    </div>
                    <div>
                      <Label>Block time</Label>
                      <div className="flex items-center space-x-2">
                        <Input
                          value={modifyData.blockTime}
                          onChange={(e) => setModifyData(prev => ({ ...prev, blockTime: e.target.value }))}
                        />
                        <span className="text-sm">h</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Aircraft</Label>
                      <Select 
                        value={modifyData.aircraft} 
                        onValueChange={(value) => setModifyData(prev => ({ ...prev, aircraft: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="SP-APR">SP-APR</SelectItem>
                          <SelectItem value="SP-OCT">SP-OCT</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Flight No.</Label>
                      <Input
                        value={modifyData.flightNo}
                        onChange={(e) => setModifyData(prev => ({ ...prev, flightNo: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div>
                    <Label>ARCID</Label>
                    <Input
                      value={modifyData.arcid}
                      onChange={(e) => setModifyData(prev => ({ ...prev, arcid: e.target.value }))}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>ADEP</Label>
                      <Input
                        value={modifyData.adep}
                        onChange={(e) => setModifyData(prev => ({ ...prev, adep: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label>ADES</Label>
                      <Input
                        value={modifyData.ades}
                        onChange={(e) => setModifyData(prev => ({ ...prev, ades: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>ALTN</Label>
                      <Input
                        value={modifyData.altn}
                        onChange={(e) => setModifyData(prev => ({ ...prev, altn: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label>Distance</Label>
                      <Input
                        value={modifyData.distance}
                        onChange={(e) => setModifyData(prev => ({ ...prev, distance: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Code Share Flight No.</Label>
                    <Input
                      value={modifyData.codeShareFlightNo}
                      onChange={(e) => setModifyData(prev => ({ ...prev, codeShareFlightNo: e.target.value }))}
                    />
                  </div>

                  <div>
                    <Label>Ferry</Label>
                    <Select 
                      value={modifyData.ferry} 
                      onValueChange={(value) => setModifyData(prev => ({ ...prev, ferry: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="No change">No change</SelectItem>
                        <SelectItem value="Yes">Yes</SelectItem>
                        <SelectItem value="No">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Right Panel - Flight List */}
                <div className="flex-1">
                  <div className="border rounded-lg max-h-96 overflow-y-auto">
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
                        {mockFlightData.concat(mockFlightData, mockFlightData).map((flight, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{flight.id}</TableCell>
                            <TableCell>{flight.date}</TableCell>
                            <TableCell>{flight.time}</TableCell>
                            <TableCell>{flight.from}</TableCell>
                            <TableCell>{flight.to}</TableCell>
                            <TableCell>{flight.arrival}</TableCell>
                            <TableCell>{flight.type}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="TRIP">
              <div className="text-center py-8 text-gray-500">
                Trip modification options will be available here
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={onClose}>
              CANCEL
            </Button>
            <Button 
              onClick={handleSave}
              className="bg-blue-600 hover:bg-blue-700"
            >
              SAVE
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
