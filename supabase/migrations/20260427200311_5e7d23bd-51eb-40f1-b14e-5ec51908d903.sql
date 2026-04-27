REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM authenticated;

REVOKE EXECUTE ON FUNCTION public.assign_admin_on_signup() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.assign_admin_on_signup() FROM anon;
REVOKE EXECUTE ON FUNCTION public.assign_admin_on_signup() FROM authenticated;

REVOKE EXECUTE ON FUNCTION public.validate_assessment_client_owner() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.validate_assessment_client_owner() FROM anon;
REVOKE EXECUTE ON FUNCTION public.validate_assessment_client_owner() FROM authenticated;

REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated;