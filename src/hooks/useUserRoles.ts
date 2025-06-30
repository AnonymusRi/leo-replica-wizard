
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { UserRole, UserRoleRecord } from '@/types/user-roles';

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
    }
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
    mutationFn: async (params: {
      user_id: string;
      organization_id: string;
      role: UserRole;
      module_permissions?: string[];
    }) => {
      const { data, error } = await supabase
        .from('user_roles')
        .insert({
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
      module_permissions?: string[];
    }) => {
      const { data, error } = await supabase
        .from('user_roles')
        .update(params)
        .eq('id', params.id)
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
