
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Building, 
  CreditCard, 
  AlertTriangle,
  FileText,
  BarChart3,
  Settings,
  User,
  Shield,
  Package,
  Calendar,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  MessageSquare,
  DollarSign
} from "lucide-react";
import { cn } from "@/lib/utils";
import { LicenseManagement } from "@/components/superadmin/LicenseManagement";
import { OrganizationSetup } from "@/components/superadmin/OrganizationSetup";
import { ActiveLicenses } from "@/components/superadmin/ActiveLicenses";
import { ExpiringLicenses } from "@/components/superadmin/ExpiringLicenses";
import { BillingManagement } from "@/components/superadmin/BillingManagement";
import { ReportsModule } from "@/components/reports/ReportsModule";
import { SoftwareGuide } from "@/components/superadmin/SoftwareGuide";
import { SystemErrors } from "@/components/superladmin/SystemErrors";
import { TicketManagement } from "@/components/superadmin/TicketManagement";
import { PaymentManagement } from "@/components/superadmin/PaymentManagement";
import { OrganizationManagement } from "@/components/admin/OrganizationManagement";

const SuperAdmin = () => {
  const [activeModule, setActiveModule] = useState("dashboard");

  const modules = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "licenses", label: "Gestione Licenze", icon: Package },
    { id: "organizations", label: "Nuove Organizzazioni", icon: Building },
    { id: "organization-management", label: "Gestione Organizzazioni", icon: Building },
    { id: "active-licenses", label: "Licenze Attive", icon: CheckCircle },
    { id: "expiring", label: "In Scadenza", icon: AlertTriangle },
    { id: "billing", label: "Fatturazione", icon: CreditCard },
    { id: "payments", label: "Pagamenti", icon: DollarSign },
    { id: "tickets", label: "Ticket Support", icon: MessageSquare },
    { id: "reports", label: "Report", icon: FileText },
    { id: "guide", label: "Guida Software", icon: FileText },
    { id: "errors", label: "Errori Sistema", icon: AlertCircle },
  ];

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header Navigation */}
      <header className="bg-slate-900 text-white">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Logo and Navigation */}
          <div className="flex items-center space-x-1">
            <div className="flex items-center space-x-2 mr-6">
              <Shield className="w-6 h-6 text-blue-400" />
              <span className="font-bold text-lg">SaaS Admin Console</span>
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
            <Badge variant="outline" className="text-xs bg-slate-800 border-slate-600">
              <TrendingUp className="w-3 h-3 mr-1" />
              SUPER ADMIN
            </Badge>
            <Badge variant="outline" className="text-xs bg-slate-800 border-slate-600">
              <Clock className="w-3 h-3 mr-1" />
              UTC
            </Badge>
            <Button variant="ghost" size="sm" className="text-gray-300">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="p-4">
        {activeModule === "dashboard" && <SuperAdminDashboard />}
        {activeModule === "licenses" && <LicenseManagement />}
        {activeModule === "organizations" && <OrganizationSetup />}
        {activeModule === "organization-management" && (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">Gestione Organizzazioni</h1>
            <OrganizationManagement />
          </div>
        )}
        {activeModule === "active-licenses" && <ActiveLicenses />}
        {activeModule === "expiring" && <ExpiringLicenses />}
        {activeModule === "billing" && <BillingManagement />}
        {activeModule === "payments" && <PaymentManagement />}
        {activeModule === "tickets" && <TicketManagement />}
        {activeModule === "reports" && <ReportsModule />}
        {activeModule === "guide" && <SoftwareGuide />}
        {activeModule === "errors" && <SystemErrors />}
      </main>
    </div>
  );
};

const SuperAdminDashboard = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard SuperAdmin</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Licenze Attive</p>
              <p className="text-2xl font-bold text-green-600">45</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">In Scadenza</p>
              <p className="text-2xl font-bold text-orange-600">8</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-orange-600" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Nuove Richieste</p>
              <p className="text-2xl font-bold text-blue-600">12</p>
            </div>
            <Building className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Fatturato Mensile</p>
              <p className="text-2xl font-bold text-purple-600">€25,450</p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Ultime Attivazioni</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded">
              <div>
                <p className="font-medium">Alitalia Express</p>
                <p className="text-sm text-gray-600">Licenza Premium - 50 utenti</p>
              </div>
              <Badge variant="default">Attivata</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded">
              <div>
                <p className="font-medium">Sky Aviation</p>
                <p className="text-sm text-gray-600">Licenza Standard - 25 utenti</p>
              </div>
              <Badge variant="secondary">In Setup</Badge>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Azioni Richieste</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-red-50 rounded">
              <div>
                <p className="font-medium">Eurofly</p>
                <p className="text-sm text-gray-600">Licenza scaduta da 5 giorni</p>
              </div>
              <Badge variant="destructive">Urgente</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded">
              <div>
                <p className="font-medium">Air Dolomiti</p>
                <p className="text-sm text-gray-600">Richiesta upgrade licenza</p>
              </div>
              <Badge variant="outline">Da Revisionare</Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdmin;
