
-- Fix function search_path security issues by setting search_path to empty string
-- This prevents search path injection attacks

-- Update get_user_role function
CREATE OR REPLACE FUNCTION public.get_user_role(user_id uuid, org_id uuid)
 RETURNS user_role
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path = ''
AS $function$
  SELECT role 
  FROM public.user_roles 
  WHERE user_id = $1 AND organization_id = $2
  LIMIT 1;
$function$;

-- Update get_user_organization function
CREATE OR REPLACE FUNCTION public.get_user_organization()
 RETURNS uuid
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path = ''
AS $function$
  SELECT organization_id 
  FROM public.profiles 
  WHERE id = auth.uid()
  LIMIT 1;
$function$;

-- Update is_super_admin function
CREATE OR REPLACE FUNCTION public.is_super_admin(user_email text)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path = ''
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public.super_admins 
    WHERE email = user_email AND is_active = true
  );
$function$;

-- Update handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data ->> 'first_name',
    NEW.raw_user_meta_data ->> 'last_name'
  );
  RETURN NEW;
END;
$function$;

-- Update get_user_role_safe function
CREATE OR REPLACE FUNCTION public.get_user_role_safe(user_uuid uuid, org_uuid uuid)
 RETURNS text
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path = ''
AS $function$
  SELECT role::text 
  FROM public.user_roles 
  WHERE user_id = user_uuid AND organization_id = org_uuid
  LIMIT 1;
$function$;

-- Update is_organization_admin function
CREATE OR REPLACE FUNCTION public.is_organization_admin(user_uuid uuid, org_uuid uuid)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path = ''
AS $function$
  SELECT EXISTS (
    SELECT 1 
    FROM public.user_roles 
    WHERE user_id = user_uuid 
    AND organization_id = org_uuid 
    AND role IN ('admin', 'super_admin')
  );
$function$;

-- Update create_user_role function
CREATE OR REPLACE FUNCTION public.create_user_role(p_user_id uuid, p_organization_id uuid, p_role user_role, p_module_permissions jsonb DEFAULT '["all"]'::jsonb)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
DECLARE
    new_role_id UUID;
BEGIN
    -- Log per debug
    RAISE NOTICE 'Creating role for user: %, org: %, role: %', p_user_id, p_organization_id, p_role;
    
    -- Inserisci o aggiorna il ruolo
    INSERT INTO public.user_roles (user_id, organization_id, role, module_permissions)
    VALUES (p_user_id, p_organization_id, p_role, p_module_permissions)
    ON CONFLICT (user_id, organization_id, role) 
    DO UPDATE SET 
        module_permissions = EXCLUDED.module_permissions,
        updated_at = now()
    RETURNING id INTO new_role_id;
    
    RAISE NOTICE 'Role created/updated with ID: %', new_role_id;
    
    RETURN new_role_id;
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error in create_user_role: %', SQLERRM;
        RAISE;
END;
$function$;

-- Update generate_otp_code function (already has SET search_path = '' but recreating for consistency)
CREATE OR REPLACE FUNCTION public.generate_otp_code()
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
BEGIN
    RETURN LPAD(FLOOR(RANDOM() * 1000000)::TEXT, 6, '0');
END;
$function$;

-- Update generate_ticket_number function
CREATE OR REPLACE FUNCTION public.generate_ticket_number()
 RETURNS text
 LANGUAGE plpgsql
 SET search_path = ''
AS $function$
DECLARE
  next_number INTEGER;
  ticket_number TEXT;
BEGIN
  -- Trova il prossimo numero disponibile
  SELECT COALESCE(MAX(CAST(SUBSTRING(ticket_number FROM 'TK-(\d+)') AS INTEGER)), 0) + 1
  INTO next_number
  FROM public.support_tickets
  WHERE ticket_number ~ '^TK-\d+$';
  
  -- Genera il numero del ticket
  ticket_number := 'TK-' || LPAD(next_number::TEXT, 6, '0');
  
  RETURN ticket_number;
END;
$function$;

-- Update auto_generate_ticket_number function
CREATE OR REPLACE FUNCTION public.auto_generate_ticket_number()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = ''
AS $function$
BEGIN
  IF NEW.ticket_number IS NULL OR NEW.ticket_number = '' THEN
    NEW.ticket_number := generate_ticket_number();
  END IF;
  RETURN NEW;
END;
$function$;

-- Update update_updated_at_column function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = ''
AS $function$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$function$;
