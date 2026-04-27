CREATE TABLE IF NOT EXISTS public.clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL,
  name text NOT NULL,
  company_name text,
  email text,
  phone text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'clients'
      AND policyname = 'Users can view their own clients'
  ) THEN
    CREATE POLICY "Users can view their own clients"
    ON public.clients
    FOR SELECT
    USING (auth.uid() = owner_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'clients'
      AND policyname = 'Users can insert their own clients'
  ) THEN
    CREATE POLICY "Users can insert their own clients"
    ON public.clients
    FOR INSERT
    WITH CHECK (auth.uid() = owner_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'clients'
      AND policyname = 'Users can update their own clients'
  ) THEN
    CREATE POLICY "Users can update their own clients"
    ON public.clients
    FOR UPDATE
    USING (auth.uid() = owner_id)
    WITH CHECK (auth.uid() = owner_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'clients'
      AND policyname = 'Users can delete their own clients'
  ) THEN
    CREATE POLICY "Users can delete their own clients"
    ON public.clients
    FOR DELETE
    USING (auth.uid() = owner_id);
  END IF;
END $$;

DROP TRIGGER IF EXISTS update_clients_updated_at ON public.clients;
CREATE TRIGGER update_clients_updated_at
BEFORE UPDATE ON public.clients
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.user_assessments
ADD COLUMN IF NOT EXISTS client_id uuid REFERENCES public.clients(id) ON DELETE CASCADE;

ALTER TABLE public.assessment_snapshots
ADD COLUMN IF NOT EXISTS client_id uuid REFERENCES public.clients(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_clients_owner_id ON public.clients(owner_id);
CREATE INDEX IF NOT EXISTS idx_clients_updated_at ON public.clients(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_assessments_client_id ON public.user_assessments(client_id);
CREATE INDEX IF NOT EXISTS idx_user_assessments_user_client_status ON public.user_assessments(user_id, client_id, status, updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_assessment_snapshots_client_id ON public.assessment_snapshots(client_id);
CREATE INDEX IF NOT EXISTS idx_assessment_snapshots_user_client_completed ON public.assessment_snapshots(user_id, client_id, completed_at DESC);

CREATE OR REPLACE FUNCTION public.validate_assessment_client_owner()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.client_id IS NOT NULL AND NOT EXISTS (
    SELECT 1
    FROM public.clients
    WHERE id = NEW.client_id
      AND owner_id = NEW.user_id
  ) THEN
    RAISE EXCEPTION 'Client does not belong to assessment owner';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS validate_user_assessments_client_owner ON public.user_assessments;
CREATE TRIGGER validate_user_assessments_client_owner
BEFORE INSERT OR UPDATE OF client_id, user_id ON public.user_assessments
FOR EACH ROW
EXECUTE FUNCTION public.validate_assessment_client_owner();

DROP TRIGGER IF EXISTS validate_assessment_snapshots_client_owner ON public.assessment_snapshots;
CREATE TRIGGER validate_assessment_snapshots_client_owner
BEFORE INSERT OR UPDATE OF client_id, user_id ON public.assessment_snapshots
FOR EACH ROW
EXECUTE FUNCTION public.validate_assessment_client_owner();