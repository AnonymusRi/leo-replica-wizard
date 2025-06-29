import { useState } from "react";
import { Sidebar, SidebarContent, SidebarHeader, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Menu, Plane, Users, Calendar, Wrench, FileText, DollarSign, Phone, BarChart3, User } from "lucide-react";
import UserMenu from "@/components/auth/UserMenu";

import AircraftModule from "@/components/modules/AircraftModule";
import CrewModule from "@/components/modules/CrewModule";
import ScheduleModule from "@/components/modules/ScheduleModule";
import OpsModule from "@/components/modules/OpsModule";
import MaintenanceModule from "@/components/modules/MaintenanceModule";
import SalesModule from "@/components/modules/SalesModule";
import PhonebookModule from "@/components/modules/PhonebookModule";
import ReportsModule from "@/components/modules/ReportsModule";
import OwnerBoardModule from "@/components/modules/OwnerBoardModule";

const Index = () => {
  const [activeModule, setActiveModule] = useState('aircraft');

  const renderActiveModule = () => {
    switch (activeModule) {
      case 'aircraft':
        return <AircraftModule />;
      case 'crew':
        return <CrewModule />;
      case 'schedule':
        return <ScheduleModule />;
      case 'ops':
        return <OpsModule />;
      case 'maintenance':
        return <MaintenanceModule />;
      case 'sales':
        return <SalesModule />;
      case 'phonebook':
        return <PhonebookModule />;
      case 'reports':
        return <ReportsModule />;
      case 'owner':
        return <OwnerBoardModule />;
      default:
        return <div>Seleziona un modulo dal menu.</div>;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <Sidebar className="border-r">
          <SidebarHeader className="border-b p-4">
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Plane className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-lg">Charter Mgmt</h1>
                <p className="text-sm text-gray-600">Sistema di gestione</p>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent className="p-4">
            <nav className="space-y-2">
              <Button
                variant={activeModule === 'aircraft' ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setActiveModule('aircraft')}
              >
                <Plane className="mr-2 h-4 w-4" />
                Aircraft
              </Button>

              <Button
                variant={activeModule === 'crew' ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setActiveModule('crew')}
              >
                <Users className="mr-2 h-4 w-4" />
                Crew
              </Button>

              <Button
                variant={activeModule === 'schedule' ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setActiveModule('schedule')}
              >
                <Calendar className="mr-2 h-4 w-4" />
                Schedule
              </Button>

              <Button
                variant={activeModule === 'ops' ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setActiveModule('ops')}
              >
                <FileText className="mr-2 h-4 w-4" />
                Operations
              </Button>

              <Button
                variant={activeModule === 'maintenance' ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setActiveModule('maintenance')}
              >
                <Wrench className="mr-2 h-4 w-4" />
                Maintenance
              </Button>

              <Button
                variant={activeModule === 'sales' ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setActiveModule('sales')}
              >
                <DollarSign className="mr-2 h-4 w-4" />
                Sales
              </Button>

              <Button
                variant={activeModule === 'phonebook' ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setActiveModule('phonebook')}
              >
                <Phone className="mr-2 h-4 w-4" />
                Phonebook
              </Button>

              <Button
                variant={activeModule === 'reports' ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setActiveModule('reports')}
              >
                <BarChart3 className="mr-2 h-4 w-4" />
                Reports
              </Button>

              <Button
                variant={activeModule === 'owner' ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setActiveModule('owner')}
              >
                <User className="mr-2 h-4 w-4" />
                Owner Board
              </Button>
            </nav>
          </SidebarContent>
        </Sidebar>

        <div className="flex-1 flex flex-col">
          <header className="border-b bg-white px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <SidebarTrigger>
                  <Menu className="h-6 w-6" />
                </SidebarTrigger>
                <h2 className="text-xl font-semibold capitalize">{activeModule}</h2>
              </div>
              <UserMenu />
            </div>
          </header>

          <main className="flex-1 p-6">
            {renderActiveModule()}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;
