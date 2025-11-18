
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
      console.log('👥 Fetching user roles for org:', organizationId);
      
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
      
      if (error) {
        console.error('❌ Error fetching user roles:', error);
        throw error;
      }
      
      console.log('✅ User roles fetched:', data?.length || 0);
      return data as UserRoleRecord[];
    },
    enabled: !!organizationId
  });
};

export const useCurrentUserRole = (organizationId?: string) => {
  return useQuery({
    queryKey: ['current-user-role', organizationId],
    queryFn: async () => {
      console.log('🔍 Fetching current user role for org:', organizationId);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !organizationId) {
        console.log('❌ Missing user or organization ID');
        return null;
      }

      const { data, error } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', user.id)
        .eq('organization_id', organizationId)
        .maybeSingle();
      
      if (error) {
        console.error('❌ Error fetching current user role:', error);
        throw error;
      }
      
      console.log('✅ Current user role:', data?.role);
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
      console.log('🆕 Creating user role:', roleData);
      
      const { data, error } = await supabase
        .from('user_roles')
        .insert({
          user_id: roleData.user_id,
          organization_id: roleData.organization_id,
          role: roleData.role as any,
          module_permissions: roleData.module_permissions || []
        })
        .select()
        .single();
      
      if (error) {
        console.error('❌ Error creating user role:', error);
        throw error;
      }
      
      console.log('✅ User role created:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-roles'] });
      queryClient.invalidateQueries({ queryKey: ['current-user-role'] });
      toast.success('Ruolo utente creato con successo');
    },
    onError: (error: any) => {
      console.error('❌ Error in user role creation:', error);
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
      console.log('📝 Updating user role:', id, updates);
      
      const { data, error } = await supabase
        .from('user_roles')
        .update({
          ...updates,
          role: updates.role as any,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('❌ Error updating user role:', error);
        throw error;
      }
      
      console.log('✅ User role updated:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-roles'] });
      queryClient.invalidateQueries({ queryKey: ['current-user-role'] });
      toast.success('Ruolo utente aggiornato');
    },
    onError: (error: any) => {
      console.error('❌ Error in user role update:', error);
      toast.error('Errore aggiornamento ruolo: ' + error.message);
    }
  });
};

export const useDeleteUserRole = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (roleId: string) => {
      console.log('🗑️ Deleting user role:', roleId);
      
      const { data, error } = await supabase
        .from('user_roles')
        .delete()
        .eq('id', roleId)
        .select()
        .single();
      
      if (error) {
        console.error('❌ Error deleting user role:', error);
        throw error;
      }
      
      console.log('✅ User role deleted:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-roles'] });
      queryClient.invalidateQueries({ queryKey: ['current-user-role'] });
      toast.success('Ruolo utente eliminato');
    },
    onError: (error: any) => {
      console.error('❌ Error in user role deletion:', error);
      toast.error('Errore eliminazione ruolo: ' + error.message);
    }
  });
};
