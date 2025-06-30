
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { UserRoleRecord, UserRole, SystemModule } from '@/types/user-roles';

export const useUserRoles = (organizationId?: string) => {
  return useQuery({
    queryKey: ['user-roles', organizationId],
    queryFn: async () => {
      let query = supabase
        .from('user_roles')
        .select('*')
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

export const useAssignUserRole = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (params: {
      user_id: string;
      organization_id: string;
      role: UserRole;
      module_permissions?: SystemModule[];
    }) => {
      const { data, error } = await supabase
        .from('user_roles')
        .upsert({
          user_id: params.user_id,
          organization_id: params.organization_id,
          role: params.role,
          module_permissions: params.module_permissions || []
        })
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

export const useRemoveUserRole = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (roleId: string) => {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('id', roleId);
      
      if (error) throw error;
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
