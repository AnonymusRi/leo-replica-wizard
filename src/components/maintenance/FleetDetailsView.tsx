
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Plane, 
  Settings, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Wrench,
  FileText,
  Calendar
} from "lucide-react";

export const FleetDetailsView = () => {
  const [selectedAircraft, setSelectedAircraft] = useState<string | null>(null);

  // Mock fleet data based on the images
  const fleetData = [
    {
      id: "1",
      type: "A319",
      registration: "A-BCDE",
      yom: "2000",
      satPhone: "-",
      selcal: "-",
      defaultFlightNumber: "ABCD",
      mtow: "130000 lbs",
      capacity: 1,
      status: "Active",
      acmi: "NonACMI",
      base: "WAW",
      airframe: {
        tah: "1882:14 (1882.2)",
        tahLimit: "-",
        tac: "865",
        tacLimit: "-",
        dateLimit: "2023-01-27"
      },
      engines: [
        { name: "Engine 1", serialNumber: "12234", startDate: "31-08-2022", tah: "3788:04", tac: "559" },
        { name: "Engine 2", serialNumber: "12235", startDate: "31-08-2022", tah: "1318:52", tac: "659" }
      ],
      apu: {
        serialNumber: "P12967",
        startDate: "06-03-2019",
        tah: "1123:00",
        tac: "244"
      }
    },
    {
      id: "2",
      type: "C56X",
      registration: "A-DSAP",
      yom: "2000",
      mtow: "9163 kg",
      capacity: 8,
      status: "Active",
      acmi: "NonACMI",
      base: "Szczecin"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-green-100 text-green-800";
      case "Maintenance": return "bg-yellow-100 text-yellow-800";
      case "AOG": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Fleet Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Plane className="w-5 h-5 mr-2" />
            Fleet Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {fleetData.map((aircraft) => (
              <Card 
                key={aircraft.id} 
                className={`cursor-pointer transition-all ${
                  selectedAircraft === aircraft.id ? 'ring-2 ring-blue-500' : 'hover:shadow-md'
                }`}
                onClick={() => setSelectedAircraft(aircraft.id)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">{aircraft.registration}</h3>
                      <p className="text-sm text-gray-600">{aircraft.type}</p>
                    </div>
                    <Badge className={getStatusColor(aircraft.status)}>
                      {aircraft.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-600">YOM:</span>
                      <span className="ml-1 font-medium">{aircraft.yom}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">MTOW:</span>
                      <span className="ml-1 font-medium">{aircraft.mtow}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Capacity:</span>
                      <span className="ml-1 font-medium">{aircraft.capacity}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Base:</span>
                      <span className="ml-1 font-medium">{aircraft.base}</span>
                    </div>
                  </div>
                  
                  {aircraft.airframe && (
                    <div className="pt-2 border-t">
                      <div className="text-xs text-gray-600 mb-1">Airframe Hours</div>
                      <div className="text-sm font-mono">
                        TAH: {aircraft.airframe.tah} | TAC: {aircraft.airframe.tac}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Aircraft View */}
      {selectedAircraft && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Aircraft Details - {fleetData.find(a => a.id === selectedAircraft)?.registration}</span>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Edit Details
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {(() => {
              const aircraft = fleetData.find(a => a.id === selectedAircraft);
              if (!aircraft) return null;

              return (
                <div className="space-y-6">
                  {/* Airframe Section */}
                  {aircraft.airframe && (
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center">
                        <Plane className="w-4 h-4 mr-2" />
                        Airframe
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-blue-50 p-3 rounded">
                          <div className="text-sm text-gray-600">Start TAH</div>
                          <div className="font-mono text-lg">1123:00</div>
                        </div>
                        <div className="bg-blue-50 p-3 rounded">
                          <div className="text-sm text-gray-600">Start TAC</div>
                          <div className="font-mono text-lg">244</div>
                        </div>
                        <div className="bg-green-50 p-3 rounded">
                          <div className="text-sm text-gray-600">Current TAH</div>
                          <div className="font-mono text-lg">{aircraft.airframe.tah}</div>
                        </div>
                        <div className="bg-green-50 p-3 rounded">
                          <div className="text-sm text-gray-600">Current TAC</div>
                          <div className="font-mono text-lg">{aircraft.airframe.tac}</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Engines Section */}
                  {aircraft.engines && (
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center">
                        <Wrench className="w-4 h-4 mr-2" />
                        Engines
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {aircraft.engines.map((engine, index) => (
                          <Card key={index}>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-sm">{engine.name}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                              <div className="text-sm">
                                <span className="text-gray-600">S/N:</span>
                                <span className="ml-1 font-mono">{engine.serialNumber}</span>
                              </div>
                              <div className="text-sm">
                                <span className="text-gray-600">Start Date:</span>
                                <span className="ml-1">{engine.startDate}</span>
                              </div>
                              <div className="text-sm">
                                <span className="text-gray-600">TAH:</span>
                                <span className="ml-1 font-mono">{engine.tah}</span>
                              </div>
                              <div className="text-sm">
                                <span className="text-gray-600">TAC:</span>
                                <span className="ml-1 font-mono">{engine.tac}</span>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* APU Section */}
                  {aircraft.apu && (
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center">
                        <Settings className="w-4 h-4 mr-2" />
                        APU
                      </h4>
                      <Card className="max-w-md">
                        <CardContent className="p-4 space-y-2">
                          <div className="text-sm">
                            <span className="text-gray-600">Serial Number:</span>
                            <span className="ml-1 font-mono">{aircraft.apu.serialNumber}</span>
                          </div>
                          <div className="text-sm">
                            <span className="text-gray-600">Start Date:</span>
                            <span className="ml-1">{aircraft.apu.startDate}</span>
                          </div>
                          <div className="text-sm">
                            <span className="text-gray-600">TAH:</span>
                            <span className="ml-1 font-mono">{aircraft.apu.tah}</span>
                          </div>
                          <div className="text-sm">
                            <span className="text-gray-600">TAC:</span>
                            <span className="ml-1 font-mono">{aircraft.apu.tac}</span>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}

                  {/* Maintenance Limits Section */}
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      Maintenance Limits & Warnings
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">Flight Hours Limits</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <Input placeholder="Enter flight hours limit" />
                            <div className="text-xs text-gray-600">
                              Current: 1882:14 hours
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">Flight Cycles Limits</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <Input placeholder="Enter flight cycles limit" />
                            <div className="text-xs text-gray-600">
                              Current: 865 cycles
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              );
            })()}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
