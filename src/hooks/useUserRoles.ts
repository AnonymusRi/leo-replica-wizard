
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { UserRole, SystemModule, UserRoleRecord } from '@/types/user-roles';

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
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data as UserRoleRecord | null;
    },
    enabled: !!organizationId
  });
};

export const useUserRoles = (organizationId?: string) => {
  return useQuery({
    queryKey: ['user-roles', organizationId],
    queryFn: async () => {
      let query = supabase
        .from('user_roles')
        .select(`
          *,
          profiles!inner(email, first_name, last_name)
        `)
        .order('created_at', { ascending: false });
      
      if (organizationId) {
        query = query.eq('organization_id', organizationId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data as (UserRoleRecord & { profiles: any })[];
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
      const { data, error } = await supabase
        .from('user_roles')
        .upsert([{
          user_id: roleData.user_id,
          organization_id: roleData.organization_id,
          role: roleData.role,
          module_permissions: roleData.module_permissions || []
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-roles'] });
      queryClient.invalidateQueries({ queryKey: ['current-user-role'] });
      toast.success('Ruolo utente assegnato con successo');
    },
    onError: (error) => {
      toast.error('Errore assegnazione ruolo: ' + error.message);
    }
  });
};

export const useUpdateUserRole = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (update: {
      id: string;
      role?: UserRole;
      module_permissions?: SystemModule[];
    }) => {
      const { data, error } = await supabase
        .from('user_roles')
        .update({
          role: update.role,
          module_permissions: update.module_permissions
        })
        .eq('id', update.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-roles'] });
      queryClient.invalidateQueries({ queryKey: ['current-user-role'] });
      toast.success('Ruolo utente aggiornato con successo');
    },
    onError: (error) => {
      toast.error('Errore aggiornamento ruolo: ' + error.message);
    }
  });
};

export const useDeleteUserRole = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (roleId: string) => {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('id', roleId);
      
      if (error) throw error;
      return roleId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-roles'] });
      queryClient.invalidateQueries({ queryKey: ['current-user-role'] });
      toast.success('Ruolo utente rimosso con successo');
    },
    onError: (error) => {
      toast.error('Errore rimozione ruolo: ' + error.message);
    }
  });
};
