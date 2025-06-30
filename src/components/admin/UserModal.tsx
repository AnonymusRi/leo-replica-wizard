
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import type { SystemModule } from "@/types/user-roles";

interface UserProfile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  organization_id?: string;
  is_active: boolean;
}

interface Organization {
  id: string;
  name: string;
  slug: string;
}

interface UserModalProps {
  user: UserProfile | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AVAILABLE_ROLES = ['super_admin', 'admin', 'manager', 'operator', 'viewer'];
const AVAILABLE_MODULES: SystemModule[] = [
  'SCHED', 'SALES', 'OPS', 'AIRCRAFT', 'CREW', 'CREW-TIME', 
  'MX', 'REPORTS', 'PHONEBOOK', 'OWNER BOARD'
];

export const UserModal = ({ user, isOpen, onClose, onSuccess }: UserModalProps) => {
  const [formData, setFormData] = useState({
    email: '',
    first_name: '',
    last_name: '',
    organization_id: '',
    role: '',
    module_permissions: [] as SystemModule[]
  });

  const { data: organizations } = useQuery({
    queryKey: ['organizations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('organizations')
        .select('id, name, slug')
        .order('name');
      
      if (error) throw error;
      return data as Organization[];
    }
  });

  useEffect(() => {
    if (user) {
      setFormData({
        email: user.email || '',
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        organization_id: user.organization_id || '',
        role: '',
        module_permissions: []
      });
    } else {
      setFormData({
        email: '',
        first_name: '',
        last_name: '',
        organization_id: '',
        role: '',
        module_permissions: []
      });
    }
  }, [user]);

  const handleModuleChange = (module: SystemModule, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      module_permissions: checked
        ? [...prev.module_permissions, module]
        : prev.module_permissions.filter(m => m !== module)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (user) {
        // Aggiorna profilo esistente
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            first_name: formData.first_name,
            last_name: formData.last_name,
            organization_id: formData.organization_id || null
          })
          .eq('id', user.id);

        if (profileError) throw profileError;

        // Aggiorna ruolo se specificato
        if (formData.role && formData.organization_id) {
          const { error: roleError } = await supabase
            .from('user_roles')
            .upsert({
              user_id: user.id,
              organization_id: formData.organization_id,
              role: formData.role as any,
              module_permissions: formData.module_permissions
            });

          if (roleError) throw roleError;
        }

        toast.success('Utente aggiornato con successo');
      } else {
        // Questo richiederebbe di creare prima l'utente in auth.users
        // Per ora mostriamo un messaggio
        toast.error('La creazione di nuovi utenti deve essere fatta tramite registrazione');
        return;
      }

      onSuccess();
    } catch (error: any) {
      toast.error('Errore: ' + error.message);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {user ? 'Modifica Utente' : 'Nuovo Utente'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="first_name">Nome</Label>
              <Input
                id="first_name"
                value={formData.first_name}
                onChange={(e) => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="last_name">Cognome</Label>
              <Input
                id="last_name"
                value={formData.last_name}
                onChange={(e) => setFormData(prev => ({ ...prev, last_name: e.target.value }))}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              disabled={!!user}
              required
            />
          </div>

          <div>
            <Label htmlFor="organization">Organizzazione</Label>
            <Select 
              value={formData.organization_id} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, organization_id: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleziona organizzazione" />
              </SelectTrigger>
              <SelectContent>
                {organizations?.map((org) => (
                  <SelectItem key={org.id} value={org.id}>
                    {org.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="role">Ruolo</Label>
            <Select 
              value={formData.role} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, role: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleziona ruolo" />
              </SelectTrigger>
              <SelectContent>
                {AVAILABLE_ROLES.map((role) => (
                  <SelectItem key={role} value={role}>
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Permessi Moduli</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {AVAILABLE_MODULES.map((module) => (
                <div key={module} className="flex items-center space-x-2">
                  <Checkbox
                    id={module}
                    checked={formData.module_permissions.includes(module)}
                    onCheckedChange={(checked) => handleModuleChange(module, checked as boolean)}
                  />
                  <Label htmlFor={module} className="text-sm">
                    {module}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Annulla
            </Button>
            <Button type="submit">
              {user ? 'Aggiorna' : 'Crea'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
