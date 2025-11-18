
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { format, differenceInDays } from "date-fns";
import { MaintenanceRecord } from "@/types/database";

interface UpcomingMaintenanceCardProps {
  upcomingMaintenances: MaintenanceRecord[];
}

export const UpcomingMaintenanceCard = ({ upcomingMaintenances }: UpcomingMaintenanceCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calendar className="w-5 h-5 mr-2" />
          Upcoming Maintenance Schedule
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {upcomingMaintenances.map((maintenance) => (
            <div key={maintenance.id} className="flex justify-between items-center p-3 border rounded-lg">
              <div className="flex-1">
                <div className="font-medium">{maintenance.maintenance_type}</div>
                <div className="text-sm text-gray-500">{maintenance.description}</div>
                <div className="text-sm text-gray-500">
                  Aircraft: {maintenance.aircraft?.tail_number}
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium">
                  {format(new Date(maintenance.scheduled_date), 'dd/MM/yyyy')}
                </div>
                <div className="text-sm text-gray-500">
                  {differenceInDays(new Date(maintenance.scheduled_date), new Date())} days
                </div>
                {maintenance.cost && (
                  <div className="text-sm font-medium text-green-600">
                    €{maintenance.cost.toLocaleString()}
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {upcomingMaintenances.length === 0 && (
            <div className="text-center py-6 text-gray-500">
              <Calendar className="w-8 h-8 mx-auto mb-2" />
              No upcoming maintenance scheduled
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
