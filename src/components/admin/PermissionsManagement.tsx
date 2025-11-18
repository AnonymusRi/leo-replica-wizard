
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Key, Search, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface UserPermission {
  id: string;
  user_email: string;
  module: string;
  permission_type: string;
  resource_id?: string;
  granted_by?: string;
  granted_at: string;
  expires_at?: string;
  is_active: boolean;
}

export const PermissionsManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: permissions, isLoading, refetch } = useQuery({
    queryKey: ['user-permissions-management'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_permissions')
        .select('*')
        .order('granted_at', { ascending: false });
      
      if (error) throw error;
      return data as UserPermission[];
    }
  });

  const filteredPermissions = permissions?.filter(permission => 
    permission.user_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    permission.module.toLowerCase().includes(searchTerm.toLowerCase()) ||
    permission.permission_type.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleRevokePermission = async (permissionId: string) => {
    if (!confirm('Sei sicuro di voler revocare questo permesso?')) return;

    const { error } = await supabase
      .from('user_permissions')
      .update({ is_active: false })
      .eq('id', permissionId);

    if (error) {
      toast.error('Errore revoca permesso: ' + error.message);
    } else {
      toast.success('Permesso revocato con successo');
      refetch();
    }
  };

  const getPermissionBadge = (type: string) => {
    switch (type) {
      case 'admin':
        return <Badge variant="destructive">{type}</Badge>;
      case 'write':
        return <Badge variant="default">{type}</Badge>;
      case 'read':
        return <Badge variant="secondary">{type}</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  if (isLoading) {
    return <div>Caricamento permessi...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Search className="w-4 h-4 text-gray-400" />
          <Input
            placeholder="Cerca permessi per email, modulo o tipo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-96"
          />
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Nuovo Permesso
        </Button>
      </div>

      {filteredPermissions.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Key className="w-5 h-5" />
              <span>Permessi Utente Specifici</span>
            </CardTitle>
            <CardDescription>
              Gestisci i permessi granulari assegnati direttamente agli utenti
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Utente</TableHead>
                  <TableHead>Modulo</TableHead>
                  <TableHead>Tipo Permesso</TableHead>
                  <TableHead>Risorsa</TableHead>
                  <TableHead>Concesso Da</TableHead>
                  <TableHead>Scadenza</TableHead>
                  <TableHead>Stato</TableHead>
                  <TableHead>Azioni</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPermissions.map((permission) => (
                  <TableRow key={permission.id}>
                    <TableCell className="font-medium">
                      {permission.user_email}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{permission.module}</Badge>
                    </TableCell>
                    <TableCell>
                      {getPermissionBadge(permission.permission_type)}
                    </TableCell>
                    <TableCell>
                      {permission.resource_id || 'Globale'}
                    </TableCell>
                    <TableCell>
                      {permission.granted_by || 'Sistema'}
                    </TableCell>
                    <TableCell>
                      {permission.expires_at 
                        ? new Date(permission.expires_at).toLocaleDateString('it-IT')
                        : 'Mai'
                      }
                    </TableCell>
                    <TableCell>
                      <Badge variant={permission.is_active ? "default" : "secondary"}>
                        {permission.is_active ? "Attivo" : "Revocato"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {permission.is_active && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRevokePermission(permission.id)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="text-center py-8">
            <Key className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nessun permesso specifico trovato
            </h3>
            <p className="text-gray-500 mb-4">
              I permessi specifici permettono di concedere accessi granulari a risorse specifiche.
            </p>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Crea Primo Permesso
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
