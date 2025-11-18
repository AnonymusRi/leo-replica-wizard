
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface UserPermission {
  id: string;
  user_email: string;
  module: string;
  permission_type: 'read' | 'write' | 'admin' | 'view_all' | 'edit_all';
  resource_id?: string;
  granted_by?: string;
  granted_at: string;
  expires_at?: string;
  is_active: boolean;
}

export const useUserPermissions = (userEmail?: string, module?: string) => {
  return useQuery({
    queryKey: ['user-permissions', userEmail, module],
    queryFn: async () => {
      let query = supabase
        .from('user_permissions')
        .select('*')
        .eq('is_active', true)
        .order('granted_at', { ascending: false });
      
      if (userEmail) {
        query = query.eq('user_email', userEmail);
      }
      
      if (module) {
        query = query.eq('module', module);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data as UserPermission[];
    },
    enabled: !!(userEmail || module)
  });
};

export const useCheckPermission = (userEmail: string, module: string, permissionType: string) => {
  return useQuery({
    queryKey: ['check-permission', userEmail, module, permissionType],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_permissions')
        .select('*')
        .eq('user_email', userEmail)
        .eq('module', module)
        .eq('permission_type', permissionType)
        .eq('is_active', true)
        .maybeSingle();
      
      if (error) throw error;
      return !!data;
    },
    enabled: !!(userEmail && module && permissionType)
  });
};

export const useGrantPermission = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (permission: Omit<UserPermission, 'id' | 'granted_at'>) => {
      const { data, error } = await supabase
        .from('user_permissions')
        .insert(permission)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-permissions'] });
      toast.success('Permesso concesso con successo');
    },
    onError: (error) => {
      toast.error('Errore concessione permesso: ' + error.message);
    }
  });
};

export const useRevokePermission = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (permissionId: string) => {
      const { data, error } = await supabase
        .from('user_permissions')
        .update({ is_active: false })
        .eq('id', permissionId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-permissions'] });
      toast.success('Permesso revocato');
    }
  });
};
