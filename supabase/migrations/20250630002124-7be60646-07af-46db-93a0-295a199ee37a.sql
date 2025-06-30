
-- Drop existing policies that might be causing recursion
DROP POLICY IF EXISTS "Users can manage their own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Super admins can manage all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Organization admins can manage organization roles" ON public.user_roles;

-- Create a security definer function to safely insert user roles
CREATE OR REPLACE FUNCTION public.create_user_role(
    p_user_id UUID,
    p_organization_id UUID,
    p_role user_role,
    p_module_permissions JSONB DEFAULT '[]'::jsonb
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    new_role_id UUID;
BEGIN
    INSERT INTO public.user_roles (user_id, organization_id, role, module_permissions)
    VALUES (p_user_id, p_organization_id, p_role, p_module_permissions)
    ON CONFLICT (user_id, organization_id, role) 
    DO UPDATE SET module_permissions = EXCLUDED.module_permissions
    RETURNING id INTO new_role_id;
    
    RETURN new_role_id;
END;
$$;

-- Create simple policies that don't cause recursion
CREATE POLICY "Allow authenticated users to view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Allow service role to manage all roles (used by our functions)
CREATE POLICY "Allow service role full access"
ON public.user_roles
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Grant execute permission on the function to authenticated users
GRANT EXECUTE ON FUNCTION public.create_user_role TO authenticated;
