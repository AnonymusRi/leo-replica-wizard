
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useUserModalForm } from "@/hooks/useUserModalForm";
import { UserBasicFields } from "./UserBasicFields";
import { UserOrganizationRole } from "./UserOrganizationRole";
import { UserModulePermissions } from "./UserModulePermissions";

interface UserProfile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  organization_id?: string;
  is_active: boolean;
}

interface UserModalProps {
  user: UserProfile | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const UserModal = ({ user, isOpen, onClose, onSuccess }: UserModalProps) => {
  const { formData, setFormData, handleModuleChange, handleSubmit } = useUserModalForm({
    user,
    onSuccess
  });

  const updateFormData = (updates: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
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
          <UserBasicFields
            formData={formData}
            onFormDataChange={updateFormData}
            isEmailDisabled={!!user}
          />

          <UserOrganizationRole
            formData={formData}
            onFormDataChange={updateFormData}
          />

          <UserModulePermissions
            modulePermissions={formData.module_permissions}
            onModuleChange={handleModuleChange}
          />

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
