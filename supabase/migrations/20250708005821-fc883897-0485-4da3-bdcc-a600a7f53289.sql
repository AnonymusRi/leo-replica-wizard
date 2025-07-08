
-- Aggiorna le politiche della tabella organizations per permettere ai Super Admin di creare organizzazioni
DROP POLICY IF EXISTS "Users can view their organization" ON organizations;
DROP POLICY IF EXISTS "Super admins can manage all organizations" ON organizations;

-- Politica per permettere ai Super Admin di fare tutto
CREATE POLICY "Super admins can manage all organizations" ON organizations
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM super_admins 
      WHERE email = (auth.jwt() ->> 'email') 
      AND is_active = true
    )
  );

-- Politica per permettere agli utenti di vedere la propria organizzazione
CREATE POLICY "Users can view their organization" ON organizations
  FOR SELECT USING (
    id IN (SELECT organization_id FROM profiles WHERE id = auth.uid())
    OR EXISTS (
      SELECT 1 FROM super_admins 
      WHERE email = (auth.jwt() ->> 'email') 
      AND is_active = true
    )
  );
