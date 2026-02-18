
-- Create update_updated_at_column function if not exists
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create user_assessments table
CREATE TABLE public.user_assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  answers JSONB DEFAULT '{}'::jsonb,
  gates JSONB DEFAULT '{}'::jsonb,
  recommendations JSONB DEFAULT '{}'::jsonb,
  status TEXT NOT NULL DEFAULT 'in_progress',
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ
);

ALTER TABLE public.user_assessments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own assessments"
  ON public.user_assessments FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own assessments"
  ON public.user_assessments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own assessments"
  ON public.user_assessments FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own assessments"
  ON public.user_assessments FOR DELETE
  USING (auth.uid() = user_id);

CREATE TRIGGER update_user_assessments_updated_at
  BEFORE UPDATE ON public.user_assessments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
