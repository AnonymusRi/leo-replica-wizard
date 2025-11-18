
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
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

interface UseUserModalFormProps {
  user: UserProfile | null;
  onSuccess: () => void;
}

export const useUserModalForm = ({ user, onSuccess }: UseUserModalFormProps) => {
  const [formData, setFormData] = useState({
    email: '',
    first_name: '',
    last_name: '',
    organization_id: '',
    role: '',
    module_permissions: [] as SystemModule[]
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

  return {
    formData,
    setFormData,
    handleModuleChange,
    handleSubmit
  };
};
