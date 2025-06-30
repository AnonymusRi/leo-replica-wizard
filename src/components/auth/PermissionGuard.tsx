
import React from 'react';
import { usePermissions } from '@/hooks/usePermissions';
import { ModulePermissions } from '@/types/permissions';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ShieldX } from 'lucide-react';

interface PermissionGuardProps {
  children: React.ReactNode;
  module?: keyof ModulePermissions;
  action?: string;
  role?: string;
  fallback?: React.ReactNode;
  showError?: boolean;
}

const PermissionGuard: React.FC<PermissionGuardProps> = ({
  children,
  module,
  action,
  role,
  fallback,
  showError = true
}) => {
  const permissions = usePermissions();

  // Verifica permesso specifico
  if (module && action) {
    const hasPermission = permissions.hasPermission(module, action);
    if (!hasPermission) {
      return fallback || (showError ? (
        <Alert variant="destructive" className="m-4">
          <ShieldX className="h-4 w-4" />
          <AlertDescription>
            Non hai i permessi necessari per accedere a questa funzionalità.
            <br />
            <small>Richiesto: {module}.{action}</small>
          </AlertDescription>
        </Alert>
      ) : null);
    }
  }

  // Verifica ruolo minimo
  if (role) {
    const roleHierarchy = ['user', 'crew_member', 'module_admin', 'organization_admin', 'super_admin'];
    const userHighestRoleIndex = Math.max(...permissions.userRoles.map(r => roleHierarchy.indexOf(r)));
    const requiredRoleIndex = roleHierarchy.indexOf(role);

    if (userHighestRoleIndex < requiredRoleIndex) {
      return fallback || (showError ? (
        <Alert variant="destructive" className="m-4">
          <ShieldX className="h-4 w-4" />
          <AlertDescription>
            Non hai il ruolo necessario per accedere a questa sezione.
            <br />
            <small>Richiesto: {role}</small>
          </AlertDescription>
        </Alert>
      ) : null);
    }
  }

  // Verifica accesso al modulo
  if (module && !action) {
    const canAccess = permissions.canAccessModule(module);
    if (!canAccess) {
      return fallback || (showError ? (
        <Alert variant="destructive" className="m-4">
          <ShieldX className="h-4 w-4" />
          <AlertDescription>
            Non hai accesso a questo modulo.
            <br />
            <small>Modulo: {module}</small>
          </AlertDescription>
        </Alert>
      ) : null);
    }
  }

  return <>{children}</>;
};

export default PermissionGuard;
