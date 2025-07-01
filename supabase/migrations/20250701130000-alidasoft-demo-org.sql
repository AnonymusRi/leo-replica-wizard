
-- Inserisce AlidaSoft Aviation come organizzazione dimostrativa
INSERT INTO organizations (
  name, 
  slug, 
  email, 
  phone,
  city,
  country,
  subscription_status,
  active_modules,
  settings
) VALUES (
  'AlidaSoft Aviation',
  'alidasoft-aviation',
  'demo@alidasoft.com',
  '+39 06 1234567',
  'Roma',
  'Italia',
  'active',
  '["SCHED", "SALES", "OPS", "AIRCRAFT", "CREW", "CREW-TIME", "MX", "REPORTS", "PHONEBOOK", "OWNER BOARD"]'::jsonb,
  '{"default_timezone": "Europe/Rome", "language": "it", "demo_account": true}'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  city = EXCLUDED.city,
  country = EXCLUDED.country,
  subscription_status = EXCLUDED.subscription_status,
  active_modules = EXCLUDED.active_modules,
  settings = EXCLUDED.settings,
  updated_at = now();
