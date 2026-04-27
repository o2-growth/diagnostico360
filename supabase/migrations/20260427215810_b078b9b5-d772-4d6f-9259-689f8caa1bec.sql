CREATE POLICY "Users can update their own snapshots"
ON public.assessment_snapshots
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

DROP TRIGGER IF EXISTS validate_assessment_snapshots_client_owner ON public.assessment_snapshots;

CREATE TRIGGER validate_assessment_snapshots_client_owner
BEFORE INSERT OR UPDATE ON public.assessment_snapshots
FOR EACH ROW
EXECUTE FUNCTION public.validate_assessment_client_owner();