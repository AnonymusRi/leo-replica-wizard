
export type UserRole = 'super_admin' | 'admin' | 'operator' | 'viewer';

export type SystemModule = 
  | 'SCHED' 
  | 'SALES' 
  | 'OPS' 
  | 'AIRCRAFT' 
  | 'CREW' 
  | 'CREW-TIME' 
  | 'MX' 
  | 'REPORTS' 
  | 'PHONEBOOK' 
  | 'OWNER BOARD';

export interface UserRoleRecord {
  id: string;
  user_id: string;
  organization_id: string;
  role: UserRole;
  module_permissions: SystemModule[];
  created_at: string;
  updated_at: string;
}

export interface SaasLicense {
  id: string;
  organization_id: string;
  license_type: string;
  max_users: number;
  active_modules: SystemModule[];
  expires_at?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserPermissionsCheck {
  hasRole: (role: UserRole) => boolean;
  hasModuleAccess: (module: SystemModule) => boolean;
  isAdmin: () => boolean;
  isSuperAdmin: () => boolean;
}
