ALTER TABLE public.assessment_snapshots
  ADD COLUMN IF NOT EXISTS answers JSONB DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS gates JSONB DEFAULT '{}'::jsonb;