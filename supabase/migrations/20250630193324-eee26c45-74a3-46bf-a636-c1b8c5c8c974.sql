
-- Verifichiamo se l'email esiste nella tabella super_admins
SELECT * FROM public.super_admins WHERE email = 'riccardo.cirulli@gmail.com';

-- Se non esiste o non è attiva, la inseriamo/aggiorniamo
INSERT INTO public.super_admins (email, phone_number, two_factor_enabled, is_active)
VALUES ('riccardo.cirulli@gmail.com', '+393933374430', true, true)
ON CONFLICT (email) DO UPDATE SET
  phone_number = EXCLUDED.phone_number,
  two_factor_enabled = EXCLUDED.two_factor_enabled,
  is_active = true,
  updated_at = now();

-- Puliamo eventuali codici OTP scaduti per questa email
DELETE FROM public.otp_codes 
WHERE phone_number = '+393933374430' 
AND (expires_at < now() OR verified = true);

-- Verifichiamo che la funzione is_super_admin funzioni correttamente
SELECT public.is_super_admin('riccardo.cirulli@gmail.com');
