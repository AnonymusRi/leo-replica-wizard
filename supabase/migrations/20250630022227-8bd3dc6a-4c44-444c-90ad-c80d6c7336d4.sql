
-- Prima rimuoviamo tutte le policy esistenti sulla tabella organizations
DROP POLICY IF EXISTS "Allow creation of spiral-admin organization" ON public.organizations;
DROP POLICY IF EXISTS "Allow viewing spiral-admin organization" ON public.organizations;
DROP POLICY IF EXISTS "Super admins can manage all organizations" ON public.organizations;
DROP POLICY IF EXISTS "Organization members can view their organization" ON public.organizations;

-- Creiamo policy più permissive per permettere il setup iniziale
-- Policy temporanea per permettere agli utenti autenticati di creare organizzazioni
CREATE POLICY "Authenticated users can create organizations"
ON public.organizations
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Policy per permettere agli utenti autenticati di vedere tutte le organizzazioni
CREATE POLICY "Authenticated users can view organizations"
ON public.organizations
FOR SELECT
TO authenticated
USING (true);

-- Policy per permettere agli utenti autenticati di aggiornare organizzazioni
CREATE POLICY "Authenticated users can update organizations"
ON public.organizations
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);
