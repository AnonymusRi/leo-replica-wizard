
-- Inserire una licenza SaaS simulata per AlidaSoft Aviation
INSERT INTO saas_licenses (
  organization_id,
  license_type,
  max_users,
  active_modules,
  expires_at,
  is_active
) VALUES (
  (SELECT id FROM organizations WHERE slug = 'alidasoft-aviation' LIMIT 1),
  'premium',
  25,
  '["SCHED", "SALES", "OPS", "AIRCRAFT", "CREW", "CREW-TIME", "MX", "REPORTS", "PHONEBOOK", "OWNER BOARD"]',
  '2025-01-31',
  true
);

-- Creare profili utente per gestori della licenza
INSERT INTO profiles (id, email, first_name, last_name, organization_id, is_active) VALUES
(gen_random_uuid(), 'mario.rossi@alidasoft.com', 'Mario', 'Rossi', (SELECT id FROM organizations WHERE slug = 'alidasoft-aviation'), true),
(gen_random_uuid(), 'giulia.bianchi@alidasoft.com', 'Giulia', 'Bianchi', (SELECT id FROM organizations WHERE slug = 'alidasoft-aviation'), true),
(gen_random_uuid(), 'marco.verdi@alidasoft.com', 'Marco', 'Verdi', (SELECT id FROM organizations WHERE slug = 'alidasoft-aviation'), true);

-- Assegnare ruoli ai gestori
INSERT INTO user_roles (user_id, organization_id, role, module_permissions) VALUES
((SELECT id FROM profiles WHERE email = 'mario.rossi@alidasoft.com'), (SELECT id FROM organizations WHERE slug = 'alidasoft-aviation'), 'admin', '["SCHED", "SALES", "OPS", "AIRCRAFT", "CREW", "CREW-TIME", "MX", "REPORTS", "PHONEBOOK", "OWNER BOARD"]'),
((SELECT id FROM profiles WHERE email = 'giulia.bianchi@alidasoft.com'), (SELECT id FROM organizations WHERE slug = 'alidasoft-aviation'), 'operator', '["SCHED", "OPS", "AIRCRAFT", "CREW", "CREW-TIME", "MX"]'),
((SELECT id FROM profiles WHERE email = 'marco.verdi@alidasoft.com'), (SELECT id FROM organizations WHERE slug = 'alidasoft-aviation'), 'viewer', '["SCHED", "OPS", "CREW", "REPORTS"]');

-- Creare membri dell'equipaggio (piloti)
INSERT INTO crew_members (organization_id, first_name, last_name, email, position, license_number, license_expiry, medical_expiry, base_location, is_active) VALUES
((SELECT id FROM organizations WHERE slug = 'alidasoft-aviation'), 'Alessandro', 'Conti', 'alessandro.conti@pilot.com', 'captain', 'CPL-12345', '2025-12-31', '2025-06-30', 'LIRF', true),
((SELECT id FROM organizations WHERE slug = 'alidasoft-aviation'), 'Francesca', 'Marino', 'francesca.marino@pilot.com', 'first_officer', 'CPL-67890', '2025-11-15', '2025-08-20', 'LIRF', true),
((SELECT id FROM organizations WHERE slug = 'alidasoft-aviation'), 'Roberto', 'Ferrari', 'roberto.ferrari@pilot.com', 'captain', 'ATPL-11111', '2026-03-10', '2025-09-15', 'LINATE', true),
((SELECT id FROM organizations WHERE slug = 'alidasoft-aviation'), 'Laura', 'Costa', 'laura.costa@pilot.com', 'first_officer', 'CPL-22222', '2025-10-05', '2025-07-12', 'LINATE', true);

-- Creare profili crew per i piloti
INSERT INTO crew_profiles (crew_member_id, bio, preferences, notification_settings) VALUES
((SELECT id FROM crew_members WHERE email = 'alessandro.conti@pilot.com'), 'Pilota esperto con 15 anni di esperienza nel settore dell aviazione commerciale', '{"preferred_aircraft": "A320", "preferred_routes": "Europe"}', '{"sms": true, "push": true, "email": true}'),
((SELECT id FROM crew_members WHERE email = 'francesca.marino@pilot.com'), 'Co-pilota specializzata in voli charter e operazioni speciali', '{"preferred_aircraft": "B737", "preferred_routes": "Mediterranean"}', '{"sms": false, "push": true, "email": true}'),
((SELECT id FROM crew_members WHERE email = 'roberto.ferrari@pilot.com'), 'Comandante senior con esperienza internazionale', '{"preferred_aircraft": "A321", "preferred_routes": "International"}', '{"sms": true, "push": true, "email": true}'),
((SELECT id FROM crew_members WHERE email = 'laura.costa@pilot.com'), 'Primo ufficiale con specializzazione in meteorologia avanzata', '{"preferred_aircraft": "E195", "preferred_routes": "Domestic"}', '{"sms": false, "push": true, "email": false}');

