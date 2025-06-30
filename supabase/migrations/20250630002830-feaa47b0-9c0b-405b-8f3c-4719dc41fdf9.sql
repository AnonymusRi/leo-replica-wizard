
-- Create the user_role enum if it doesn't exist
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('super_admin', 'organization_admin', 'module_admin', 'user', 'crew_member');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Ensure the create_user_role function uses the correct enum type
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
