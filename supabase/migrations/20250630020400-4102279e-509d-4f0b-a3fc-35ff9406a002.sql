
-- Crea una policy che permette la creazione dell'organizzazione spiral-admin
-- durante il setup del super admin
CREATE POLICY "Allow creation of spiral-admin organization"
ON public.organizations
FOR INSERT
TO authenticated
WITH CHECK (slug = 'spiral-admin');

-- Assicuriamoci che gli utenti autenticati possano vedere l'organizzazione spiral-admin
CREATE POLICY "Allow viewing spiral-admin organization"
ON public.organizations
FOR SELECT
TO authenticated
USING (slug = 'spiral-admin');
