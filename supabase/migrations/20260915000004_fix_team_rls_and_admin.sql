-- NutriBake Database: Team Table RLS & Admin Policies
-- Migration: 20260915000004_fix_team_rls_and_admin.sql
-- Description: Ensures RLS policies on public.team allow public SELECT and restrict mutations to privileged service_role or authenticated administrators.

-- 1. Ensure RLS is active on public.team
ALTER TABLE public.team ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing policies to prevent conflicts
DROP POLICY IF EXISTS "Public read team" ON public.team;
DROP POLICY IF EXISTS "Admins manage team" ON public.team;
DROP POLICY IF EXISTS "Allow team modifications" ON public.team;

-- 3. Public read policy (All visitors can read About Me / Team members)
CREATE POLICY "Public read team" ON public.team
  FOR SELECT USING (true);

-- 4. Admin management policy
-- Allows mutations ONLY from privileged service_role (server-side with SUPABASE_SECRET_KEY)
-- or from authenticated admin users via public.is_admin()
CREATE POLICY "Admins manage team" ON public.team
  FOR ALL USING (
    auth.role() = 'service_role' OR public.is_admin()
  )
  WITH CHECK (
    auth.role() = 'service_role' OR public.is_admin()
  );

-- 5. Ensure public.is_admin() helper function is defined as SECURITY DEFINER
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

