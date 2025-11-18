
-- Fix RLS policies for organizations table to allow SuperAdmin insertions

-- Drop existing organization policies
DROP POLICY IF EXISTS "Super admins can manage all organizations" ON organizations;
DROP POLICY IF EXISTS "Users can view their organization" ON organizations;

-- Create comprehensive policy for SuperAdmins (includes INSERT)
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
    id = public.get_current_user_organization()
    OR public.is_current_user_super_admin()
  );

-- Ensure the function exists and works correctly
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

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION public.is_current_user_super_admin() TO authenticated;
