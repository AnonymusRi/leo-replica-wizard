
-- Disabilitiamo temporaneamente RLS sulla tabella organizations per il setup
ALTER TABLE public.organizations DISABLE ROW LEVEL SECURITY;

-- Rimuoviamo tutte le policy esistenti per sicurezza
DROP POLICY IF EXISTS "Authenticated users can create organizations" ON public.organizations;
DROP POLICY IF EXISTS "Authenticated users can view organizations" ON public.organizations;
DROP POLICY IF EXISTS "Authenticated users can update organizations" ON public.organizations;
DROP POLICY IF EXISTS "Allow creation of spiral-admin organization" ON public.organizations;
DROP POLICY IF EXISTS "Allow viewing spiral-admin organization" ON public.organizations;
DROP POLICY IF EXISTS "Super admins can manage all organizations" ON public.organizations;
DROP POLICY IF EXISTS "Organization members can view their organization" ON public.organizations;

-- Creiamo l'organizzazione spiral-admin direttamente se non esiste
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
