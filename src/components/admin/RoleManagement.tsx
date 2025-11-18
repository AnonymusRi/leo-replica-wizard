
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield, Users, Settings } from "lucide-react";

interface UserRole {
  id: string;
  role: string;
  module_permissions: string[];
  user_count: number;
  organization_name: string;
}

export const RoleManagement = () => {
  const { data: roles, isLoading } = useQuery({
    queryKey: ['user-roles-summary'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_roles')
        .select(`
          id, role, module_permissions,
          organizations (name),
          user_id
        `);
      
      if (error) throw error;

      // Raggruppa per ruolo e conta utenti
      const roleGroups = data.reduce((acc: any, curr: any) => {
        const key = `${curr.role}-${curr.organizations?.name || 'No Org'}`;
        if (!acc[key]) {
          acc[key] = {
            role: curr.role,
            module_permissions: curr.module_permissions || [],
            organization_name: curr.organizations?.name || 'Nessuna Organizzazione',
            user_count: 0,
            users: new Set()
          };
        }
        acc[key].users.add(curr.user_id);
        acc[key].user_count = acc[key].users.size;
        return acc;
      }, {});

      return Object.values(roleGroups) as UserRole[];
    }
  });

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'super_admin':
        return <Shield className="w-5 h-5 text-red-500" />;
      case 'admin':
        return <Shield className="w-5 h-5 text-orange-500" />;
      case 'operator':
        return <Users className="w-5 h-5 text-blue-500" />;
      case 'viewer':
        return <Settings className="w-5 h-5 text-green-500" />;
      default:
        return <Users className="w-5 h-5 text-gray-500" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'super_admin':
        return 'destructive';
      case 'admin':
        return 'default';
      case 'operator':
        return 'secondary';
      case 'viewer':
        return 'outline';
      default:
        return 'outline';
    }
  };

  if (isLoading) {
    return <div>Caricamento ruoli...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {roles?.map((roleGroup, index) => (
          <Card key={index}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {getRoleIcon(roleGroup.role)}
                  <CardTitle className="text-lg capitalize">
                    {roleGroup.role.replace('_', ' ')}
                  </CardTitle>
                </div>
                <Badge variant={getRoleColor(roleGroup.role) as any}>
                  {roleGroup.user_count} utenti
                </Badge>
              </div>
              <CardDescription>
                {roleGroup.organization_name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-medium mb-2">Permessi Moduli:</h4>
                  <div className="flex flex-wrap gap-1">
                    {roleGroup.module_permissions.length > 0 ? (
                      roleGroup.module_permissions.map((module, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {module}
                        </Badge>
                      ))
                    ) : (
                      <Badge variant="outline" className="text-xs">
                        Nessun permesso specifico
                      </Badge>
                    )}
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  Modifica Permessi
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {!roles || roles.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nessun ruolo configurato
            </h3>
            <p className="text-gray-500 mb-4">
              Inizia assegnando ruoli agli utenti per vedere i dettagli qui.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
