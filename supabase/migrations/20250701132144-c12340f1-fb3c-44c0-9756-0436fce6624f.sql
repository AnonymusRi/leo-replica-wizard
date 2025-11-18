
-- Aggiorna AlidaSoft Aviation con dati completi e aggiunge Alidaunia
INSERT INTO organizations (
  name, 
  slug, 
  email, 
  phone,
  address,
  city,
  country,
  subscription_status,
  active_modules,
  settings
) VALUES 
-- Aggiorna AlidaSoft Aviation
('AlidaSoft Aviation',
 'alidasoft-aviation',
 'demo@alidasoft.com',
 '+39 06 1234567',
 'Via Roma 123',
 'Roma',
 'Italia',
 'active',
 '["SCHED", "SALES", "OPS", "AIRCRAFT", "CREW", "CREW-TIME", "MX", "REPORTS", "PHONEBOOK", "OWNER BOARD"]'::jsonb,
 '{"default_timezone": "Europe/Rome", "language": "it", "demo_account": true}'::jsonb),

-- Aggiunge Alidaunia come organizzazione completa  
('Alidaunia',
 'alidaunia',
 'info@alidaunia.com',
 '+39 080 1234567',
 'Via Bari 456',
 'Bari',
 'Italia',
 'active',
 '["SCHED", "SALES", "OPS", "AIRCRAFT", "CREW", "CREW-TIME", "MX", "REPORTS", "PHONEBOOK"]'::jsonb,
 '{"default_timezone": "Europe/Rome", "language": "it", "demo_account": false}'::jsonb)

ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  address = EXCLUDED.address,
  city = EXCLUDED.city,
  country = EXCLUDED.country,
  subscription_status = EXCLUDED.subscription_status,
  active_modules = EXCLUDED.active_modules,
  settings = EXCLUDED.settings,
  updated_at = now();

-- Crea alcuni membri crew per Alidaunia per la simulazione
INSERT INTO crew_members (
  first_name,
  last_name,
  email,
  position,
  organization_id,
  license_number,
  phone,
  base_location,
  is_active
) VALUES 
('Vincenzo', 'Pucillo', 'vincenzo.pucillo@alidaunia.com', 'captain', 
 (SELECT id FROM organizations WHERE slug = 'alidaunia'), 
 'CPL-IT-12345', '+39 333 1234567', 'Bari', true),
('Marco', 'Rossi', 'marco.rossi@alidaunia.com', 'first_officer',
 (SELECT id FROM organizations WHERE slug = 'alidaunia'),
 'CPL-IT-67890', '+39 333 7654321', 'Bari', true),
('Anna', 'Bianchi', 'anna.bianchi@alidaunia.com', 'cabin_crew',
 (SELECT id FROM organizations WHERE slug = 'alidaunia'),
 'CC-IT-11111', '+39 333 1111111', 'Bari', true)

ON CONFLICT (email) DO NOTHING;
