
-- Aggiorniamo il numero di telefono di Riccardo per l'OTP SuperAdmin
UPDATE public.super_admins 
SET phone_number = '+393933374430', 
    updated_at = now()
WHERE email = 'riccardo.cirulli@gmail.com';
