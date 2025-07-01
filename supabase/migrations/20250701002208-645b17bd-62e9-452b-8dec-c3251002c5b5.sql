
-- Prima creiamo la tabella support_tickets base
CREATE TABLE public.support_tickets (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ticket_number text NOT NULL UNIQUE,
  user_id uuid REFERENCES auth.users(id),
  organization_id uuid REFERENCES public.organizations(id),
  title text NOT NULL,
  description text NOT NULL,
  category text NOT NULL CHECK (category IN ('bug_report', 'feature_request', 'technical_support', 'billing')),
  priority text NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  assigned_to text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  resolved_at timestamp with time zone,
  attachments jsonb,
  -- Nuovi campi per gestire l'invio a organizzazioni specifiche
  target_organization_id uuid REFERENCES public.organizations(id),
  is_general_announcement boolean DEFAULT false,
  created_by_super_admin boolean DEFAULT false
);

-- Crea la tabella per i commenti sui ticket
CREATE TABLE public.ticket_comments (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ticket_id uuid REFERENCES public.support_tickets(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id),
  content text NOT NULL,
  is_internal boolean DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  attachments jsonb
);

-- Crea una tabella per gestire i ticket inviati a multiple organizzazioni
CREATE TABLE public.ticket_organization_targets (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ticket_id uuid REFERENCES public.support_tickets(id) ON DELETE CASCADE NOT NULL,
  organization_id uuid REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(ticket_id, organization_id)
);

-- Abilita RLS su tutte le tabelle
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_organization_targets ENABLE ROW LEVEL SECURITY;

-- Policy per i support_tickets - permettere ai super admin di gestire tutto
CREATE POLICY "Super admins can manage all tickets"
  ON public.support_tickets
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Policy per permettere alle organizzazioni di vedere i loro ticket
CREATE POLICY "Organizations can view their tickets"
  ON public.support_tickets
  FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id FROM public.profiles WHERE id = auth.uid()
    )
    OR target_organization_id IN (
      SELECT organization_id FROM public.profiles WHERE id = auth.uid()
    )
    OR is_general_announcement = true
    OR id IN (
      SELECT ticket_id FROM public.ticket_organization_targets 
      WHERE organization_id IN (
        SELECT organization_id FROM public.profiles WHERE id = auth.uid()
      )
    )
  );

-- Policy per i commenti sui ticket
CREATE POLICY "Super admins can manage all ticket comments"
  ON public.ticket_comments
  FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can view comments on their organization tickets"
  ON public.ticket_comments
  FOR SELECT
  USING (
    ticket_id IN (
      SELECT id FROM public.support_tickets 
      WHERE organization_id IN (
        SELECT organization_id FROM public.profiles WHERE id = auth.uid()
      )
      OR target_organization_id IN (
        SELECT organization_id FROM public.profiles WHERE id = auth.uid()
      )
      OR is_general_announcement = true
      OR id IN (
        SELECT ticket_id FROM public.ticket_organization_targets 
        WHERE organization_id IN (
          SELECT organization_id FROM public.profiles WHERE id = auth.uid()
        )
      )
    )
  );

-- Policy per i target delle organizzazioni
CREATE POLICY "Super admins can manage ticket organization targets"
  ON public.ticket_organization_targets
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Funzione per generare numeri di ticket automatici
CREATE OR REPLACE FUNCTION generate_ticket_number()
RETURNS TEXT AS $$
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
$$ LANGUAGE plpgsql;

-- Trigger per generare automaticamente il numero del ticket
CREATE OR REPLACE FUNCTION auto_generate_ticket_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.ticket_number IS NULL OR NEW.ticket_number = '' THEN
    NEW.ticket_number := generate_ticket_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_auto_generate_ticket_number
  BEFORE INSERT ON public.support_tickets
  FOR EACH ROW
  EXECUTE FUNCTION auto_generate_ticket_number();

-- Trigger per aggiornare updated_at
CREATE TRIGGER trigger_update_support_tickets_updated_at
  BEFORE UPDATE ON public.support_tickets
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
