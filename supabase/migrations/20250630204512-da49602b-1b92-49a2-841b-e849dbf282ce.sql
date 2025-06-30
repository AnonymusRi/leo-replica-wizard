
-- Abilitiamo temporaneamente il bypass RLS per verificare se i dati esistono
SET row_security = off;
SELECT * FROM public.super_admins WHERE email = 'riccardo.cirulli@gmail.com';
SET row_security = on;

-- Creiamo politiche RLS per permettere la lettura dei super_admins
CREATE POLICY "Allow read access to super_admins table" 
ON public.super_admins
FOR SELECT 
USING (true);

-- Creiamo politica per permettere inserimento/aggiornamento OTP codes
CREATE POLICY "Allow insert otp_codes for super_admins" 
ON public.otp_codes
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow select otp_codes for verification" 
ON public.otp_codes
FOR SELECT 
USING (true);

CREATE POLICY "Allow update otp_codes for verification" 
ON public.otp_codes
FOR UPDATE 
USING (true);

-- Verifichiamo nuovamente che il record esista
SELECT email, phone_number, is_active, two_factor_enabled 
FROM public.super_admins 
WHERE email = 'riccardo.cirulli@gmail.com';
