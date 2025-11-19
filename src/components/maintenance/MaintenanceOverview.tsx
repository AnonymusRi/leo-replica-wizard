import { useState, useEffect } from "react";
import { MetricsCards } from "./overview/MetricsCards";
import { FleetStatusCard } from "./overview/FleetStatusCard";
import { UpcomingMaintenanceCard } from "./overview/UpcomingMaintenanceCard";
import { CriticalItemsCard } from "./overview/CriticalItemsCard";
import { OilConsumptionCard } from "./overview/OilConsumptionCard";
import { useAircraftTechnicalData } from "@/hooks/useAircraftTechnicalData";
import { useMaintenanceRecords } from "@/hooks/useMaintenanceRecords";
import { useAircraftDocuments } from "@/hooks/useAircraftDocuments";
import { useAircraftHoldItems } from "@/hooks/useAircraftHoldItems";
import { useOilConsumptionRecords } from "@/hooks/useOilConsumption";
import { HelicopterSimulation } from "./HelicopterSimulation";

export const MaintenanceOverview = () => {
  const { data: technicalData = [] } = useAircraftTechnicalData();
  const { data: maintenanceData } = useMaintenanceRecords(50, 0);
  const maintenanceRecords = maintenanceData?.data || [];
  const { data: documents = [] } = useAircraftDocuments();
  const { data: holdItems = [] } = useAircraftHoldItems();
  const { data: oilData } = useOilConsumptionRecords(50, 0);
  const oilRecords = oilData?.data || [];

  // Calculate metrics
  const overdueMaintenances = maintenanceRecords.filter(
    (record) => record.status === "overdue"
  ).length;

  const expiredDocuments = documents.filter(
    (doc) => doc.status === "expired"
  ).length;

  const expiringSoonDocuments = documents.filter(
    (doc) => doc.status === "expiring_soon"
  ).length;

  const activeHoldItems = holdItems.filter(
    (item) => item.status === "active"
  ).length;

  // Calculate average oil consumption for the last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const recentOilRecords = oilRecords.filter((record) => {
    const recordDate = new Date(record.flight_date);
    return recordDate >= thirtyDaysAgo;
  });

  const validConsumptionRates = recentOilRecords
    .map((record) => record.consumption_rate)
    .filter((rate): rate is number => rate !== null && rate !== undefined);

  const averageOilConsumption =
    validConsumptionRates.length > 0
      ? validConsumptionRates.reduce((sum, rate) => sum + rate, 0) /
        validConsumptionRates.length
      : 0;

  // Get upcoming maintenances (next 30 days)
  const today = new Date();
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(today.getDate() + 30);

  const upcomingMaintenances = maintenanceRecords
    .filter((record) => {
      const scheduledDate = new Date(record.scheduled_date);
      return (
        scheduledDate >= today &&
        scheduledDate <= thirtyDaysFromNow &&
        record.status !== "completed"
      );
    })
    .sort(
      (a, b) =>
        new Date(a.scheduled_date).getTime() -
        new Date(b.scheduled_date).getTime()
    )
    .slice(0, 5);

  // Get expiring documents for CriticalItemsCard
  const expiringDocuments = documents.filter(
    (doc) => doc.status === "expired" || doc.status === "expiring_soon"
  );

  return (
    <div className="space-y-6">
      {/* Helicopter Simulation Section */}
      <HelicopterSimulation />
      
      {/* Existing overview sections */}
      <MetricsCards
        overdueMaintenances={overdueMaintenances}
        expiredDocuments={expiredDocuments}
        expiringSoonDocuments={expiringSoonDocuments}
        activeHoldItems={activeHoldItems}
        averageOilConsumption={averageOilConsumption}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FleetStatusCard technicalData={technicalData} />
        <UpcomingMaintenanceCard upcomingMaintenances={upcomingMaintenances} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CriticalItemsCard
          expiringDocuments={expiringDocuments}
          holdItems={holdItems}
        />
        <OilConsumptionCard recentOilRecords={recentOilRecords} />
      </div>
    </div>
  );
};
