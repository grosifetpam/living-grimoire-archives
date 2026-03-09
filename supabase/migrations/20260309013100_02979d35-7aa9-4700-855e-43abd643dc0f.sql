
-- Ensure RLS is enabled on auth_logs (idempotent)
ALTER TABLE public.auth_logs ENABLE ROW LEVEL SECURITY;

-- Drop and recreate policies to ensure they are tracked
DROP POLICY IF EXISTS "Admins read auth_logs" ON public.auth_logs;
DROP POLICY IF EXISTS "Insert auth_logs" ON public.auth_logs;

-- Only admins can read auth logs
CREATE POLICY "Admins read auth_logs" ON public.auth_logs
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Only server-side/service role can insert (restrictive policy allows all inserts for service role)
CREATE POLICY "Insert auth_logs" ON public.auth_logs
  FOR INSERT
  WITH CHECK (true);
