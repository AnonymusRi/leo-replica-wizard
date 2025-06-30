
-- Drop existing problematic policies
DROP POLICY IF EXISTS "Users can view roles in their organization" ON public.user_roles;
DROP POLICY IF EXISTS "Allow authenticated users to view their own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Allow service role full access" ON public.user_roles;

-- Create simple, non-recursive policies
CREATE POLICY "Users can view their own roles"
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

-- Allow authenticated users to insert their own roles (for super admin setup)
CREATE POLICY "Users can insert their own roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Grant execute permission on the function to authenticated users
GRANT EXECUTE ON FUNCTION public.create_user_role TO authenticated;
