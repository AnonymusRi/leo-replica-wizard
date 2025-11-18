
-- Creiamo una tabella per gestire i SuperAdmin
CREATE TABLE public.super_admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  phone_number TEXT,
  is_active BOOLEAN DEFAULT true,
  two_factor_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabella per gestire i codici OTP
CREATE TABLE public.otp_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  phone_number TEXT NOT NULL,
  code TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabella per i log di accesso SuperAdmin
CREATE TABLE public.super_admin_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  ip_address TEXT,
  user_agent TEXT,
  login_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  logout_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true
);

-- Abilitiamo RLS
ALTER TABLE public.super_admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.otp_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.super_admin_sessions ENABLE ROW LEVEL SECURITY;

-- Politiche RLS per super_admins
CREATE POLICY "SuperAdmins can view their own record" ON public.super_admins
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "SuperAdmins can update their own record" ON public.super_admins
  FOR UPDATE USING (auth.uid() = user_id);

-- Politiche RLS per otp_codes
CREATE POLICY "Users can view their own OTP codes" ON public.otp_codes
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own OTP codes" ON public.otp_codes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own OTP codes" ON public.otp_codes
  FOR UPDATE USING (auth.uid() = user_id);

-- Politiche RLS per super_admin_sessions
CREATE POLICY "SuperAdmins can view their own sessions" ON public.super_admin_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "SuperAdmins can insert their own sessions" ON public.super_admin_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Inseriamo Riccardo come SuperAdmin
INSERT INTO public.super_admins (email, phone_number, two_factor_enabled)
VALUES ('riccardo.cirulli@gmail.com', '+39 123 456 7890', true)
ON CONFLICT (email) DO UPDATE SET
  phone_number = EXCLUDED.phone_number,
  two_factor_enabled = EXCLUDED.two_factor_enabled,
  updated_at = now();

-- Funzione per verificare se un utente è SuperAdmin
CREATE OR REPLACE FUNCTION public.is_super_admin(user_email TEXT)
RETURNS BOOLEAN
LANGUAGE sql
STABLE SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.super_admins 
    WHERE email = user_email AND is_active = true
  );
$$;

-- Funzione per generare codice OTP
CREATE OR REPLACE FUNCTION public.generate_otp_code()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN LPAD(FLOOR(RANDOM() * 1000000)::TEXT, 6, '0');
END;
$$;

-- Trigger per aggiornare updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_super_admins_updated_at 
    BEFORE UPDATE ON public.super_admins 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
