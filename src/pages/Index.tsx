
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
  Timer,
  Shield
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SalesModule } from "@/components/sales/SalesModule";
import { ScheduleModule } from "@/components/schedule/ScheduleModule";
import { CrewModule } from "@/components/crew/CrewModule";
import { MaintenanceModule } from "@/components/maintenance/MaintenanceModule";
import { ReportsModule } from "@/components/reports/ReportsModule";
import { PhonebookModule } from "@/components/phonebook/PhonebookModule";
import { OwnerBoardModule } from "@/components/owner/OwnerBoardModule";
import { AircraftModule } from "@/components/aircraft/AircraftModule";
import { PilotTimeTableModule } from "@/components/crew/PilotTimeTableModule";
import { OpsModule } from "@/components/ops/OpsModule";
import { AdminModule } from "@/components/admin/AdminModule";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const [activeModule, setActiveModule] = useState("SCHED");
  const navigate = useNavigate();

  const handleLoginClick = () => {
    console.log('Login button clicked');
    console.log('Navigate function:', navigate);
    try {
      console.log('Attempting to navigate to /auth');
      navigate('/auth');
      console.log('Navigation completed');
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  const modules = [
    { id: "SCHED", label: "SCHED", icon: Calendar },
    { id: "SALES", label: "SALES", icon: Plane },
    { id: "OPS", label: "OPS", icon: Settings },
    { id: "AIRCRAFT", label: "AIRCRAFT", icon: Plane },
    { id: "CREW", label: "CREW", icon: Users },
    { id: "CREW-TIME", label: "CREW TIME", icon: Timer },
    { id: "MX", label: "MX", icon: Wrench },
    { id: "REPORTS", label: "REPORTS", icon: BarChart3 },
    { id: "PHONEBOOK", label: "PHONEBOOK", icon: Phone },
    { id: "OWNER BOARD", label: "OWNER BOARD", icon: User },
    { id: "ADMIN", label: "ADMIN", icon: Shield },
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
              <span className="font-bold text-lg">AlidaSoft</span>
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
              ALIDA SUPPORT
            </Badge>
            <Badge variant="outline" className="text-xs bg-slate-700 border-slate-600">
              <User className="w-3 h-3 mr-1" />
              TEST USER
            </Badge>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-gray-300 hover:text-white hover:bg-slate-700"
              onClick={handleLoginClick}
              type="button"
            >
              <User className="w-4 h-4 mr-2" />
              Accesso
            </Button>
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
        {activeModule === "AIRCRAFT" && <AircraftModule />}
        {activeModule === "CREW" && <CrewModule />}
        {activeModule === "CREW-TIME" && <PilotTimeTableModule />}
        {activeModule === "MX" && <MaintenanceModule />}
        {activeModule === "REPORTS" && <ReportsModule />}
        {activeModule === "PHONEBOOK" && <PhonebookModule />}
        {activeModule === "OWNER BOARD" && <OwnerBoardModule />}
        {activeModule === "ADMIN" && <AdminModule />}
      </main>
    </div>
  );
};

export default Index;
