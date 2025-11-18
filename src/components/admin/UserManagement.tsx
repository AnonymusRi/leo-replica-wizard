
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UserModal } from "./UserModal";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface UserProfile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  organization_id?: string;
  is_active: boolean;
  created_at: string;
  organizations?: {
    name: string;
    slug: string;
  } | null;
  user_roles?: Array<{
    role: string;
    module_permissions: string[] | null;
  }> | null;
}

export const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: users, isLoading, refetch } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      // Prima prendiamo i profili
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select(`
          id,
          email,
          first_name,
          last_name,
          organization_id,
          is_active,
          created_at,
          organization:organizations(name, slug)
        `)
        .order('created_at', { ascending: false });
      
      if (profilesError) throw profilesError;
      
      if (!profiles || profiles.length === 0) {
        return [];
      }

      // Poi prendiamo i ruoli separatamente
      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role, module_permissions')
        .in('user_id', profiles.map(p => p.id));
      
      if (rolesError) {
        console.warn('Error fetching user roles:', rolesError);
      }

      // Combiniamo i dati
      const usersWithRoles = profiles.map(profile => ({
        ...profile,
        user_roles: roles?.filter(role => role.user_id === profile.id)?.map(role => ({
          role: role.role,
          module_permissions: role.module_permissions as string[] | null
        })) || []
      }));

      return usersWithRoles as UserProfile[];
    }
  });

  const filteredUsers = users?.filter(user => 
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.last_name?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleCreateUser = () => {
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  const handleEditUser = (user: UserProfile) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Sei sicuro di voler eliminare questo utente?')) return;

    const { error } = await supabase
      .from('profiles')
      .update({ is_active: false })
      .eq('id', userId);

    if (error) {
      toast.error('Errore eliminazione utente: ' + error.message);
    } else {
      toast.success('Utente disattivato con successo');
      refetch();
    }
  };

  if (isLoading) {
    return <div>Caricamento utenti...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Search className="w-4 h-4 text-gray-400" />
          <Input
            placeholder="Cerca utenti..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64"
          />
        </div>
        <Button onClick={handleCreateUser}>
          <Plus className="w-4 h-4 mr-2" />
          Nuovo Utente
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Organizzazione</TableHead>
            <TableHead>Ruoli</TableHead>
            <TableHead>Stato</TableHead>
            <TableHead>Azioni</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredUsers.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">
                {user.first_name} {user.last_name}
              </TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                {user.organization?.name || 'Nessuna'}
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {user.user_roles?.map((role, index) => (
                    <Badge key={index} variant="secondary">
                      {role.role}
                    </Badge>
                  )) || <span className="text-gray-500 text-sm">Nessun ruolo</span>}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={user.is_active ? "default" : "destructive"}>
                  {user.is_active ? "Attivo" : "Disattivo"}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditUser(user)}
                  >
                    <Edit className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteUser(user.id)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <UserModal
        user={selectedUser}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          refetch();
          setIsModalOpen(false);
        }}
      />
    </div>
  );
};
