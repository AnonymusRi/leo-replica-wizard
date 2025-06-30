
import { useMemo } from 'react';
import { useCurrentUserRole } from './useUserRoles';
import { useOrganizationLicense } from './useSaasLicenses';
import type { UserRole, SystemModule, UserPermissionsCheck } from '@/types/user-roles';

export const useUserPermissions = (organizationId?: string): UserPermissionsCheck => {
  const { data: userRole } = useCurrentUserRole(organizationId);
  const { data: license } = useOrganizationLicense(organizationId);

  return useMemo(() => {
    const hasRole = (role: UserRole): boolean => {
      if (!userRole) return false;
      
      // Hierarchy check: super_admin has all permissions
      if (userRole.role === 'super_admin') return true;
      if (userRole.role === 'admin' && ['admin', 'manager', 'operator', 'viewer'].includes(role)) return true;
      if (userRole.role === 'manager' && ['manager', 'operator', 'viewer'].includes(role)) return true;
      if (userRole.role === 'operator' && ['operator', 'viewer'].includes(role)) return true;
      
      return userRole.role === role;
    };

    const hasModuleAccess = (module: SystemModule): boolean => {
      if (!userRole || !license) return false;
      
      // Check if license includes the module
      if (!license.active_modules.includes(module)) return false;
      
      // Check if user has permission for this module
      if (userRole.role === 'super_admin') return true;
      
      return userRole.module_permissions.includes(module);
    };

    const isAdmin = (): boolean => {
      return hasRole('admin');
    };

    const isSuperAdmin = (): boolean => {
      return userRole?.role === 'super_admin';
    };

    return {
      hasRole,
      hasModuleAccess,
      isAdmin,
      isSuperAdmin
    };
  }, [userRole, license]);
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
