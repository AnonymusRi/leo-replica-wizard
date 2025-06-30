
-- Creare tabella organizzazioni se non esiste
CREATE TABLE IF NOT EXISTS organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  email TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  country TEXT,
  subscription_status TEXT DEFAULT 'trial',
  subscription_end_date DATE,
  active_modules JSONB DEFAULT '[]',
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Creare tabella ruoli utente se non esiste
CREATE TABLE IF NOT EXISTS user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  role user_role NOT NULL,
  module_permissions JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, organization_id, role)
);

-- Creare tabella permessi utente specifici se non esiste
CREATE TABLE IF NOT EXISTS user_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email TEXT NOT NULL,
  module TEXT NOT NULL,
  permission_type TEXT NOT NULL CHECK (permission_type IN ('read', 'write', 'admin', 'view_all', 'edit_all')),
  resource_id UUID,
  granted_by UUID REFERENCES auth.users(id),
  granted_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true
);

-- Aggiungere organization_id alla tabella profiles se non esiste
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES organizations(id);

-- Inserire organizzazione principale
INSERT INTO organizations (name, slug, email, settings) VALUES 
('AlidaSoft Aviation', 'alidasoft-aviation', 'admin@alidasoft.com', '{"default_timezone": "Europe/Rome", "language": "it"}')
ON CONFLICT (slug) DO NOTHING;

-- Abilitare RLS sulle tabelle
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_permissions ENABLE ROW LEVEL SECURITY;

-- Creare politiche RLS per organizations (DROP se esiste già)
DROP POLICY IF EXISTS "Users can view their organization" ON organizations;
CREATE POLICY "Users can view their organization" ON organizations
  FOR SELECT USING (
    id IN (SELECT organization_id FROM profiles WHERE id = auth.uid())
  );

-- Creare politiche RLS per user_roles  
DROP POLICY IF EXISTS "Users can view roles in their organization" ON user_roles;
CREATE POLICY "Users can view roles in their organization" ON user_roles
  FOR SELECT USING (
    organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid())
  );

-- Creare politiche RLS per user_permissions
DROP POLICY IF EXISTS "Users can view their permissions" ON user_permissions;
CREATE POLICY "Users can view their permissions" ON user_permissions
  FOR SELECT USING (user_email = auth.email());

-- Creare trigger per aggiornare updated_at (DROP se esiste già)
DROP TRIGGER IF EXISTS update_organizations_updated_at ON organizations;
CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON organizations
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_roles_updated_at ON user_roles;
CREATE TRIGGER update_user_roles_updated_at BEFORE UPDATE ON user_roles
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
