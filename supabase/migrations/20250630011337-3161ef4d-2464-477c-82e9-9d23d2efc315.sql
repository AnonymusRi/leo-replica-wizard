
-- Prima, rimuoviamo le politiche esistenti che potrebbero causare conflitti
DROP POLICY IF EXISTS "Users can insert their own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Allow service role full access" ON public.user_roles;

-- Politiche più permissive per user_roles
CREATE POLICY "Authenticated users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Permettiamo agli utenti autenticati di inserire i propri ruoli (necessario per setup super admin)
CREATE POLICY "Authenticated users can create their own roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Permettiamo aggiornamenti dei propri ruoli
CREATE POLICY "Authenticated users can update their own roles"
ON public.user_roles
FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Service role ha accesso completo (per le funzioni)
CREATE POLICY "Service role full access on user_roles"
ON public.user_roles
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Politiche per la tabella profiles
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view profiles in their organization" ON public.profiles;

-- Politica per permettere agli utenti di vedere e aggiornare il proprio profilo
CREATE POLICY "Users can manage their own profile"
ON public.profiles
FOR ALL
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- Super admin possono vedere tutti i profili
CREATE POLICY "Super admins can view all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'super_admin'
  )
);

-- Politiche per organizations
DROP POLICY IF EXISTS "Super admins can view all organizations" ON public.organizations;
DROP POLICY IF EXISTS "Organization members can view their organization" ON public.organizations;

-- Super admin possono gestire tutte le organizzazioni
CREATE POLICY "Super admins can manage all organizations"
ON public.organizations
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'super_admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'super_admin'
  )
);

-- I membri dell'organizzazione possono vedere la propria organizzazione
CREATE POLICY "Organization members can view their organization"
ON public.organizations
FOR SELECT
TO authenticated
USING (
  id IN (
    SELECT organization_id FROM public.profiles 
    WHERE id = auth.uid()
  )
);

-- Aggiorniamo la funzione create_user_role per essere più robusta
CREATE OR REPLACE FUNCTION public.create_user_role(
    p_user_id UUID,
    p_organization_id UUID,
    p_role user_role,
    p_module_permissions JSONB DEFAULT '["all"]'::jsonb
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    new_role_id UUID;
BEGIN
    -- Log per debug
    RAISE NOTICE 'Creating role for user: %, org: %, role: %', p_user_id, p_organization_id, p_role;
    
    -- Inserisci o aggiorna il ruolo
    INSERT INTO public.user_roles (user_id, organization_id, role, module_permissions)
    VALUES (p_user_id, p_organization_id, p_role, p_module_permissions)
    ON CONFLICT (user_id, organization_id, role) 
    DO UPDATE SET 
        module_permissions = EXCLUDED.module_permissions,
        updated_at = now()
    RETURNING id INTO new_role_id;
    
    RAISE NOTICE 'Role created/updated with ID: %', new_role_id;
    
    RETURN new_role_id;
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error in create_user_role: %', SQLERRM;
        RAISE;
END;
$$;

-- Assicuriamoci che i permessi sulla funzione siano corretti
GRANT EXECUTE ON FUNCTION public.create_user_role TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_user_role TO service_role;

-- Verifichiamo che l'organizzazione spiral-admin esista
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
  subscription_status = EXCLUDED.subscription_status,
  active_modules = EXCLUDED.active_modules;
