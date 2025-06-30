
import React from 'react';
import { usePermissions } from '@/hooks/usePermissions';
import { ModulePermissions } from '@/types/permissions';
import { UserRole } from '@/types/auth';

interface RoleBasedComponentProps {
  children: React.ReactNode;
  module?: keyof ModulePermissions;
  action?: string;
  roles?: UserRole[];
  requireAll?: boolean; // Se true, richiede tutti i ruoli, altrimenti almeno uno
}

const RoleBasedComponent: React.FC<RoleBasedComponentProps> = ({
  children,
  module,
  action,
  roles,
  requireAll = false
}) => {
  const permissions = usePermissions();

  // Verifica permesso specifico su modulo
  if (module && action) {
    const hasPermission = permissions.hasPermission(module, action);
    if (!hasPermission) return null;
  }

  // Verifica ruoli specifici
  if (roles && roles.length > 0) {
    const hasRoles = requireAll 
      ? roles.every(role => permissions.userRoles.includes(role))
      : roles.some(role => permissions.userRoles.includes(role));
    
    if (!hasRoles) return null;
  }

  return <>{children}</>;
};

// Componenti helper per ruoli specifici
export const SuperAdminOnly: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <RoleBasedComponent roles={['super_admin'] as UserRole[]}>{children}</RoleBasedComponent>
);

export const OrganizationAdminOnly: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <RoleBasedComponent roles={['organization_admin', 'super_admin'] as UserRole[]}>{children}</RoleBasedComponent>
);

export const ModuleAdminOnly: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <RoleBasedComponent roles={['module_admin', 'organization_admin', 'super_admin'] as UserRole[]}>{children}</RoleBasedComponent>
);

export const CrewMemberOnly: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <RoleBasedComponent roles={['crew_member'] as UserRole[]}>{children}</RoleBasedComponent>
);

export default RoleBasedComponent;
