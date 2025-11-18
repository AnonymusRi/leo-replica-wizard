
import { useMemo } from 'react';
import { useCurrentUserRole } from './useUserRoles';
import { useOrganizationLicense } from './useSaasLicenses';
import { useCheckSuperAdminStatus } from './useOrganizations';
import type { UserRole, SystemModule, UserPermissionsCheck } from '@/types/user-roles';

export const useUserPermissions = (organizationId?: string): UserPermissionsCheck => {
  const { data: userRole } = useCurrentUserRole(organizationId);
  const { data: license } = useOrganizationLicense(organizationId);
  const { data: isSuperAdminUser } = useCheckSuperAdminStatus();

  return useMemo(() => {
    console.log('🔐 Computing user permissions:', { 
      userRole: userRole?.role, 
      organizationId, 
      isSuperAdminUser 
    });

    const hasRole = (role: UserRole): boolean => {
      if (isSuperAdminUser) {
        console.log('✅ SuperAdmin access granted');
        return true;
      }
      
      if (!userRole) {
        console.log('❌ No user role found');
        return false;
      }
      
      // Hierarchy check: super_admin has all permissions
      if (userRole.role === 'super_admin') return true;
      if (userRole.role === 'admin' && ['admin', 'operator', 'viewer'].includes(role)) return true;
      if (userRole.role === 'operator' && ['operator', 'viewer'].includes(role)) return true;
      
      const hasRoleResult = userRole.role === role;
      console.log(`🔍 Role check for ${role}:`, hasRoleResult);
      return hasRoleResult;
    };

    const hasModuleAccess = (module: SystemModule): boolean => {
      if (isSuperAdminUser) {
        console.log('✅ SuperAdmin module access granted for:', module);
        return true;
      }
      
      if (!userRole || !license) {
        console.log('⚠️ No license check, allowing access to:', module);
        return true;
      }
      
      // Check if license includes the module
      if (!license.active_modules.includes(module)) {
        console.log('❌ License does not include module:', module);
        return false;
      }
      
      // Check if user has permission for this module
      if (userRole.role === 'super_admin') return true;
      
      // Check module permissions
      const modulePermissions = userRole.module_permissions || [];
      const hasAccess = modulePermissions.includes(module);
      console.log(`🔍 Module access for ${module}:`, hasAccess);
      return hasAccess;
    };

    const isAdmin = (): boolean => {
      const result = isSuperAdminUser || hasRole('admin');
      console.log('🔐 Admin check:', result);
      return result;
    };

    const isSuperAdmin = (): boolean => {
      const result = isSuperAdminUser || userRole?.role === 'super_admin';
      console.log('🔐 SuperAdmin check:', result);
      return result;
    };

    return {
      hasRole,
      hasModuleAccess,
      isAdmin,
      isSuperAdmin
    };
  }, [userRole, license, isSuperAdminUser]);
};

export const useModulePermissions = (organizationId?: string) => {
  const permissions = useUserPermissions(organizationId);
  
  return useMemo(() => {
    const modules: SystemModule[] = [
      'SCHED', 'SALES', 'OPS', 'AIRCRAFT', 'CREW', 'CREW-TIME', 
      'MX', 'REPORTS', 'PHONEBOOK', 'OWNER BOARD'
    ];
    
    return modules.reduce((acc, module) => {
      acc[module] = permissions.hasModuleAccess(module);
      return acc;
    }, {} as Record<SystemModule, boolean>);
  }, [permissions]);
};
