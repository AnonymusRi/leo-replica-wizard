
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserManagement } from "./UserManagement";
import { RoleManagement } from "./RoleManagement";
import { OrganizationManagement } from "./OrganizationManagement";
import { PermissionsManagement } from "./PermissionsManagement";
import { Users, Shield, Building, Key } from "lucide-react";

export const AdminModule = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Amministrazione Sistema</h1>
      </div>

      <Tabs defaultValue="users" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Utenti
          </TabsTrigger>
          <TabsTrigger value="roles" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Ruoli
          </TabsTrigger>
          <TabsTrigger value="organizations" className="flex items-center gap-2">
            <Building className="w-4 h-4" />
            Organizzazioni
          </TabsTrigger>
          <TabsTrigger value="permissions" className="flex items-center gap-2">
            <Key className="w-4 h-4" />
            Permessi
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>Gestione Utenti</CardTitle>
              <CardDescription>
                Gestisci tutti gli utenti del sistema, assegna ruoli e organizzazioni
              </CardDescription>
            </CardHeader>
            <CardContent>
              <UserManagement />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roles">
          <Card>
            <CardHeader>
              <CardTitle>Gestione Ruoli</CardTitle>
              <CardDescription>
                Configura i ruoli utente e i loro permessi sui moduli
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RoleManagement />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="organizations">
          <Card>
            <CardHeader>
              <CardTitle>Gestione Organizzazioni</CardTitle>
              <CardDescription>
                Gestisci le organizzazioni e le loro configurazioni
              </CardDescription>
            </CardHeader>
            <CardContent>
              <OrganizationManagement />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="permissions">
          <Card>
            <CardHeader>
              <CardTitle>Gestione Permessi</CardTitle>
              <CardDescription>
                Configura permessi specifici per utenti e risorse
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PermissionsManagement />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
