
-- Fix infinite recursion in RLS policies and organization access issues

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Super admins can manage all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can manage own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

-- Create security definer functions to avoid recursion
CREATE OR REPLACE FUNCTION public.get_current_user_organization()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT organization_id 
  FROM public.profiles 
  WHERE id = auth.uid()
  LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.is_current_user_super_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.super_admins 
    WHERE email = auth.email() 
    AND is_active = true
  );
$$;

CREATE OR REPLACE FUNCTION public.get_current_user_role_in_org(org_id uuid)
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT role::text
  FROM public.user_roles 
  WHERE user_id = auth.uid() 
  AND organization_id = org_id
  LIMIT 1;
$$;

-- Create new, non-recursive policies for profiles
CREATE POLICY "Super admins can manage all profiles" ON profiles
  FOR ALL USING (
    public.is_current_user_super_admin()
  )
  WITH CHECK (
    public.is_current_user_super_admin()
  );

CREATE POLICY "Users can manage own profile" ON profiles
  FOR ALL USING (
    auth.uid() = id
  )
  WITH CHECK (
    auth.uid() = id
  );

-- Fix organizations policies
DROP POLICY IF EXISTS "Super admins can manage all organizations" ON organizations;
DROP POLICY IF EXISTS "Users can view their organization" ON organizations;

CREATE POLICY "Super admins can manage all organizations" ON organizations
  FOR ALL USING (
    public.is_current_user_super_admin()
  )
  WITH CHECK (
    public.is_current_user_super_admin()
  );

CREATE POLICY "Users can view their organization" ON organizations
  FOR SELECT USING (
    id = public.get_current_user_organization()
    OR public.is_current_user_super_admin()
  );

-- Fix user_roles policies
DROP POLICY IF EXISTS "Super admins can manage all user roles" ON user_roles;
DROP POLICY IF EXISTS "Users can view roles in their organization" ON user_roles;

CREATE POLICY "Super admins can manage all user roles" ON user_roles
  FOR ALL USING (
    public.is_current_user_super_admin()
  )
  WITH CHECK (
    public.is_current_user_super_admin()
  );

CREATE POLICY "Organization admins can manage roles in their org" ON user_roles
  FOR ALL USING (
    organization_id = public.get_current_user_organization()
    AND public.get_current_user_role_in_org(organization_id) IN ('admin', 'super_admin')
    OR public.is_current_user_super_admin()
  )
  WITH CHECK (
    organization_id = public.get_current_user_organization()
    AND public.get_current_user_role_in_org(organization_id) IN ('admin', 'super_admin')
    OR public.is_current_user_super_admin()
  );

CREATE POLICY "Users can view roles in their organization" ON user_roles
  FOR SELECT USING (
    organization_id = public.get_current_user_organization()
    OR public.is_current_user_super_admin()
  );

-- Ensure all necessary tables have RLS enabled
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_permissions ENABLE ROW LEVEL SECURITY;

-- Fix user_permissions policies
DROP POLICY IF EXISTS "Users can view their permissions" ON user_permissions;

CREATE POLICY "Super admins can manage all permissions" ON user_permissions
  FOR ALL USING (
    public.is_current_user_super_admin()
  )
  WITH CHECK (
    public.is_current_user_super_admin()
  );

CREATE POLICY "Users can view their permissions" ON user_permissions
  FOR SELECT USING (
    user_email = auth.email()
    OR public.is_current_user_super_admin()
  );

-- Grant necessary permissions to functions
GRANT EXECUTE ON FUNCTION public.get_current_user_organization() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_current_user_super_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_current_user_role_in_org(uuid) TO authenticated;
