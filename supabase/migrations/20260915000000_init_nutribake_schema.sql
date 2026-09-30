-- NutriBake Supabase Database Schema Migration
-- Migration: 20260915000000_init_nutribake_schema.sql
-- Description: Complete schema for products, profiles, daily intake logs, sample trial orders, sensory trials, tasting notes, family profiles, and alerts.

-- 1. Create Products Table
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('cupcakes', 'cookies', 'nutriballs')),
  tagline TEXT,
  description TEXT,
  why_this_product TEXT,
  nutrition_score INTEGER DEFAULT 90,
  nutrition JSONB NOT NULL DEFAULT '{}'::jsonb,
  main_functional_ingredient TEXT,
  all_ingredients JSONB NOT NULL DEFAULT '[]'::jsonb,
  functional_ingredients JSONB NOT NULL DEFAULT '[]'::jsonb,
  allergens JSONB NOT NULL DEFAULT '[]'::jsonb,
  dietary_tags JSONB NOT NULL DEFAULT '[]'::jsonb,
  sensory_scores JSONB NOT NULL DEFAULT '{}'::jsonb,
  serving_size TEXT,
  portion_size TEXT,
  net_weight TEXT,
  price_pkr NUMERIC,
  shelf_life TEXT,
  storage_instructions TEXT,
  allergen_information TEXT,
  cross_contamination TEXT,
  image_url TEXT,
  is_featured BOOLEAN DEFAULT false,
  child_friendly BOOLEAN DEFAULT false,
  batch_code TEXT,
  lab_status TEXT DEFAULT 'Approved' CHECK (lab_status IN ('Approved', 'Formulation Testing', 'Sensory Trial')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Create User Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  avatar TEXT,
  age_group TEXT,
  dietary_preference TEXT,
  saved_product_ids JSONB DEFAULT '[]'::jsonb,
  preferences JSONB DEFAULT '{"dailyFiberTargetGrams": 28, "dietaryGoal": "High Fiber & Gut Vitality", "allergens": []}'::jsonb,
  daily_fiber_goal_grams NUMERIC DEFAULT 28,
  current_fiber_intake_grams NUMERIC DEFAULT 0,
  recommendation_history_count INTEGER DEFAULT 0,
  member_since TEXT DEFAULT to_char(NOW(), 'Mon YYYY'),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Create Daily Intake Logs Table
CREATE TABLE IF NOT EXISTS public.daily_intake_logs (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id TEXT REFERENCES public.products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  portion_description TEXT,
  meal_time TEXT NOT NULL CHECK (meal_time IN ('breakfast', 'morning-snack', 'lunch', 'afternoon-snack', 'dinner')),
  servings NUMERIC NOT NULL DEFAULT 1,
  fiber_grams NUMERIC NOT NULL DEFAULT 0,
  resistant_starch_grams NUMERIC NOT NULL DEFAULT 0,
  calories NUMERIC NOT NULL DEFAULT 0,
  protein_grams NUMERIC NOT NULL DEFAULT 0,
  timestamp TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Create Sample Orders Table
CREATE TABLE IF NOT EXISTS public.sample_orders (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  order_number TEXT NOT NULL UNIQUE,
  date TEXT NOT NULL,
  recipient_name TEXT NOT NULL,
  email TEXT NOT NULL,
  address TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Pending Formulation' CHECK (status IN ('Pending Formulation', 'Lab Blended', 'Sensory Checked', 'Dispatched', 'Delivered')),
  trial_type TEXT NOT NULL CHECK (trial_type IN ('Clinical Study', 'Family Nutrition', 'Consumer Tasting', 'Academic Panel')),
  tracking_notes TEXT,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Create Sensory Trials Table
CREATE TABLE IF NOT EXISTS public.sensory_trials (
  id TEXT PRIMARY KEY,
  product_id TEXT,
  product_name TEXT NOT NULL,
  batch_code TEXT NOT NULL,
  panelist_name TEXT NOT NULL,
  panelist_type TEXT NOT NULL CHECK (panelist_type IN ('Trained Descriptive', 'Consumer Hedonic', 'Faculty Supervisor', 'Student Tester', 'Student Researcher')),
  date TEXT NOT NULL,
  taste NUMERIC NOT NULL CHECK (taste >= 0 AND taste <= 100),
  texture NUMERIC NOT NULL CHECK (texture >= 0 AND texture <= 100),
  aroma NUMERIC NOT NULL CHECK (aroma >= 0 AND aroma <= 100),
  appearance NUMERIC NOT NULL CHECK (appearance >= 0 AND appearance <= 100),
  overall_acceptability NUMERIC NOT NULL CHECK (overall_acceptability >= 0 AND overall_acceptability <= 100),
  hedonic_scale9 NUMERIC NOT NULL CHECK (hedonic_scale9 >= 1 AND hedonic_scale9 <= 9),
  panel_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Create Product Tasting Notes Table
CREATE TABLE IF NOT EXISTS public.product_tasting_notes (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  notes TEXT NOT NULL,
  date TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_user_product_note UNIQUE (user_id, product_id)
);

-- 7. Create Child & Family Profiles Table
CREATE TABLE IF NOT EXISTS public.family_profiles (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  age INTEGER NOT NULL,
  allergies JSONB DEFAULT '[]'::jsonb,
  favorite_products JSONB DEFAULT '[]'::jsonb,
  fiber_target INTEGER DEFAULT 25,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. Create Alerts & Notifications Table
CREATE TABLE IF NOT EXISTS public.alerts (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'info' CHECK (type IN ('info', 'success', 'nutrition-tip', 'batch-update')),
  date TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_intake_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sample_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sensory_trials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_tasting_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.family_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Public read products" ON public.products;
DROP POLICY IF EXISTS "Admins modify products" ON public.products;
DROP POLICY IF EXISTS "Users view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users manage own intake logs" ON public.daily_intake_logs;
DROP POLICY IF EXISTS "Users view own sample orders" ON public.sample_orders;
DROP POLICY IF EXISTS "Users insert sample orders" ON public.sample_orders;
DROP POLICY IF EXISTS "Admins manage sample orders" ON public.sample_orders;
DROP POLICY IF EXISTS "Public view sensory trials" ON public.sensory_trials;
DROP POLICY IF EXISTS "Admins insert sensory trials" ON public.sensory_trials;
DROP POLICY IF EXISTS "Users manage own tasting notes" ON public.product_tasting_notes;
DROP POLICY IF EXISTS "Users manage own family profiles" ON public.family_profiles;
DROP POLICY IF EXISTS "Users manage own alerts" ON public.alerts;

-- RLS Policies: Products
CREATE POLICY "Public read products" ON public.products
  FOR SELECT USING (true);

CREATE POLICY "Admins modify products" ON public.products
  FOR ALL USING (
    auth.role() = 'service_role' OR 
    EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

-- RLS Policies: Profiles
CREATE POLICY "Users view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id OR auth.role() = 'service_role');

CREATE POLICY "Users update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id OR auth.role() = 'service_role');

CREATE POLICY "Users insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id OR auth.role() = 'service_role');

CREATE POLICY "Admins view all profiles" ON public.profiles
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

-- RLS Policies: Daily Intake Logs
CREATE POLICY "Users manage own intake logs" ON public.daily_intake_logs
  FOR ALL USING (
    auth.uid() = user_id OR user_id IS NULL OR auth.role() = 'service_role'
  );

-- RLS Policies: Sample Orders
CREATE POLICY "Users view own sample orders" ON public.sample_orders
  FOR SELECT USING (
    auth.uid() = user_id OR user_id IS NULL OR auth.role() = 'service_role' OR
    EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

CREATE POLICY "Users insert sample orders" ON public.sample_orders
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins manage sample orders" ON public.sample_orders
  FOR ALL USING (
    auth.role() = 'service_role' OR
    EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

-- RLS Policies: Sensory Trials
CREATE POLICY "Public view sensory trials" ON public.sensory_trials
  FOR SELECT USING (true);

CREATE POLICY "Admins insert sensory trials" ON public.sensory_trials
  FOR ALL USING (
    auth.role() = 'service_role' OR
    auth.uid() IS NOT NULL
  );

-- RLS Policies: Product Tasting Notes
CREATE POLICY "Users manage own tasting notes" ON public.product_tasting_notes
  FOR ALL USING (
    auth.uid() = user_id OR user_id IS NULL OR auth.role() = 'service_role'
  );

-- RLS Policies: Family Profiles
CREATE POLICY "Users manage own family profiles" ON public.family_profiles
  FOR ALL USING (
    auth.uid() = user_id OR user_id IS NULL OR auth.role() = 'service_role'
  );

-- RLS Policies: Alerts
CREATE POLICY "Users manage own alerts" ON public.alerts
  FOR ALL USING (
    auth.uid() = user_id OR user_id IS NULL OR auth.role() = 'service_role'
  );

-- Function and trigger to auto-create profile upon auth.users signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'user')
  )
  ON CONFLICT (id) DO UPDATE
  SET email = EXCLUDED.email,
      name = COALESCE(EXCLUDED.name, public.profiles.name),
      updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
