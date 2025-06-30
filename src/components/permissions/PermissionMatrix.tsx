
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ROLE_PERMISSIONS, ModulePermissions } from '@/types/permissions';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Shield, Settings, Users, Plane, Calendar, Wrench, DollarSign, Phone, FileText, BarChart3 } from 'lucide-react';

interface PermissionMatrixProps {
  userId?: string;
  organizationId?: string;
  editable?: boolean;
  onPermissionChange?: (module: string, action: string, enabled: boolean) => void;
}

const MODULE_ICONS = {
  platform: Shield,
  organization: Settings,
  aircraft: Plane,
  crew: Users,
  schedule: Calendar,
  ops: Settings,
  maintenance: Wrench,
  sales: DollarSign,
  phonebook: Phone,
  reports: FileText,
  owner_board: BarChart3,
};

const PermissionMatrix: React.FC<PermissionMatrixProps> = ({
  userId,
  organizationId,
  editable = false,
  onPermissionChange
}) => {
  const [selectedRole, setSelectedRole] = useState<string>('organization_admin');
  const [customPermissions, setCustomPermissions] = useState<Record<string, any>>({});

  const handlePermissionToggle = (module: string, action: string, enabled: boolean) => {
    setCustomPermissions(prev => ({
      ...prev,
      [module]: {
        ...prev[module],
        [action]: enabled
      }
    }));
    
    onPermissionChange?.(module, action, enabled);
  };

  const renderPermissionRow = (module: string, permissions: any) => {
    const ModuleIcon = MODULE_ICONS[module as keyof typeof MODULE_ICONS] || Settings;
    
    return (
      <Card key={module} className="mb-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ModuleIcon className="h-5 w-5" />
            {module.toUpperCase()}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Object.entries(permissions).map(([action, enabled]) => (
              <div key={action} className="flex items-center justify-between space-x-2">
                <Label htmlFor={`${module}-${action}`} className="text-sm">
                  {action.replace(/_/g, ' ')}
                </Label>
                {editable ? (
                  <Switch
                    id={`${module}-${action}`}
                    checked={customPermissions[module]?.[action] ?? enabled as boolean}
                    onCheckedChange={(checked) => handlePermissionToggle(module, action, checked)}
                  />
                ) : (
                  <Badge variant={enabled ? "default" : "secondary"}>
                    {enabled ? "Sì" : "No"}
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Matrice Permessi</h2>
        {editable && (
          <Button>
            Salva Modifiche
          </Button>
        )}
      </div>

      <Tabs value={selectedRole} onValueChange={setSelectedRole}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="super_admin">Super Admin</TabsTrigger>
          <TabsTrigger value="organization_admin">Org Admin</TabsTrigger>
          <TabsTrigger value="module_admin">Module Admin</TabsTrigger>
          <TabsTrigger value="user">User</TabsTrigger>
          <TabsTrigger value="crew_member">Crew Member</TabsTrigger>
        </TabsList>

        {Object.entries(ROLE_PERMISSIONS).map(([role, rolePermissions]) => (
          <TabsContent key={role} value={role} className="space-y-4">
            <div className="mb-4">
              <Badge variant="outline" className="text-lg p-2">
                Ruolo: {role.replace(/_/g, ' ')}
              </Badge>
            </div>
            
            {Object.entries(rolePermissions).map(([module, permissions]) => 
              renderPermissionRow(module, permissions)
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default PermissionMatrix;