-- Aggiungere certificazioni per i piloti
INSERT INTO crew_certifications (crew_member_id, certification_type, certificate_number, issue_date, expiry_date, aircraft_type, issuing_authority, is_active) VALUES
((SELECT id FROM crew_members WHERE email = 'alessandro.conti@pilot.com'), 'ATPL', 'ATPL-IT-12345', '2020-01-15', '2025-01-15', 'A320', 'ENAC', true),
((SELECT id FROM crew_members WHERE email = 'alessandro.conti@pilot.com'), 'Type Rating', 'TR-A320-001', '2020-02-01', '2025-02-01', 'A320', 'EASA', true),
((SELECT id FROM crew_members WHERE email = 'francesca.marino@pilot.com'), 'CPL', 'CPL-IT-67890', '2019-03-10', '2025-03-10', 'B737', 'ENAC', true),
((SELECT id FROM crew_members WHERE email = 'francesca.marino@pilot.com'), 'Type Rating', 'TR-B737-002', '2019-04-15', '2025-04-15', 'B737', 'EASA', true),
((SELECT id FROM crew_members WHERE email = 'roberto.ferrari@pilot.com'), 'ATPL', 'ATPL-IT-11111', '2018-05-20', '2025-05-20', 'A321', 'ENAC', true),
((SELECT id FROM crew_members WHERE email = 'roberto.ferrari@pilot.com'), 'Type Rating', 'TR-A321-003', '2018-06-25', '2025-06-25', 'A321', 'EASA', true),
((SELECT id FROM crew_members WHERE email = 'laura.costa@pilot.com'), 'CPL', 'CPL-IT-22222', '2021-07-10', '2025-07-10', 'E195', 'ENAC', true),
((SELECT id FROM crew_members WHERE email = 'laura.costa@pilot.com'), 'Type Rating', 'TR-E195-004', '2021-08-15', '2025-08-15', 'E195', 'EASA', true);

-- Aggiungere alcune statistiche crew per i piloti
INSERT INTO crew_statistics (crew_member_id, month_year, total_flight_hours, total_sectors, total_flights, total_duty_hours, night_hours, simulator_hours, training_hours, days_off, performance_rating) VALUES
((SELECT id FROM crew_members WHERE email = 'alessandro.conti@pilot.com'), '2024-06-01', 85.5, 32, 16, 120.0, 15.5, 8.0, 4.0, 8, 4.8),
((SELECT id FROM crew_members WHERE email = 'francesca.marino@pilot.com'), '2024-06-01', 72.0, 28, 14, 105.5, 12.0, 6.0, 3.0, 10, 4.6),
((SELECT id FROM crew_members WHERE email = 'roberto.ferrari@pilot.com'), '2024-06-01', 95.5, 38, 19, 135.0, 18.5, 10.0, 5.0, 6, 4.9),
((SELECT id FROM crew_members WHERE email = 'laura.costa@pilot.com'), '2024-06-01', 68.0, 26, 13, 98.0, 10.5, 5.0, 2.5, 12, 4.4);

-- Aggiungere alcuni messaggi per i piloti
INSERT INTO crew_messages (crew_member_id, sender_name, sender_id, subject, content, message_type, priority, is_read) VALUES
((SELECT id FROM crew_members WHERE email = 'alessandro.conti@pilot.com'), 'Operations Center', (SELECT id FROM profiles WHERE email = 'mario.rossi@alidasoft.com'), 'Nuovo volo assegnato - AZ1234', 'Ti è stato assegnato il volo AZ1234 per domani alle 08:00. Verifica la documentazione di volo.', 'operational', 'high', false),
((SELECT id FROM crew_members WHERE email = 'francesca.marino@pilot.com'), 'Training Department', (SELECT id FROM profiles WHERE email = 'giulia.bianchi@alidasoft.com'), 'Promemoria training ricorrente', 'Il tuo training ricorrente è programmato per il 15 luglio. Conferma la tua disponibilità.', 'training', 'normal', true),
((SELECT id FROM crew_members WHERE email = 'roberto.ferrari@pilot.com'), 'Crew Scheduling', (SELECT id FROM profiles WHERE email = 'marco.verdi@alidasoft.com'), 'Modifica turno', 'Il tuo turno di domenica è stato spostato alle 14:00 invece che alle 10:00.', 'scheduling', 'normal', false),
((SELECT id FROM crew_members WHERE email = 'laura.costa@pilot.com'), 'Medical Department', (SELECT id FROM profiles WHERE email = 'giulia.bianchi@alidasoft.com'), 'Scadenza certificato medico', 'Il tuo certificato medico scade tra 30 giorni. Prenota la visita di rinnovo.', 'medical', 'high', false);

-- Aggiungere alcuni record di fatica per i piloti
INSERT INTO crew_fatigue_records (crew_member_id, assessment_date, fatigue_level, sleep_hours, stress_level, workload_rating, notes, auto_calculated) VALUES
((SELECT id FROM crew_members WHERE email = 'alessandro.conti@pilot.com'), '2024-07-06', 3, 7.5, 2, 4, 'Turno notturno impegnativo ma gestibile', false),
((SELECT id FROM crew_members WHERE email = 'francesca.marino@pilot.com'), '2024-07-06', 2, 8.0, 1, 3, 'Buon riposo, condizioni ottimali', false),
((SELECT id FROM crew_members WHERE email = 'roberto.ferrari@pilot.com'), '2024-07-06', 4, 6.0, 3, 5, 'Giornata molto intensa con voli multipli', false),
((SELECT id FROM crew_members WHERE email = 'laura.costa@pilot.com'), '2024-07-06', 2, 8.5, 1, 2, 'Giornata tranquilla, ben riposata', false);
