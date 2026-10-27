-- =========================================================
-- LeadCard - Neon Lakebase Postgres Schema (leadcardsdb)
-- =========================================================

-- 1. TABLA DE PERFILES
CREATE TABLE IF NOT EXISTS public.profiles (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  
  CONSTRAINT username_length CHECK (char_length(username) >= 3)
);

-- 2. TABLA DE PROYECTOS (Landing Pages)
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  
  -- Configuración visual y de contenido
  title TEXT DEFAULT 'Mi Landing Page',
  description TEXT,
  bg_image_url TEXT,
  
  -- JSONB para personalización visual y campos de formulario
  theme_config JSONB DEFAULT '{"primary": "#3b82f6", "font": "Inter", "layout": "card"}'::jsonb,
  form_fields JSONB DEFAULT '["nombre", "email"]'::jsonb,
  social_links JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. TABLA DE LEADS (Contactos captados)
CREATE TABLE IF NOT EXISTS public.leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  owner_id TEXT NOT NULL,
  data JSONB NOT NULL,
  status TEXT DEFAULT 'new', -- new, contacted, archived
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. TABLA DE VISITAS (Analítica)
CREATE TABLE IF NOT EXISTS public.visits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Índices de optimización de consultas
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON public.projects(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(username);
CREATE INDEX IF NOT EXISTS idx_leads_project_id ON public.leads(project_id);
CREATE INDEX IF NOT EXISTS idx_leads_owner_id ON public.leads(owner_id);
CREATE INDEX IF NOT EXISTS idx_visits_project_id ON public.visits(project_id);
CREATE INDEX IF NOT EXISTS idx_visits_created_at ON public.visits(created_at);
