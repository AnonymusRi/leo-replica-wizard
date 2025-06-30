
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Organization {
  id: string;
  name: string;
  slug: string;
}

interface UserOrganizationRoleProps {
  formData: {
    organization_id: string;
    role: string;
  };
  onFormDataChange: (updates: Partial<typeof formData>) => void;
}

const AVAILABLE_ROLES = ['super_admin', 'admin', 'manager', 'operator', 'viewer'];

export const UserOrganizationRole = ({ formData, onFormDataChange }: UserOrganizationRoleProps) => {
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

  return (
    <>
      <div>
        <Label htmlFor="organization">Organizzazione</Label>
        <Select 
          value={formData.organization_id} 
          onValueChange={(value) => onFormDataChange({ organization_id: value })}
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
          onValueChange={(value) => onFormDataChange({ role: value })}
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
    </>
  );
};
