
-- Inserire il crew member Riccardo Cirulli
INSERT INTO crew_members (
  first_name,
  last_name,
  email,
  position,
  is_active
) VALUES (
  'Riccardo',
  'Cirulli',
  'riccardo.cirulli@email.com',
  'captain',
  true
);

-- Creare il profilo crew associato
INSERT INTO crew_profiles (
  crew_member_id,
  bio,
  preferences,
  notification_settings
) VALUES (
  (SELECT id FROM crew_members WHERE email = 'riccardo.cirulli@email.com'),
  'Pilota professionista con esperienza internazionale',
  '{"language": "it", "timezone": "Europe/Rome"}',
  '{"email": true, "push": true, "sms": false}'
);
