REVOKE EXECUTE ON FUNCTION public.validate_assessment_client_owner() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.validate_assessment_client_owner() FROM authenticated;
REVOKE EXECUTE ON FUNCTION public.validate_assessment_client_owner() FROM anon;