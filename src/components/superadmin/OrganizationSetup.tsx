
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from "lucide-react";
import { NewOrganizationModal } from "./modals/NewOrganizationModal";
import { PendingOrganizationRequests } from "./PendingOrganizationRequests";
import { OrganizationStatistics } from "./OrganizationStatistics";
import { SetupInProgressTab } from "./SetupInProgressTab";
import { CompletedOrganizationsTab } from "./CompletedOrganizationsTab";

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

      <OrganizationStatistics />

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
          <SetupInProgressTab />
        </TabsContent>

        <TabsContent value="completed">
          <CompletedOrganizationsTab />
        </TabsContent>
      </Tabs>

      <NewOrganizationModal 
        open={showNewOrganizationModal} 
        onOpenChange={setShowNewOrganizationModal} 
      />
    </div>
  );
};
