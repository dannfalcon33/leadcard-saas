-- 1. TABLA DE PERFILES (Usuarios del Admin)
-- Se vincula automáticamente con los usuarios de Supabase Auth
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  username text unique,
  full_name text,
  avatar_url text,
  updated_at timestamp with time zone,
  
  constraint username_length check (char_length(username) >= 3)
);

-- 2. TABLA DE PROYECTOS (Las Landing Pages)
-- Cada usuario tiene sus proyectos (o landing única)
create table public.projects (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  
  -- Configuración visual y de contenido
  title text default 'Mi Landing Page',
  description text,
  bg_image_url text,
  
  -- JSONB para flexibilidad total (Colores, Fuentes, Layout)
  theme_config jsonb default '{"primary": "#3b82f6", "font": "Inter", "layout": "card"}'::jsonb,
  
  -- JSONB para definir qué campos pedir en el formulario (ej: ["email", "whatsapp"])
  form_fields jsonb default '["nombre", "email"]'::jsonb,
  
  social_links jsonb default '[]'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. TABLA DE LEADS (Datos captados)
create table public.leads (
  id uuid default gen_random_uuid() primary key,
  project_id uuid references public.projects(id) on delete cascade not null,
  
  -- Truco PRO: Guardamos el user_id también para facilitar las reglas de seguridad (RLS)
  -- Así no tenemos que hacer joins complejos para saber si eres dueño del lead.
  owner_id uuid references public.profiles(id) on delete cascade not null,
  
  -- Aquí guardamos lo que el usuario envió (ej: { "email": "juan@test.com", "nombre": "Juan" })
  data jsonb not null,
  
  status text default 'new', -- new, contacted, archived
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- --- SEGURIDAD (ROW LEVEL SECURITY) ---
-- Esto es CRÍTICO: Define quién puede ver y editar qué.

alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.leads enable row level security;

-- POLÍTICAS PARA PERFILES
create policy "Perfiles visibles públicamente" 
  on public.profiles for select using ( true );

create policy "Usuarios pueden editar su propio perfil" 
  on public.profiles for update using ( auth.uid() = id );

-- POLÍTICAS PARA PROYECTOS
create policy "Cualquiera puede ver proyectos (para la landing pública)" 
  on public.projects for select using ( true );

create policy "Usuarios pueden crear proyectos" 
  on public.projects for insert with check ( auth.uid() = user_id );

create policy "Usuarios pueden editar SUS proyectos" 
  on public.projects for update using ( auth.uid() = user_id );

create policy "Usuarios pueden borrar SUS proyectos" 
  on public.projects for delete using ( auth.uid() = user_id );

-- POLÍTICAS PARA LEADS (La parte más sensible)
create policy "Cualquiera puede CREAR un lead (Formulario Público)" 
  on public.leads for insert with check ( true );

create policy "SOLO el dueño puede VER los leads" 
  on public.leads for select using ( auth.uid() = owner_id );

-- --- AUTOMATIZACIÓN (Trigger) ---
-- Esto crea automáticamente un perfil en la tabla 'profiles' cuando alguien se registra.

create function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, full_name, username)
  values (
    new.id, 
    new.raw_user_meta_data->>'full_name',
    -- Usamos el email como username temporal si no provee uno
    split_part(new.email, '@', 1) 
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();