
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { UserRole, SystemModule, UserRoleRecord } from '@/types/user-roles';

// Map our custom UserRole enum to database enum
const mapToDbRole = (role: UserRole): string => {
  const roleMap: Record<UserRole, string> = {
    'super_admin': 'super_admin',
    'admin': 'organization_admin',
    'manager': 'module_admin', 
    'operator': 'user',
    'viewer': 'crew_member'
  };
  return roleMap[role];
};

// Map database enum to our custom UserRole enum
const mapFromDbRole = (dbRole: string): UserRole => {
  const roleMap: Record<string, UserRole> = {
    'super_admin': 'super_admin',
    'organization_admin': 'admin',
    'module_admin': 'manager',
    'user': 'operator', 
    'crew_member': 'viewer'
  };
  return roleMap[dbRole] || 'viewer';
};

export const useUserRoles = () => {
  return useQuery({
    queryKey: ['user-roles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_roles')
        .select('*');
      
      if (error) throw error;
      
      // Map database roles to our custom UserRole type
      return (data || []).map(role => ({
        ...role,
        role: mapFromDbRole(role.role),
        module_permissions: Array.isArray(role.module_permissions) 
          ? role.module_permissions as SystemModule[]
          : []
      })) as UserRoleRecord[];
    }
  });
};

export const useCurrentUserRole = (organizationId?: string) => {
  return useQuery({
    queryKey: ['current-user-role', organizationId],
    queryFn: async () => {
      if (!organizationId) return null;
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', user.id)
        .eq('organization_id', organizationId)
        .maybeSingle();
      
      if (error) throw error;
      if (!data) return null;
      
      return {
        ...data,
        role: mapFromDbRole(data.role),
        module_permissions: Array.isArray(data.module_permissions) 
          ? data.module_permissions as SystemModule[]
          : []
      } as UserRoleRecord;
    },
    enabled: !!organizationId
  });
};

export const useCreateUserRole = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (params: {
      user_id: string;
      organization_id: string;
      role: UserRole;
      module_permissions?: SystemModule[];
    }) => {
      // Convert our custom role to database role
      const dbRole = mapToDbRole(params.role);
      
      const { data, error } = await supabase
        .from('user_roles')
        .insert({
          user_id: params.user_id,
          organization_id: params.organization_id,
          role: dbRole as any, // Cast to bypass TypeScript checking
          module_permissions: params.module_permissions || []
        })
        .select()
        .single();
      
      if (error) throw error;
      
      return {
        ...data,
        role: mapFromDbRole(data.role),
        module_permissions: Array.isArray(data.module_permissions) 
          ? data.module_permissions as SystemModule[]
          : []
      } as UserRoleRecord;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-roles'] });
      queryClient.invalidateQueries({ queryKey: ['current-user-role'] });
      toast.success('Ruolo utente creato con successo');
    },
    onError: (error) => {
      toast.error('Errore creazione ruolo: ' + error.message);
    }
  });
};

export const useUpdateUserRole = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (params: {
      id: string;
      role?: UserRole;
      module_permissions?: SystemModule[];
    }) => {
      const updateData: any = {};
      
      if (params.role) {
        updateData.role = mapToDbRole(params.role);
      }
      
      if (params.module_permissions) {
        updateData.module_permissions = params.module_permissions;
      }
      
      const { data, error } = await supabase
        .from('user_roles')
        .update(updateData)
        .eq('id', params.id)
        .select()
        .single();
      
      if (error) throw error;
      
      return {
        ...data,
        role: mapFromDbRole(data.role),
        module_permissions: Array.isArray(data.module_permissions) 
          ? data.module_permissions as SystemModule[]
          : []
      } as UserRoleRecord;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-roles'] });
      queryClient.invalidateQueries({ queryKey: ['current-user-role'] });
      toast.success('Ruolo aggiornato con successo');
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
      toast.success('Ruolo eliminato');
    },
    onError: (error) => {
      toast.error('Errore eliminazione ruolo: ' + error.message);
    }
  });
};
