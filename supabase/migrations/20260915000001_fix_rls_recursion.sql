-- NutriBake Database RLS Policy Optimization
-- Migration: 20260915000001_fix_rls_recursion.sql
-- Description: Fixes infinite recursion in RLS policies for profiles, products, and sample_orders using a SECURITY DEFINER helper function.

-- 1. Helper function to check if current user is admin without triggering RLS recursion
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- 2. Drop recursive policies
DROP POLICY IF EXISTS "Admins view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins modify products" ON public.products;
DROP POLICY IF EXISTS "Users view own sample orders" ON public.sample_orders;
DROP POLICY IF EXISTS "Admins manage sample orders" ON public.sample_orders;

-- 3. Re-create non-recursive policies on profiles
CREATE POLICY "Admins view all profiles" ON public.profiles
  FOR SELECT USING (
    auth.role() = 'service_role' OR public.is_admin()
  );

-- 4. Re-create non-recursive policies on products
CREATE POLICY "Admins modify products" ON public.products
  FOR ALL USING (
    auth.role() = 'service_role' OR public.is_admin()
  );

-- 5. Re-create non-recursive policies on sample_orders
CREATE POLICY "Users view own sample orders" ON public.sample_orders
  FOR SELECT USING (
    auth.uid() = user_id OR user_id IS NULL OR auth.role() = 'service_role' OR public.is_admin()
  );

CREATE POLICY "Admins manage sample orders" ON public.sample_orders
  FOR ALL USING (
    auth.role() = 'service_role' OR public.is_admin()
  );
