
-- Fix SuperAdmin RLS policies for organizations table
DROP POLICY IF EXISTS "Super admins can manage all organizations" ON organizations;
DROP POLICY IF EXISTS "Users can view their organization" ON organizations;

-- Create a function to check if current user is a SuperAdmin
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

-- Policy for SuperAdmins to manage all organizations
CREATE POLICY "Super admins can manage all organizations" ON organizations
  FOR ALL USING (
    public.is_current_user_super_admin()
  )
  WITH CHECK (
    public.is_current_user_super_admin()
  );

-- Policy for regular users to view their organization
CREATE POLICY "Users can view their organization" ON organizations
  FOR SELECT USING (
    id IN (SELECT organization_id FROM profiles WHERE id = auth.uid())
    OR public.is_current_user_super_admin()
  );

-- Update super_admins table RLS policies
DROP POLICY IF EXISTS "Super admins can manage super_admins" ON super_admins;

CREATE POLICY "Super admins can manage super_admins" ON super_admins
  FOR ALL USING (
    public.is_current_user_super_admin()
  )
  WITH CHECK (
    public.is_current_user_super_admin()
  );

-- Allow SuperAdmins to view super_admins table for authentication
CREATE POLICY "Allow read for authentication" ON super_admins
  FOR SELECT USING (true);
