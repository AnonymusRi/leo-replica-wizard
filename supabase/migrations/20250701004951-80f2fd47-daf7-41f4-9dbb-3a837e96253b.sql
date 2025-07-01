
-- Rimuovi le policy RLS problematiche esistenti per organizations
DROP POLICY IF EXISTS "Users can view their organization" ON organizations;

-- Crea nuove policy RLS per organizations che permettano al SuperAdmin di gestire tutto
CREATE POLICY "Super admins can manage all organizations" ON organizations
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.super_admins 
      WHERE email = auth.email() AND is_active = true
    )
  );

-- Policy per utenti normali che possono vedere solo la loro organizzazione
CREATE POLICY "Users can view their organization" ON organizations
  FOR SELECT USING (
    id IN (SELECT organization_id FROM profiles WHERE id = auth.uid())
  );

-- Rimuovi le policy RLS problematiche esistenti per user_roles
DROP POLICY IF EXISTS "Users can view roles in their organization" ON user_roles;

-- Crea nuove policy RLS per user_roles
CREATE POLICY "Super admins can manage all user roles" ON user_roles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.super_admins 
      WHERE email = auth.email() AND is_active = true
    )
  );

-- Policy per utenti normali
CREATE POLICY "Users can view roles in their organization" ON user_roles
  FOR SELECT USING (
    organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid())
  );

-- Rimuovi le policy RLS problematiche esistenti per profiles
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

-- Crea policy RLS corrette per profiles per evitare ricorsione infinita
CREATE POLICY "Super admins can manage all profiles" ON profiles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.super_admins 
      WHERE email = auth.email() AND is_active = true
    )
  );

-- Policy per utenti normali che possono gestire solo il proprio profilo
CREATE POLICY "Users can manage own profile" ON profiles
  FOR ALL USING (auth.uid() = id);

-- Assicurati che le tabelle abbiano RLS abilitato
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
