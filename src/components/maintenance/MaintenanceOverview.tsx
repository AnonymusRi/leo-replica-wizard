
import { useAircraftTechnicalData } from "@/hooks/useAircraftTechnicalData";
import { useAircraftDocuments, useExpiringDocuments } from "@/hooks/useAircraftDocuments";
import { useAircraftHoldItems } from "@/hooks/useAircraftHoldItems";
import { useOilConsumptionRecords } from "@/hooks/useOilConsumption";
import { useMaintenanceRecords } from "@/hooks/useMaintenanceRecords";
import { MetricsCards } from "./overview/MetricsCards";
import { FleetStatusCard } from "./overview/FleetStatusCard";
import { CriticalItemsCard } from "./overview/CriticalItemsCard";
import { UpcomingMaintenanceCard } from "./overview/UpcomingMaintenanceCard";
import { OilConsumptionCard } from "./overview/OilConsumptionCard";

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
  
  // Filter maintenance records properly
  const overdueMaintenanceRecords = maintenanceRecords.filter(m => m.status === 'overdue');
  const overdueMaintenances = overdueMaintenanceRecords.length;
  
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
      <MetricsCards 
        overdueMaintenances={overdueMaintenances}
        expiredDocuments={expiredDocuments}
        expiringSoonDocuments={expiringSoonDocuments}
        activeHoldItems={activeHoldItems}
        averageOilConsumption={averageOilConsumption}
      />

      {/* Fleet Status Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FleetStatusCard technicalData={technicalData} />
        <CriticalItemsCard 
          expiringDocuments={expiringDocuments}
          holdItems={holdItems}
        />
      </div>

      {/* Upcoming Maintenance Schedule */}
      <UpcomingMaintenanceCard upcomingMaintenances={upcomingMaintenances} />

      {/* Recent Oil Consumption Trend */}
      <OilConsumptionCard recentOilRecords={recentOilRecords} />
    </div>
  );
};
