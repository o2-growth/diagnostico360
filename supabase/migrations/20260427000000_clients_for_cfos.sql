CREATE TABLE public.clients (
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

CREATE POLICY "Users can view their own clients"
ON public.clients
FOR SELECT
USING (auth.uid() = owner_id);

CREATE POLICY "Users can insert their own clients"
ON public.clients
FOR INSERT
WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update their own clients"
ON public.clients
FOR UPDATE
USING (auth.uid() = owner_id)
WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can delete their own clients"
ON public.clients
FOR DELETE
USING (auth.uid() = owner_id);

CREATE TRIGGER update_clients_updated_at
BEFORE UPDATE ON public.clients
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.user_assessments
ADD COLUMN client_id uuid REFERENCES public.clients(id) ON DELETE CASCADE;

ALTER TABLE public.assessment_snapshots
ADD COLUMN client_id uuid REFERENCES public.clients(id) ON DELETE CASCADE;

CREATE INDEX idx_clients_owner_id ON public.clients(owner_id);
CREATE INDEX idx_user_assessments_client_id ON public.user_assessments(client_id);
CREATE INDEX idx_assessment_snapshots_client_id ON public.assessment_snapshots(client_id);
