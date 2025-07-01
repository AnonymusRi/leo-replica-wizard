
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building, Plus, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { NewOrganizationModal } from "./modals/NewOrganizationModal";
import { PendingOrganizationRequests } from "./PendingOrganizationRequests";

export const OrganizationSetup = () => {
  const [showNewOrganizationModal, setShowNewOrganizationModal] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Nuove Organizzazioni</h1>
        <Button onClick={() => setShowNewOrganizationModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Nuova Richiesta
        </Button>
      </div>

      {/* Statistiche */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Richieste Pendenti</p>
                <p className="text-2xl font-bold text-blue-600">2</p>
              </div>
              <Clock className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pronte per Setup</p>
                <p className="text-2xl font-bold text-green-600">0</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Documentazione Richiesta</p>
                <p className="text-2xl font-bold text-orange-600">1</p>
              </div>
              <AlertCircle className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Setup Questa Settimana</p>
                <p className="text-2xl font-bold text-purple-600">3</p>
              </div>
              <Building className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending">Richieste Pendenti</TabsTrigger>
          <TabsTrigger value="setup">Setup in Corso</TabsTrigger>
          <TabsTrigger value="completed">Completati</TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          <PendingOrganizationRequests />
        </TabsContent>

        <TabsContent value="setup">
          <Card>
            <CardHeader>
              <CardTitle>Setup in Corso</CardTitle>
              <CardDescription>
                Organizzazioni attualmente in fase di setup
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Building className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Nessun setup in corso al momento</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="completed">
          <Card>
            <CardHeader>
              <CardTitle>Setup Completati</CardTitle>
              <CardDescription>
                Organizzazioni con setup completato di recente
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <div>
                      <div className="font-medium">AlidaSoft Aviation</div>
                      <div className="text-sm text-gray-500">Setup completato - Licenza Demo</div>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Attivo</Badge>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <div>
                      <div className="font-medium">Alidaunia</div>
                      <div className="text-sm text-gray-500">Setup completato - Licenza Attiva</div>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Attivo</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <NewOrganizationModal 
        open={showNewOrganizationModal} 
        onOpenChange={setShowNewOrganizationModal} 
      />
    </div>
  );
};
