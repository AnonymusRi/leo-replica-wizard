
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Wrench, 
  Filter, 
  Plus, 
  Clock,
  Calendar,
  AlertTriangle,
  CheckCircle,
  CircleDollarSign,
  Plane,
  User,
  Loader2,
  Settings,
  FileText,
  BarChart3,
  Shield
} from "lucide-react";
import { format, isAfter, isBefore, parseISO, addDays } from "date-fns";
import { useMaintenanceRecords } from "@/hooks/useMaintenanceRecords";
import { FleetDetailsView } from "./FleetDetailsView";
import { HoldItemsList } from "./HoldItemsList";
import { DocumentsManager } from "./DocumentsManager";
import { OilConsumptionTracker } from "./OilConsumptionTracker";
import { MaintenanceSettingsModal } from "./MaintenanceSettingsModal";
import { MaintenanceOverview } from "./MaintenanceOverview";

export const MaintenanceModule = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  const { data: maintenanceData } = useMaintenanceRecords(50, 0);
  const maintenanceRecords = maintenanceData?.data || [];

  const scheduledCount = maintenanceRecords.filter(m => m.status === 'scheduled').length;
  const inProgressCount = maintenanceRecords.filter(m => m.status === 'in_progress').length;
  const completedCount = maintenanceRecords.filter(m => m.status === 'completed').length;
  const overdueCount = maintenanceRecords.filter(m => m.status === 'overdue').length;

  const totalPlannedCost = maintenanceRecords
    .filter(m => m.status !== 'completed')
    .reduce((sum, m) => sum + (m.cost || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Maintenance Management</h1>
          <p className="text-gray-600">Complete fleet maintenance tracking and management</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setIsSettingsOpen(true)}
          >
            <Settings className="w-4 h-4 mr-2" />
            API Settings
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
          <Button 
            className="bg-green-600 hover:bg-green-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Maintenance
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Scheduled</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{scheduledCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{inProgressCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{completedCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Overdue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{overdueCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Planned Costs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-indigo-600">€{totalPlannedCost.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">
            <Wrench className="w-4 h-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="fleet">
            <Plane className="w-4 h-4 mr-2" />
            Fleet Details
          </TabsTrigger>
          <TabsTrigger value="documents">
            <FileText className="w-4 h-4 mr-2" />
            Documents
          </TabsTrigger>
          <TabsTrigger value="hold-items">
            <Shield className="w-4 h-4 mr-2" />
            Hold Items
          </TabsTrigger>
          <TabsTrigger value="oil-consumption">
            <BarChart3 className="w-4 h-4 mr-2" />
            Oil Tracking
          </TabsTrigger>
          <TabsTrigger value="reports">
            <Calendar className="w-4 h-4 mr-2" />
            Reports
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <MaintenanceOverview />
        </TabsContent>

        <TabsContent value="fleet" className="space-y-4">
          <FleetDetailsView />
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          <DocumentsManager />
        </TabsContent>

        <TabsContent value="hold-items" className="space-y-4">
          <HoldItemsList />
        </TabsContent>

        <TabsContent value="oil-consumption" className="space-y-4">
          <OilConsumptionTracker />
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Maintenance Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Button variant="outline" className="h-24 flex-col">
                  <FileText className="w-6 h-6 mb-2" />
                  Oil Consumption Report
                </Button>
                <Button variant="outline" className="h-24 flex-col">
                  <Calendar className="w-6 h-6 mb-2" />
                  Maintenance Schedule
                </Button>
                <Button variant="outline" className="h-24 flex-col">
                  <AlertTriangle className="w-6 h-6 mb-2" />
                  Expiry Alerts
                </Button>
                <Button variant="outline" className="h-24 flex-col">
                  <BarChart3 className="w-6 h-6 mb-2" />
                  Cost Analysis
                </Button>
                <Button variant="outline" className="h-24 flex-col">
                  <Shield className="w-6 h-6 mb-2" />
                  Compliance Report
                </Button>
                <Button variant="outline" className="h-24 flex-col">
                  <Plane className="w-6 h-6 mb-2" />
                  Fleet Status
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Settings Modal */}
      <MaintenanceSettingsModal 
        open={isSettingsOpen}
        onOpenChange={setIsSettingsOpen}
      />
    </div>
  );
};
