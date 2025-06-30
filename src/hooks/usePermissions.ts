
import { useAuth } from '@/contexts/AuthContext';
import { hasPermission, getModulePermissions, canAccessModule, ModulePermissions } from '@/types/permissions';

export const usePermissions = () => {
  const { userRole } = useAuth();

  const userRoles = userRole ? [userRole] : [];

  return {
    // Verifica se l'utente ha un permesso specifico
    hasPermission: (module: keyof ModulePermissions, action: string) => 
      hasPermission(userRoles, module, action),

    // Ottiene tutti i permessi per un modulo
    getModulePermissions: (module: keyof ModulePermissions) => 
      getModulePermissions(userRoles, module),

    // Verifica se l'utente può accedere a un modulo
    canAccessModule: (module: keyof ModulePermissions) => 
      canAccessModule(userRoles, module),

    // Verifica se l'utente è super admin
    isSuperAdmin: () => userRoles.includes('super_admin'),

    // Verifica se l'utente è admin dell'organizzazione
    isOrganizationAdmin: () => userRoles.includes('organization_admin'),

    // Verifica se l'utente è admin di un modulo
    isModuleAdmin: () => userRoles.includes('module_admin'),

    // Ottiene il livello di accesso più alto dell'utente
    getHighestRole: () => {
      if (userRoles.includes('super_admin')) return 'super_admin';
      if (userRoles.includes('organization_admin')) return 'organization_admin';
      if (userRoles.includes('module_admin')) return 'module_admin';
      if (userRoles.includes('crew_member')) return 'crew_member';
      return 'user';
    },

    // Ruoli dell'utente
    userRoles,
  };
};

// Hook per component che richiedono permessi specifici
export const useRequirePermission = (module: keyof ModulePermissions, action: string) => {
  const { hasPermission } = usePermissions();
  const hasRequiredPermission = hasPermission(module, action);

  if (!hasRequiredPermission) {
    console.warn(`Accesso negato: permesso richiesto ${module}.${action}`);
  }

  return hasRequiredPermission;
};

// Hook per proteggere componenti che richiedono un ruolo minimo
export const useRequireRole = (minimumRole: string) => {
  const { userRoles } = usePermissions();
  
  const roleHierarchy = ['user', 'crew_member', 'module_admin', 'organization_admin', 'super_admin'];
  const userHighestRoleIndex = Math.max(...userRoles.map(role => roleHierarchy.indexOf(role)));
  const requiredRoleIndex = roleHierarchy.indexOf(minimumRole);

  const hasRequiredRole = userHighestRoleIndex >= requiredRoleIndex;

  if (!hasRequiredRole) {
    console.warn(`Accesso negato: ruolo richiesto ${minimumRole}`);
  }

  return hasRequiredRole;
};
