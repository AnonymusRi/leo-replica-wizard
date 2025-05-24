
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  FileText, 
  Shield, 
  Wrench,
  TrendingUp,
  Calendar
} from "lucide-react";
import { useAircraftTechnicalData } from "@/hooks/useAircraftTechnicalData";
import { useAircraftDocuments, useExpiringDocuments } from "@/hooks/useAircraftDocuments";
import { useAircraftHoldItems } from "@/hooks/useAircraftHoldItems";
import { useOilConsumptionRecords } from "@/hooks/useOilConsumption";
import { useMaintenanceRecords } from "@/hooks/useMaintenanceRecords";
import { format, differenceInDays } from "date-fns";

export const MaintenanceOverview = () => {
  const { data: technicalData = [] } = useAircraftTechnicalData();
  const { data: documents = [] } = useAircraftDocuments();
  const { data: expiringDocuments = [] } = useExpiringDocuments();
  const { data: holdItems = [] } = useAircraftHoldItems();
  const { data: oilRecords = [] } = useOilConsumptionRecords();
  const { data: maintenanceRecords = [] } = useMaintenanceRecords();

  // Calculate statistics
  const activeHoldItems = holdItems.filter(item => item.status === 'active').length;
  const expiredDocuments = documents.filter(doc => doc.status === 'expired').length;
  const expiringSoonDocuments = documents.filter(doc => doc.status === 'expiring_soon').length;
  const overdueMaintenances = maintenanceRecords.filter(m => m.status === 'overdue').length;
  
  // Recent oil consumption (last 30 days)
  const recentOilRecords = oilRecords.filter(record => {
    const recordDate = new Date(record.flight_date);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return recordDate >= thirtyDaysAgo;
  });

  const averageOilConsumption = recentOilRecords.length > 0 
    ? recentOilRecords.reduce((sum, record) => sum + (record.consumption_rate || 0), 0) / recentOilRecords.length
    : 0;

  // Upcoming maintenance
  const upcomingMaintenances = maintenanceRecords
    .filter(m => m.status === 'scheduled')
    .sort((a, b) => new Date(a.scheduled_date).getTime() - new Date(b.scheduled_date).getTime())
    .slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Alert Cards */}
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
              {averageOilConsumption.toFixed(2)}
            </div>
            <p className="text-xs text-gray-500">
              L/hr (last 30 days)
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Fleet Status Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2" />
              Critical Items
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {expiringDocuments.slice(0, 3).map((doc) => (
              <div key={doc.id} className="flex justify-between items-center p-2 bg-orange-50 rounded">
                <div>
                  <div className="font-medium text-sm">{doc.document_name}</div>
                  <div className="text-xs text-gray-500">{doc.aircraft?.tail_number}</div>
                </div>
                <div className="text-right">
                  <Badge variant={doc.status === 'expired' ? 'destructive' : 'secondary'}>
                    {doc.status === 'expired' ? 'Expired' : 'Expiring Soon'}
                  </Badge>
                  {doc.expiry_date && (
                    <div className="text-xs text-gray-500 mt-1">
                      {format(new Date(doc.expiry_date), 'dd/MM/yyyy')}
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {activeHoldItems.slice(0, 2).map((item) => (
              <div key={item.id} className="flex justify-between items-center p-2 bg-yellow-50 rounded">
                <div>
                  <div className="font-medium text-sm">{item.item_reference}</div>
                  <div className="text-xs text-gray-500">{item.aircraft?.tail_number}</div>
                </div>
                <Badge variant="outline" className="bg-yellow-100">
                  {item.status}
                </Badge>
              </div>
            ))}
            
            {expiringDocuments.length === 0 && activeHoldItems.length === 0 && (
              <div className="text-center py-4 text-gray-500">
                <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-500" />
                No critical items found
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Maintenance Schedule */}
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

      {/* Recent Oil Consumption Trend */}
      {recentOilRecords.length > 0 && (
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
      )}
    </div>
  );
};
