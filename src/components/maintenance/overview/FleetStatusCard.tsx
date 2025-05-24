
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wrench } from "lucide-react";
import { AircraftTechnicalData } from "@/types/aircraft";

interface FleetStatusCardProps {
  technicalData: AircraftTechnicalData[];
}

export const FleetStatusCard = ({ technicalData }: FleetStatusCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Wrench className="w-5 h-5 mr-2" />
          Fleet Technical Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {technicalData.slice(0, 3).map((aircraft) => (
          <div key={aircraft.id} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-medium">{aircraft.aircraft?.tail_number}</span>
              <Badge variant="outline">{aircraft.aircraft?.status}</Badge>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Airframe TAH:</span>
                <span className="ml-2 font-medium">
                  {aircraft.airframe_tah_hours}:{aircraft.airframe_tah_minutes.toString().padStart(2, '0')}
                </span>
              </div>
              <div>
                <span className="text-gray-500">TAC:</span>
                <span className="ml-2 font-medium">{aircraft.airframe_tac}</span>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
