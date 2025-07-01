
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { UserRole, SystemModule } from '@/types/user-roles';

export interface UserRoleRecord {
  id: string;
  user_id: string;
  organization_id: string;
  role: UserRole;
  module_permissions: SystemModule[];
  created_at: string;
  updated_at: string;
}

export const useUserRoles = (organizationId?: string) => {
  return useQuery({
    queryKey: ['user-roles', organizationId],
    queryFn: async () => {
      let query = supabase
        .from('user_roles')
        .select(`
          *,
          profiles!user_id (
            email,
            first_name,
            last_name
          )
        `)
        .order('created_at', { ascending: false });
      
      if (organizationId) {
        query = query.eq('organization_id', organizationId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data as UserRoleRecord[];
    },
    enabled: !!organizationId
  });
};

export const useCurrentUserRole = (organizationId?: string) => {
  return useQuery({
    queryKey: ['current-user-role', organizationId],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !organizationId) return null;

      const { data, error } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', user.id)
        .eq('organization_id', organizationId)
        .maybeSingle();
      
      if (error) throw error;
      return data as UserRoleRecord | null;
    },
    enabled: !!organizationId
  });
};

export const useCreateUserRole = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (roleData: {
      user_id: string;
      organization_id: string;
      role: UserRole;
      module_permissions?: SystemModule[];
    }) => {
      // Use direct insert instead of RPC call since we're having type issues
      const { data, error } = await supabase
        .from('user_roles')
        .insert({
          user_id: roleData.user_id,
          organization_id: roleData.organization_id,
          role: roleData.role as any, // Type cast for now to avoid DB type mismatch
          module_permissions: roleData.module_permissions || ['all']
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-roles'] });
      queryClient.invalidateQueries({ queryKey: ['current-user-role'] });
      toast.success('Ruolo utente creato con successo');
    },
    onError: (error: any) => {
      toast.error('Errore creazione ruolo: ' + error.message);
    }
  });
};

export const useUpdateUserRole = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, updates }: { 
      id: string; 
      updates: Partial<UserRoleRecord> 
    }) => {
      const { data, error } = await supabase
        .from('user_roles')
        .update({
          ...updates,
          role: updates.role as any // Type cast for now to avoid DB type mismatch
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-roles'] });
      queryClient.invalidateQueries({ queryKey: ['current-user-role'] });
      toast.success('Ruolo utente aggiornato');
    },
    onError: (error: any) => {
      toast.error('Errore aggiornamento ruolo: ' + error.message);
    }
  });
};

export const useDeleteUserRole = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (roleId: string) => {
      const { data, error } = await supabase
        .from('user_roles')
        .delete()
        .eq('id', roleId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-roles'] });
      queryClient.invalidateQueries({ queryKey: ['current-user-role'] });
      toast.success('Ruolo utente eliminato');
    },
    onError: (error: any) => {
      toast.error('Errore eliminazione ruolo: ' + error.message);
    }
  });
};
