
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Plane, 
  Users, 
  Wrench, 
  BarChart3,
  Phone,
  Settings,
  User,
  Globe,
  Clock,
  Filter
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SalesModule } from "@/components/sales/SalesModule";
import { ScheduleModule } from "@/components/schedule/ScheduleModule";
import { CrewModule } from "@/components/crew/CrewModule";
import { MaintenanceModule } from "@/components/maintenance/MaintenanceModule";
import { ReportsModule } from "@/components/reports/ReportsModule";
import { PhonebookModule } from "@/components/phonebook/PhonebookModule";
import { OwnerBoardModule } from "@/components/owner/OwnerBoardModule";

const Index = () => {
  const [activeModule, setActiveModule] = useState("SCHED");

  const modules = [
    { id: "SCHED", label: "SCHED", icon: Calendar },
    { id: "SALES", label: "SALES", icon: Plane },
    { id: "OPS", label: "OPS", icon: Settings },
    { id: "CREW", label: "CREW", icon: Users },
    { id: "MX", label: "MX", icon: Wrench },
    { id: "REPORTS", label: "REPORTS", icon: BarChart3 },
    { id: "PHONEBOOK", label: "PHONEBOOK", icon: Phone },
    { id: "OWNER BOARD", label: "OWNER BOARD", icon: User },
  ];

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header Navigation */}
      <header className="bg-slate-800 text-white">
        <div className="flex items-center justify-between px-4 py-2">
          {/* Logo and Navigation */}
          <div className="flex items-center space-x-1">
            <div className="flex items-center space-x-2 mr-6">
              <Plane className="w-6 h-6 text-blue-400" />
              <span className="font-bold text-lg">LeoSoft</span>
            </div>
            
            {modules.map((module) => {
              const Icon = module.icon;
              return (
                <Button
                  key={module.id}
                  variant={activeModule === module.id ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setActiveModule(module.id)}
                  className={cn(
                    "text-xs font-medium px-3 py-1 h-8",
                    activeModule === module.id 
                      ? "bg-blue-600 text-white hover:bg-blue-700" 
                      : "text-gray-300 hover:text-white hover:bg-slate-700"
                  )}
                >
                  <Icon className="w-4 h-4 mr-1" />
                  {module.label}
                </Button>
              );
            })}
          </div>

          {/* Right Side Controls */}
          <div className="flex items-center space-x-3">
            <Badge variant="outline" className="text-xs bg-slate-700 border-slate-600">
              <Globe className="w-3 h-3 mr-1" />
              UTC
            </Badge>
            <Badge variant="outline" className="text-xs bg-slate-700 border-slate-600">
              <Clock className="w-3 h-3 mr-1" />
              LEON SUPPORT
            </Badge>
            <Badge variant="outline" className="text-xs bg-slate-700 border-slate-600">
              <User className="w-3 h-3 mr-1" />
              TEST USER
            </Badge>
            <Button variant="ghost" size="sm" className="text-gray-300">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="p-4">
        {activeModule === "SCHED" && <ScheduleModule />}
        {activeModule === "SALES" && <SalesModule />}
        {activeModule === "OPS" && <OpsModule />}
        {activeModule === "CREW" && <CrewModule />}
        {activeModule === "MX" && <MaintenanceModule />}
        {activeModule === "REPORTS" && <ReportsModule />}
        {activeModule === "PHONEBOOK" && <PhonebookModule />}
        {activeModule === "OWNER BOARD" && <OwnerBoardModule />}
      </main>
    </div>
  );
};

// OPS Module Component
const OpsModule = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-4 border-b bg-gray-50">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Flight Operations</h2>
          <div className="flex items-center space-x-2">
            <Button size="sm" variant="outline">
              <Filter className="w-4 h-4 mr-1" />
              FILTER
            </Button>
            <Button size="sm" className="bg-green-600 hover:bg-green-700">
              NEW TRIP
            </Button>
          </div>
        </div>
      </div>
      <div className="p-6">
        <div className="text-center text-gray-500 py-12">
          <Settings className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium mb-2">Operations Management</h3>
          <p className="text-sm">Track flights, manage checklists, and coordinate operations</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
