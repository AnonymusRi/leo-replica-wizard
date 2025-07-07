
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Plane, Shield, Users, Database } from "lucide-react";
import { LicenseOverview } from "@/components/saas/LicenseOverview";
import { AccessCredentials } from "@/components/saas/AccessCredentials";
import { InitializePilotAccounts } from "@/components/saas/InitializePilotAccounts";

export default function SaasDemo() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Plane className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">AlidaSoft SaaS Demo</h1>
                <p className="text-sm text-gray-500">Sistema di gestione aviazione - Licenza Premium</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Badge variant="default" className="flex items-center space-x-1">
                <Shield className="w-3 h-3" />
                <span>Licenza Attiva</span>
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="overview" className="flex items-center space-x-2">
              <Database className="w-4 h-4" />
              <span>Panoramica Licenza</span>
            </TabsTrigger>
            <TabsTrigger value="credentials" className="flex items-center space-x-2">
              <Shield className="w-4 h-4" />
              <span>Credenziali Accesso</span>
            </TabsTrigger>
            <TabsTrigger value="setup" className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>Setup Account</span>
            </TabsTrigger>
            <TabsTrigger value="info" className="flex items-center space-x-2">
              <Plane className="w-4 h-4" />
              <span>Info Demo</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <LicenseOverview />
          </TabsContent>

          <TabsContent value="credentials">
            <AccessCredentials />
          </TabsContent>

          <TabsContent value="setup">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Setup Account Demo</CardTitle>
                  <CardDescription>
                    Inizializza gli account di autenticazione per la demo
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <InitializePilotAccounts />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="info">
            <Card>
              <CardHeader>
                <CardTitle>Informazioni Demo</CardTitle>
                <CardDescription>
                  Dettagli sulla configurazione della demo SaaS
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Organizzazione Demo</h3>
                  <p className="text-sm text-gray-600">
                    <strong>Nome:</strong> AlidaSoft Aviation<br/>
                    <strong>Licenza:</strong> Premium (25 utenti)<br/>
                    <strong>Scadenza:</strong> 31 Gennaio 2025<br/>
                    <strong>Moduli:</strong> Tutti i moduli attivi
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">Account Creati</h3>
                  <p className="text-sm text-gray-600">
                    • 3 gestori licenza (Admin, Operator, Viewer)<br/>
                    • 4 piloti con profili ATL completi<br/>
                    • Dati simulati realistici per demo complete
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Funzionalità Demo</h3>
                  <p className="text-sm text-gray-600">
                    • Dashboard gestori con tutti i moduli<br/>
                    • Dashboard piloti individuali<br/>
                    • Gestione certificazioni e ore di volo<br/>
                    • Sistema messaggi e gestione fatica<br/>
                    • Compliance FTL e statistiche
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
