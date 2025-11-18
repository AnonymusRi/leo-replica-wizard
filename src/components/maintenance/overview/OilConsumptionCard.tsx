
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import { OilConsumptionRecord } from "@/types/aircraft";

interface OilConsumptionCardProps {
  recentOilRecords: OilConsumptionRecord[];
}

export const OilConsumptionCard = ({ recentOilRecords }: OilConsumptionCardProps) => {
  if (recentOilRecords.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <TrendingUp className="w-5 h-5 mr-2" />
          Recent Oil Consumption (Last 30 Days)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {['Engine 1', 'Engine 2', 'APU'].map((engine) => {
            const engineRecords = recentOilRecords.filter(r => r.engine_position === engine);
            const avgConsumption = engineRecords.length > 0 
              ? engineRecords.reduce((sum, r) => sum + (r.consumption_rate || 0), 0) / engineRecords.length
              : 0;
            
            return (
              <div key={engine} className="text-center p-4 border rounded-lg">
                <div className="font-medium text-lg">{engine}</div>
                <div className="text-2xl font-bold text-blue-600">
                  {avgConsumption.toFixed(2)}
                </div>
                <div className="text-sm text-gray-500">L/hr average</div>
                <div className="text-xs text-gray-400">
                  {engineRecords.length} records
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
