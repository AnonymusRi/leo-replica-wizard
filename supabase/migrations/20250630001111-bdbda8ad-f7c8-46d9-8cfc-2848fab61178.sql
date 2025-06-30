
-- Update existing user profile to be super admin
UPDATE public.profiles 
SET 
  first_name = 'Super',
  last_name = 'Admin',
  is_active = true
WHERE email = 'admin@spiralapp.it';

-- Create/Update organization for the super admin if not exists
INSERT INTO public.organizations (name, slug, email, subscription_status, active_modules)
VALUES (
  'Spiral App Administration',
  'spiral-admin',
  'admin@spiralapp.it',
  'active',
  '["aircraft", "crew", "schedule", "ops", "maintenance", "sales", "phonebook", "reports", "owner_board"]'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  subscription_status = EXCLUDED.subscription_status,
  active_modules = EXCLUDED.active_modules;

-- Assign the super admin to the organization
UPDATE public.profiles 
SET organization_id = (SELECT id FROM public.organizations WHERE slug = 'spiral-admin')
WHERE email = 'admin@spiralapp.it';

-- Create/Update super_admin role for the user
INSERT INTO public.user_roles (user_id, organization_id, role, module_permissions)
SELECT 
  p.id,
  p.organization_id,
  'super_admin'::user_role,
  '["all"]'::jsonb
FROM public.profiles p
WHERE p.email = 'admin@spiralapp.it'
ON CONFLICT (user_id, organization_id, role) DO UPDATE SET
  module_permissions = EXCLUDED.module_permissions;
