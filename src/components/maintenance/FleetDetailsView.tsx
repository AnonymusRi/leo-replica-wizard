
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { useAircraft } from "@/hooks/useAircraft";
import { useAircraftTechnicalData } from "@/hooks/useAircraftTechnicalData";

export const FleetDetailsView = () => {
  const [selectedAircraft, setSelectedAircraft] = useState<string | null>(null);
  
  const { data: aircraft = [] } = useAircraft();
  const { data: technicalData = [] } = useAircraftTechnicalData();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available": return "bg-green-100 text-green-800";
      case "maintenance": return "bg-yellow-100 text-yellow-800";
      case "aog": return "bg-red-100 text-red-800";
      case "retired": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const formatTAH = (hours: number, minutes: number) => {
    return `${hours}:${minutes.toString().padStart(2, '0')}`;
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
            {aircraft.map((plane) => {
              const techData = technicalData.find(td => td.aircraft_id === plane.id);
              
              return (
                <Card 
                  key={plane.id} 
                  className={`cursor-pointer transition-all ${
                    selectedAircraft === plane.id ? 'ring-2 ring-blue-500' : 'hover:shadow-md'
                  }`}
                  onClick={() => setSelectedAircraft(plane.id)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">{plane.tail_number}</h3>
                        <p className="text-sm text-gray-600">{plane.aircraft_type}</p>
                      </div>
                      <Badge className={getStatusColor(plane.status)}>
                        {plane.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-gray-600">Year:</span>
                        <span className="ml-1 font-medium">{plane.year_manufactured || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">PAX:</span>
                        <span className="ml-1 font-medium">{plane.max_passengers || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Base:</span>
                        <span className="ml-1 font-medium">{plane.home_base || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Model:</span>
                        <span className="ml-1 font-medium">{plane.model}</span>
                      </div>
                    </div>
                    
                    {techData && (
                      <div className="pt-2 border-t">
                        <div className="text-xs text-gray-600 mb-1">Airframe Hours</div>
                        <div className="text-sm font-mono">
                          TAH: {formatTAH(techData.airframe_tah_hours, techData.airframe_tah_minutes)} | TAC: {techData.airframe_tac}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Aircraft View */}
      {selectedAircraft && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Aircraft Details - {aircraft.find(a => a.id === selectedAircraft)?.tail_number}</span>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Edit Details
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {(() => {
              const selectedPlane = aircraft.find(a => a.id === selectedAircraft);
              const techData = technicalData.find(td => td.aircraft_id === selectedAircraft);
              
              if (!selectedPlane) return null;

              return (
                <div className="space-y-6">
                  {/* Basic Information */}
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center">
                      <Plane className="w-4 h-4 mr-2" />
                      Basic Information
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-blue-50 p-3 rounded">
                        <div className="text-sm text-gray-600">Manufacturer</div>
                        <div className="font-medium">{selectedPlane.manufacturer}</div>
                      </div>
                      <div className="bg-blue-50 p-3 rounded">
                        <div className="text-sm text-gray-600">Model</div>
                        <div className="font-medium">{selectedPlane.model}</div>
                      </div>
                      <div className="bg-blue-50 p-3 rounded">
                        <div className="text-sm text-gray-600">Year</div>
                        <div className="font-medium">{selectedPlane.year_manufactured || 'N/A'}</div>
                      </div>
                      <div className="bg-blue-50 p-3 rounded">
                        <div className="text-sm text-gray-600">Status</div>
                        <Badge className={getStatusColor(selectedPlane.status)}>
                          {selectedPlane.status}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Airframe Section */}
                  {techData && (
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center">
                        <Plane className="w-4 h-4 mr-2" />
                        Airframe
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-green-50 p-3 rounded">
                          <div className="text-sm text-gray-600">Current TAH</div>
                          <div className="font-mono text-lg">{formatTAH(techData.airframe_tah_hours, techData.airframe_tah_minutes)}</div>
                        </div>
                        <div className="bg-green-50 p-3 rounded">
                          <div className="text-sm text-gray-600">Current TAC</div>
                          <div className="font-mono text-lg">{techData.airframe_tac}</div>
                        </div>
                        <div className="bg-blue-50 p-3 rounded">
                          <div className="text-sm text-gray-600">Last Updated</div>
                          <div className="text-sm">{new Date(techData.last_updated).toLocaleDateString()}</div>
                        </div>
                        <div className="bg-blue-50 p-3 rounded">
                          <div className="text-sm text-gray-600">Updated By</div>
                          <div className="text-sm">{techData.updated_by || 'System'}</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Engines Section */}
                  {techData && (
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center">
                        <Wrench className="w-4 h-4 mr-2" />
                        Engines
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Engine 1 */}
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm">Engine 1</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-2">
                            <div className="text-sm">
                              <span className="text-gray-600">S/N:</span>
                              <span className="ml-1 font-mono">{techData.engine_1_serial_number || 'N/A'}</span>
                            </div>
                            <div className="text-sm">
                              <span className="text-gray-600">Start Date:</span>
                              <span className="ml-1">{techData.engine_1_start_date ? new Date(techData.engine_1_start_date).toLocaleDateString() : 'N/A'}</span>
                            </div>
                            <div className="text-sm">
                              <span className="text-gray-600">TAH:</span>
                              <span className="ml-1 font-mono">{formatTAH(techData.engine_1_tah_hours, techData.engine_1_tah_minutes)}</span>
                            </div>
                            <div className="text-sm">
                              <span className="text-gray-600">TAC:</span>
                              <span className="ml-1 font-mono">{techData.engine_1_tac}</span>
                            </div>
                          </CardContent>
                        </Card>

                        {/* Engine 2 */}
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm">Engine 2</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-2">
                            <div className="text-sm">
                              <span className="text-gray-600">S/N:</span>
                              <span className="ml-1 font-mono">{techData.engine_2_serial_number || 'N/A'}</span>
                            </div>
                            <div className="text-sm">
                              <span className="text-gray-600">Start Date:</span>
                              <span className="ml-1">{techData.engine_2_start_date ? new Date(techData.engine_2_start_date).toLocaleDateString() : 'N/A'}</span>
                            </div>
                            <div className="text-sm">
                              <span className="text-gray-600">TAH:</span>
                              <span className="ml-1 font-mono">{formatTAH(techData.engine_2_tah_hours, techData.engine_2_tah_minutes)}</span>
                            </div>
                            <div className="text-sm">
                              <span className="text-gray-600">TAC:</span>
                              <span className="ml-1 font-mono">{techData.engine_2_tac}</span>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  )}

                  {/* APU Section */}
                  {techData && techData.apu_serial_number && (
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center">
                        <Settings className="w-4 h-4 mr-2" />
                        APU
                      </h4>
                      <Card className="max-w-md">
                        <CardContent className="p-4 space-y-2">
                          <div className="text-sm">
                            <span className="text-gray-600">Serial Number:</span>
                            <span className="ml-1 font-mono">{techData.apu_serial_number}</span>
                          </div>
                          <div className="text-sm">
                            <span className="text-gray-600">Start Date:</span>
                            <span className="ml-1">{techData.apu_start_date ? new Date(techData.apu_start_date).toLocaleDateString() : 'N/A'}</span>
                          </div>
                          <div className="text-sm">
                            <span className="text-gray-600">TAH:</span>
                            <span className="ml-1 font-mono">{formatTAH(techData.apu_tah_hours, techData.apu_tah_minutes)}</span>
                          </div>
                          <div className="text-sm">
                            <span className="text-gray-600">TAC:</span>
                            <span className="ml-1 font-mono">{techData.apu_tac}</span>
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
                              Current: {techData ? formatTAH(techData.airframe_tah_hours, techData.airframe_tah_minutes) : 'N/A'} hours
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
                              Current: {techData?.airframe_tac || 'N/A'} cycles
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
