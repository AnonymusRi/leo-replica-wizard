
import { useAuth } from '@/contexts/AuthContext';
import { hasPermission, getModulePermissions, canAccessModule, ModulePermissions } from '@/types/permissions';
import { UserRole } from '@/types/auth';

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

    // Verifica se l'utente è membro dell'equipaggio
    isCrewMember: () => userRoles.includes('crew_member'),

    // Verifica se l'utente è un utente standard
    isUser: () => userRoles.includes('user'),

    // Ottiene il livello di accesso più alto dell'utente
    getHighestRole: (): UserRole => {
      if (userRoles.includes('super_admin')) return 'super_admin';
      if (userRoles.includes('organization_admin')) return 'organization_admin';
      if (userRoles.includes('module_admin')) return 'module_admin';
      if (userRoles.includes('crew_member')) return 'crew_member';
      return 'user';
    },

    // Ruoli dell'utente
    userRoles: userRoles as UserRole[],

    // Verifica se l'utente ha almeno uno dei ruoli specificati
    hasAnyRole: (roles: UserRole[]) => 
      roles.some(role => userRoles.includes(role)),

    // Verifica se l'utente ha tutti i ruoli specificati
    hasAllRoles: (roles: UserRole[]) => 
      roles.every(role => userRoles.includes(role)),

    // Verifica se l'utente può gestire altri utenti
    canManageUsers: () => 
      userRoles.includes('super_admin') || 
      userRoles.includes('organization_admin'),

    // Verifica se l'utente può gestire l'organizzazione
    canManageOrganization: () => 
      userRoles.includes('super_admin') || 
      userRoles.includes('organization_admin'),

    // Verifica se l'utente può accedere alla piattaforma
    canAccessPlatform: () => 
      userRoles.includes('super_admin'),
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
export const useRequireRole = (minimumRole: UserRole) => {
  const { userRoles } = usePermissions();
  
  const roleHierarchy: UserRole[] = ['user', 'crew_member', 'module_admin', 'organization_admin', 'super_admin'];
  const userHighestRoleIndex = Math.max(...userRoles.map(role => roleHierarchy.indexOf(role)));
  const requiredRoleIndex = roleHierarchy.indexOf(minimumRole);

  const hasRequiredRole = userHighestRoleIndex >= requiredRoleIndex;

  if (!hasRequiredRole) {
    console.warn(`Accesso negato: ruolo richiesto ${minimumRole}`);
  }

  return hasRequiredRole;
};

// Hook per verificare permessi multipli
export const useRequireAnyPermission = (permissions: Array<{ module: keyof ModulePermissions; action: string }>) => {
  const { hasPermission } = usePermissions();
  
  const hasAnyPermission = permissions.some(({ module, action }) => 
    hasPermission(module, action)
  );

  if (!hasAnyPermission) {
    console.warn(`Accesso negato: nessuno dei permessi richiesti trovato`, permissions);
  }

  return hasAnyPermission;
};

// Hook per verificare se l'utente può accedere a moduli multipli
export const useRequireModuleAccess = (modules: Array<keyof ModulePermissions>) => {
  const { canAccessModule } = usePermissions();
  
  const accessibleModules = modules.filter(module => canAccessModule(module));
  const hasAccess = accessibleModules.length > 0;

  if (!hasAccess) {
    console.warn(`Accesso negato: nessun accesso ai moduli richiesti`, modules);
  }

  return {
    hasAccess,
    accessibleModules,
    restrictedModules: modules.filter(module => !canAccessModule(module))
  };
};
