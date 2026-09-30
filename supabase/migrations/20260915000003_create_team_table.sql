-- NutriBake Database: Team Table Migration
-- Migration: 20260915000003_create_team_table.sql
-- Description: Create team table for About Me / team profiles (Text/data only, no images).

CREATE TABLE IF NOT EXISTS public.team (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  bio TEXT NOT NULL,
  department TEXT NOT NULL DEFAULT 'Department of Software Engineering',
  sub_role TEXT,
  id_number TEXT,
  institution TEXT DEFAULT 'University of Sindh, Jamshoro',
  expertise JSONB DEFAULT '[]'::jsonb,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.team ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Public read team" ON public.team;
DROP POLICY IF EXISTS "Admins manage team" ON public.team;

-- Public can read all team members (for the About page)
CREATE POLICY "Public read team" ON public.team
  FOR SELECT USING (true);

-- Admins and service role can insert, update, delete
CREATE POLICY "Admins manage team" ON public.team
  FOR ALL USING (
    auth.role() = 'service_role' OR public.is_admin()
  );

-- Seed initial existing team members
INSERT INTO public.team (
  id, name, role, bio, department, sub_role, id_number, institution, expertise, display_order
) VALUES
(
  'team-abdul-hannan-memon',
  'Abdul Hannan Memon',
  'Group Leader | Frontend & Analyst',
  'Team coordination, UI/UX layout, navigation, and user experience.',
  'Department of Software Engineering',
  'Founder & CEO, IDH',
  '08/2K23/SWE',
  'University of Sindh, Jamshoro',
  '["Education", "Frontend UI/UX", "Python", "AI"]'::jsonb,
  1
),
(
  'team-ali-hassan-chand',
  'Ali Hassan Chand',
  'Tech Lead | Full-Stack Engineer',
  'Technical strategy, backend implementation, logic, and database systems.',
  'Department of Software Engineering',
  'Founder & CTO, MWI',
  '26/2K23/SWE',
  'University of Sindh, Jamshoro',
  '["Full-Stack Development", "System Architecture", "Project Management", "React", "Laravel"]'::jsonb,
  2
),
(
  'team-haris-ahmed-ansari',
  'Haris Ahmed Ansari',
  'Researcher | Key Documentation | Quality Assurance',
  'Functional food research, documentation, quality assurance, and system reliability.',
  'Department of Software Engineering',
  NULL,
  '63/2K23/SWE',
  'University of Sindh, Jamshoro',
  '["MERN Stack Development", "Software Testing & System Validation"]'::jsonb,
  3
),
(
  'team-aamna-siddiqui',
  'Aamna Siddiqui',
  'Student Researcher',
  'Functional ingredient selection and dietary optimization for targeted health requirements.',
  'Nutrition & Food Science Department',
  'Final-Year BS Nutrition & Food Science Student',
  NULL,
  'University of Sindh, Jamshoro',
  '["Therapeutic Formulations", "Macronutrient Balancing", "Nutritional Profiling"]'::jsonb,
  4
),
(
  'team-lydia-shaloom',
  'Lydia Shaloom',
  'Student Researcher',
  'Complete sensory testing panels, comparing taste, texture, aroma, and mouthfeel.',
  'Nutrition & Food Science Department',
  'Final-Year BS Nutrition & Food Science Student',
  NULL,
  'University of Sindh, Jamshoro',
  '["Sensory Evaluation", "Hedonic Scaling", "Flavour & Texture Optimization"]'::jsonb,
  5
),
(
  'team-noor-un-nisa',
  'Noor-un-Nisa',
  'Student Researcher',
  'Controlled laboratory trials, hygiene protocols, storage testing, and allergen mitigation.',
  'Nutrition & Food Science Department',
  'Final-Year BS Nutrition & Food Science Student',
  NULL,
  'University of Sindh, Jamshoro',
  '["Food Safety & Quality", "Shelf-Life Kinetics", "Safe Food Formulation"]'::jsonb,
  6
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  role = EXCLUDED.role,
  bio = EXCLUDED.bio,
  department = EXCLUDED.department,
  sub_role = EXCLUDED.sub_role,
  id_number = EXCLUDED.id_number,
  institution = EXCLUDED.institution,
  expertise = EXCLUDED.expertise,
  display_order = EXCLUDED.display_order,
  updated_at = NOW();
