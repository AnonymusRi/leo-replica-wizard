
-- Passo 1: Aggiungiamo il valore 'admin' all'enum se non esiste
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'admin' AND enumtypid = 'user_role'::regtype) THEN
        ALTER TYPE user_role ADD VALUE 'admin';
    END IF;
END$$;
