
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, FileText, Shield, TrendingUp } from "lucide-react";

interface MetricsCardsProps {
  overdueMaintenances: number;
  expiredDocuments: number;
  expiringSoonDocuments: number;
  activeHoldItems: number;
  averageOilConsumption: number;
}

export const MetricsCards = ({
  overdueMaintenances,
  expiredDocuments,
  expiringSoonDocuments,
  activeHoldItems,
  averageOilConsumption
}: MetricsCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card className={`border-l-4 ${overdueMaintenances > 0 ? 'border-l-red-500' : 'border-l-green-500'}`}>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center">
            <Clock className="w-4 h-4 mr-2" />
            Overdue Maintenances
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${overdueMaintenances > 0 ? 'text-red-600' : 'text-green-600'}`}>
            {overdueMaintenances}
          </div>
          <p className="text-xs text-gray-500">
            {overdueMaintenances === 0 ? 'All up to date' : 'Require immediate attention'}
          </p>
        </CardContent>
      </Card>

      <Card className={`border-l-4 ${expiredDocuments > 0 ? 'border-l-red-500' : 'border-l-green-500'}`}>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center">
            <FileText className="w-4 h-4 mr-2" />
            Expired Documents
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${expiredDocuments > 0 ? 'text-red-600' : 'text-green-600'}`}>
            {expiredDocuments}
          </div>
          <p className="text-xs text-gray-500">
            {expiringSoonDocuments} expiring soon
          </p>
        </CardContent>
      </Card>

      <Card className={`border-l-4 ${activeHoldItems > 0 ? 'border-l-orange-500' : 'border-l-green-500'}`}>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center">
            <Shield className="w-4 h-4 mr-2" />
            Active Hold Items
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${activeHoldItems > 0 ? 'text-orange-600' : 'text-green-600'}`}>
            {activeHoldItems}
          </div>
          <p className="text-xs text-gray-500">
            Aircraft limitations
          </p>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-blue-500">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center">
            <TrendingUp className="w-4 h-4 mr-2" />
            Avg Oil Consumption
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">
            {(Number(averageOilConsumption) || 0).toFixed(2)}
          </div>
          <p className="text-xs text-gray-500">
            L/hr (last 30 days)
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
