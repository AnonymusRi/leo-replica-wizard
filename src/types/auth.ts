
export interface Organization {
  id: string;
  name: string;
  slug: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  subscription_status: 'trial' | 'active' | 'expired' | 'cancelled';
  subscription_end_date?: string;
  active_modules: string[];
  settings: any;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  organization_id?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  avatar_url?: string;
  is_active: boolean;
  last_login_at?: string;
  created_at: string;
  updated_at: string;
  organization?: Organization;
}

export type UserRole = 'super_admin' | 'organization_admin' | 'module_admin' | 'user' | 'crew_member';

export interface UserRoleData {
  id: string;
  user_id: string;
  organization_id: string;
  role: UserRole;
  module_permissions: string[];
  created_at: string;
  updated_at: string;
}
