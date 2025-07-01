
-- Aggiorna la policy per permettere ai SuperAdmin di creare organizzazioni
DROP POLICY IF EXISTS "Super admins can manage all organizations" ON organizations;

CREATE POLICY "Super admins can manage all organizations" ON organizations
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.super_admins 
      WHERE email = auth.email() AND is_active = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.super_admins 
      WHERE email = auth.email() AND is_active = true
    )
  );
