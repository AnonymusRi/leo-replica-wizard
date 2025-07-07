
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LicenseOverview } from "@/components/saas/LicenseOverview";
import { AccessCredentials } from "@/components/saas/AccessCredentials";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Users, Shield, Plane, Calendar, TrendingUp } from "lucide-react";

const SaasDemo = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Demo Licenza SaaS</h1>
              <p className="text-lg text-gray-600 mt-2">
                Licenza Premium per AlidaSoft Aviation - Configurazione Completa
              </p>
            </div>
            <Badge variant="default" className="text-lg px-4 py-2">
              <CheckCircle className="w-5 h-5 mr-2" />
              Licenza Attiva
            </Badge>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Shield className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Tipo Licenza</p>
                  <p className="text-xl font-bold text-blue-600">Premium</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Users className="w-8 h-8 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Utenti Gestori</p>
                  <p className="text-xl font-bold text-green-600">3 / 25</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Plane className="w-8 h-8 text-purple-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Piloti Attivi</p>
                  <p className="text-xl font-bold text-purple-600">4</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <TrendingUp className="w-8 h-8 text-orange-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Moduli Attivi</p>
                  <p className="text-xl font-bold text-orange-600">10</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview" className="flex items-center space-x-2">
              <Shield className="w-4 h-4" />
              <span>Panoramica Licenza</span>
            </TabsTrigger>
            <TabsTrigger value="access" className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>Credenziali di Accesso</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <LicenseOverview />
          </TabsContent>

          <TabsContent value="access" className="mt-6">
            <AccessCredentials />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SaasDemo;
