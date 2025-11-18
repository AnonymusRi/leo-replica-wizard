
-- Sistemazione completa del database: tabelle, permessi, ruoli e relazioni

-- 1. Rimuovere le policy RLS problematiche che causano ricorsione infinita
DROP POLICY IF EXISTS "Super admins can manage all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can manage own profile" ON profiles;

-- 2. Creare policy RLS sicure per profiles senza ricorsione
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- 3. Policy per permettere ai SuperAdmin di gestire tutti i profili
CREATE POLICY "Super admins can manage all profiles" ON profiles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.super_admins 
      WHERE email = auth.email() AND is_active = true
    )
  );

-- 4. Assicurarsi che le tabelle abbiano le colonne necessarie
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES organizations(id);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- 5. Creare una tabella per le licenze SaaS se non esiste
CREATE TABLE IF NOT EXISTS saas_licenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  license_type TEXT NOT NULL DEFAULT 'trial',
  max_users INTEGER NOT NULL DEFAULT 5,
  active_modules JSONB DEFAULT '["SCHED", "OPS", "AIRCRAFT", "CREW"]',
  expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 6. Aggiungere RLS per saas_licenses
ALTER TABLE saas_licenses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Super admins can manage all licenses" ON saas_licenses
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.super_admins 
      WHERE email = auth.email() AND is_active = true
    )
  );

CREATE POLICY "Organization admins can view their license" ON saas_licenses
  FOR SELECT USING (
    organization_id IN (
      SELECT organization_id FROM profiles WHERE id = auth.uid()
    )
  );

-- 7. Correggere la tabella user_roles per evitare conflitti
ALTER TABLE user_roles DROP CONSTRAINT IF EXISTS user_roles_user_id_organization_id_role_key;
ALTER TABLE user_roles ADD CONSTRAINT user_roles_user_id_organization_id_unique 
  UNIQUE(user_id, organization_id);

-- 8. Aggiornare le policy per user_roles
DROP POLICY IF EXISTS "Super admins can manage all user roles" ON user_roles;
DROP POLICY IF EXISTS "Users can view roles in their organization" ON user_roles;

CREATE POLICY "Super admins can manage all user roles" ON user_roles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.super_admins 
      WHERE email = auth.email() AND is_active = true
    )
  );

CREATE POLICY "Organization admins can manage roles in their org" ON user_roles
  FOR ALL USING (
    organization_id IN (
      SELECT organization_id FROM profiles WHERE id = auth.uid()
    ) AND EXISTS (
      SELECT 1 FROM user_roles ur 
      WHERE ur.user_id = auth.uid() 
      AND ur.organization_id = user_roles.organization_id 
      AND ur.role IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "Users can view roles in their organization" ON user_roles
  FOR SELECT USING (
    organization_id IN (
      SELECT organization_id FROM profiles WHERE id = auth.uid()
    )
  );

-- 9. Funzione di utilità per verificare se un utente è admin di un'organizzazione
CREATE OR REPLACE FUNCTION public.is_user_org_admin(user_uuid uuid, org_uuid uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = ''
AS $function$
  SELECT EXISTS (
    SELECT 1 
    FROM public.user_roles 
    WHERE user_id = user_uuid 
    AND organization_id = org_uuid 
    AND role IN ('admin', 'super_admin')
  );
$function$;

-- 10. Trigger per aggiornare updated_at su saas_licenses
CREATE TRIGGER update_saas_licenses_updated_at
  BEFORE UPDATE ON saas_licenses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 11. Inserire una licenza di default per l'organizzazione principale se non esiste
INSERT INTO saas_licenses (organization_id, license_type, max_users, active_modules, is_active)
SELECT 
  id, 
  'enterprise', 
  100, 
  '["SCHED", "SALES", "OPS", "AIRCRAFT", "CREW", "CREW-TIME", "MX", "REPORTS", "PHONEBOOK", "OWNER BOARD"]',
  true
FROM organizations 
WHERE slug = 'alidasoft-aviation'
ON CONFLICT DO NOTHING;

-- 12. Assicurarsi che ci sia almeno un super admin con ruolo nell'organizzazione
DO $$
DECLARE
    admin_user_id UUID;
    org_id UUID;
BEGIN
    -- Trovare l'ID dell'utente super admin
    SELECT user_id INTO admin_user_id 
    FROM super_admins 
    WHERE email = 'riccardo.cirulli@gmail.com' AND is_active = true
    LIMIT 1;
    
    -- Trovare l'ID dell'organizzazione principale
    SELECT id INTO org_id 
    FROM organizations 
    WHERE slug = 'alidasoft-aviation'
    LIMIT 1;
    
    -- Se entrambi esistono, assicurarsi che l'utente abbia un profilo e ruolo
    IF admin_user_id IS NOT NULL AND org_id IS NOT NULL THEN
        -- Inserire/aggiornare il profilo
        INSERT INTO profiles (id, email, first_name, last_name, organization_id, is_active)
        VALUES (admin_user_id, 'riccardo.cirulli@gmail.com', 'Riccardo', 'Cirulli', org_id, true)
        ON CONFLICT (id) DO UPDATE SET
            organization_id = EXCLUDED.organization_id,
            is_active = EXCLUDED.is_active;
        
        -- Inserire/aggiornare il ruolo
        INSERT INTO user_roles (user_id, organization_id, role, module_permissions)
        VALUES (admin_user_id, org_id, 'super_admin', '["all"]')
        ON CONFLICT (user_id, organization_id) DO UPDATE SET
            role = EXCLUDED.role,
            module_permissions = EXCLUDED.module_permissions;
    END IF;
END $$;
