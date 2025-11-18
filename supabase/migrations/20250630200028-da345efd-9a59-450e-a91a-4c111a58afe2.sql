
-- Passo 2: Creiamo le funzioni e politiche RLS ora che l'enum è completo
CREATE OR REPLACE FUNCTION public.get_user_role_safe(user_uuid uuid, org_uuid uuid)
RETURNS text
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT role::text 
  FROM public.user_roles 
  WHERE user_id = user_uuid AND organization_id = org_uuid
  LIMIT 1;
$$;

-- Funzione per verificare se l'utente è admin dell'organizzazione
CREATE OR REPLACE FUNCTION public.is_organization_admin(user_uuid uuid, org_uuid uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.user_roles 
    WHERE user_id = user_uuid 
    AND organization_id = org_uuid 
    AND role IN ('admin', 'super_admin')
  );
$$;

-- Politiche per user_roles con controllo amministratori
DROP POLICY IF EXISTS "Admins can insert user roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can update user roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can delete user roles" ON public.user_roles;

CREATE POLICY "Admins can insert user roles" ON public.user_roles
  FOR INSERT WITH CHECK (
    public.is_organization_admin(auth.uid(), organization_id)
  );

CREATE POLICY "Admins can update user roles" ON public.user_roles
  FOR UPDATE USING (
    public.is_organization_admin(auth.uid(), organization_id)
  );

CREATE POLICY "Admins can delete user roles" ON public.user_roles
  FOR DELETE USING (
    public.is_organization_admin(auth.uid(), organization_id)
  );

-- Completiamo tutte le altre politiche RLS
-- 1. Politiche per profiles
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- 2. Politiche per organizations
DROP POLICY IF EXISTS "Users can view their organization" ON public.organizations;

CREATE POLICY "Users can view their organization" ON public.organizations
  FOR SELECT USING (
    id IN (SELECT organization_id FROM public.profiles WHERE id = auth.uid())
  );

-- 3. Politiche per user_roles (SELECT)
DROP POLICY IF EXISTS "Users can view roles in their organization" ON public.user_roles;

CREATE POLICY "Users can view roles in their organization" ON public.user_roles
  FOR SELECT USING (
    organization_id IN (SELECT organization_id FROM public.profiles WHERE id = auth.uid())
    OR user_id = auth.uid()
  );

-- 4. Politiche per user_permissions
DROP POLICY IF EXISTS "Users can view their permissions" ON public.user_permissions;

CREATE POLICY "Users can view their permissions" ON public.user_permissions
  FOR SELECT USING (
    user_email = (SELECT email FROM public.profiles WHERE id = auth.uid())
  );

-- 5. Politiche per crew_members
DROP POLICY IF EXISTS "Users can view crew members" ON public.crew_members;
DROP POLICY IF EXISTS "Authorized users can manage crew members" ON public.crew_members;

CREATE POLICY "Users can view crew members" ON public.crew_members
  FOR SELECT USING (
    organization_id IN (SELECT organization_id FROM public.profiles WHERE id = auth.uid())
    OR email = (SELECT email FROM public.profiles WHERE id = auth.uid())
  );

CREATE POLICY "Authorized users can manage crew members" ON public.crew_members
  FOR ALL USING (
    organization_id IN (SELECT organization_id FROM public.profiles WHERE id = auth.uid())
  );

-- 6. Politiche per flights
DROP POLICY IF EXISTS "Users can view flights" ON public.flights;
DROP POLICY IF EXISTS "Authorized users can manage flights" ON public.flights;

CREATE POLICY "Users can view flights" ON public.flights
  FOR SELECT USING (
    organization_id IN (SELECT organization_id FROM public.profiles WHERE id = auth.uid())
  );

CREATE POLICY "Authorized users can manage flights" ON public.flights
  FOR ALL USING (
    organization_id IN (SELECT organization_id FROM public.profiles WHERE id = auth.uid())
  );

-- 7. Politiche per aircraft
DROP POLICY IF EXISTS "Users can view aircraft" ON public.aircraft;
DROP POLICY IF EXISTS "Authorized users can manage aircraft" ON public.aircraft;

CREATE POLICY "Users can view aircraft" ON public.aircraft
  FOR SELECT USING (
    organization_id IN (SELECT organization_id FROM public.profiles WHERE id = auth.uid())
  );

CREATE POLICY "Authorized users can manage aircraft" ON public.aircraft
  FOR ALL USING (
    organization_id IN (SELECT organization_id FROM public.profiles WHERE id = auth.uid())
  );

-- 8. Politiche per clients
DROP POLICY IF EXISTS "Users can view clients" ON public.clients;
DROP POLICY IF EXISTS "Authorized users can manage clients" ON public.clients;

CREATE POLICY "Users can view clients" ON public.clients
  FOR SELECT USING (
    organization_id IN (SELECT organization_id FROM public.profiles WHERE id = auth.uid())
  );

CREATE POLICY "Authorized users can manage clients" ON public.clients
  FOR ALL USING (
    organization_id IN (SELECT organization_id FROM public.profiles WHERE id = auth.uid())
  );

-- Abilitare RLS su tutte le tabelle necessarie
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crew_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aircraft ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
