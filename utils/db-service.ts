import { sql } from './db';

export interface Profile {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  updated_at: string;
}

export interface Project {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  bg_image_url: string | null;
  theme_config: {
    primary?: string;
    font?: string;
    layout?: string;
    button_text?: string;
    [key: string]: any;
  };
  form_fields: string[];
  social_links: any[];
  created_at: string;
}

export interface Lead {
  id: string;
  project_id: string;
  owner_id: string;
  data: Record<string, any>;
  status: string;
  created_at: string;
}

// -----------------------------------------------------------------------------
// PROFILES
// -----------------------------------------------------------------------------

export async function getProfileByUsername(username: string): Promise<Profile | null> {
  const rows = await sql`
    SELECT id, username, full_name, avatar_url, updated_at
    FROM public.profiles
    WHERE username = ${username}
    LIMIT 1;
  `;
  return (rows[0] as Profile) || null;
}

export async function getProfileByUserId(userId: string): Promise<Profile | null> {
  const rows = await sql`
    SELECT id, username, full_name, avatar_url, updated_at
    FROM public.profiles
    WHERE id = ${userId}
    LIMIT 1;
  `;
  return (rows[0] as Profile) || null;
}

export async function ensureProfile(userId: string, email: string, name?: string | null): Promise<Profile> {
  const defaultUsername = email.split('@')[0].toLowerCase().replace(/[^a-z0-9_-]/g, '') || `user${Date.now().toString().slice(-4)}`;
  
  const rows = await sql`
    INSERT INTO public.profiles (id, username, full_name)
    VALUES (${userId}, ${defaultUsername}, ${name || defaultUsername})
    ON CONFLICT (id) DO UPDATE 
    SET updated_at = now()
    RETURNING id, username, full_name, avatar_url, updated_at;
  `;
  return rows[0] as Profile;
}

// -----------------------------------------------------------------------------
// PROJECTS
// -----------------------------------------------------------------------------

export async function getProjectByUserId(userId: string): Promise<Project | null> {
  const rows = await sql`
    SELECT id, user_id, title, description, bg_image_url, theme_config, form_fields, social_links, created_at
    FROM public.projects
    WHERE user_id = ${userId}
    LIMIT 1;
  `;
  return (rows[0] as Project) || null;
}

export async function getProjectById(projectId: string): Promise<Project | null> {
  const rows = await sql`
    SELECT id, user_id, title, description, bg_image_url, theme_config, form_fields, social_links, created_at
    FROM public.projects
    WHERE id = ${projectId}
    LIMIT 1;
  `;
  return (rows[0] as Project) || null;
}

export async function createProjectForUser(userId: string, title = "Mi Nuevo Proyecto", description = "Edita esto en el dashboard"): Promise<Project> {
  const rows = await sql`
    INSERT INTO public.projects (
      user_id, 
      title, 
      description, 
      theme_config, 
      form_fields
    ) VALUES (
      ${userId},
      ${title},
      ${description},
      ${JSON.stringify({ primary: "#3b82f6", font: "Inter", layout: "card" })},
      ${JSON.stringify(["nombre", "email"])}
    )
    RETURNING id, user_id, title, description, bg_image_url, theme_config, form_fields, social_links, created_at;
  `;
  return rows[0] as Project;
}

export async function updateProject(
  projectId: string, 
  userId: string, 
  data: {
    title: string;
    description: string;
    theme_config: any;
  }
): Promise<Project | null> {
  const rows = await sql`
    UPDATE public.projects
    SET 
      title = ${data.title},
      description = ${data.description},
      theme_config = ${JSON.stringify(data.theme_config)}
    WHERE id = ${projectId} AND user_id = ${userId}
    RETURNING id, user_id, title, description, bg_image_url, theme_config, form_fields, social_links, created_at;
  `;
  return (rows[0] as Project) || null;
}

// -----------------------------------------------------------------------------
// LEADS
// -----------------------------------------------------------------------------

export async function createLead(projectId: string, ownerId: string, data: Record<string, any>): Promise<Lead> {
  const rows = await sql`
    INSERT INTO public.leads (project_id, owner_id, data)
    VALUES (${projectId}, ${ownerId}, ${JSON.stringify(data)})
    RETURNING id, project_id, owner_id, data, status, created_at;
  `;
  return rows[0] as Lead;
}

export async function getLeads(projectId: string, limit = 50): Promise<Lead[]> {
  const rows = await sql`
    SELECT id, project_id, owner_id, data, status, created_at
    FROM public.leads
    WHERE project_id = ${projectId}
    ORDER BY created_at DESC
    LIMIT ${limit};
  `;
  return rows as Lead[];
}

export async function getLeadsCount(projectId: string): Promise<number> {
  const rows = await sql`
    SELECT COUNT(*)::int as count
    FROM public.leads
    WHERE project_id = ${projectId};
  `;
  return rows[0]?.count || 0;
}

// -----------------------------------------------------------------------------
// VISITS & METRICS
// -----------------------------------------------------------------------------

export async function recordVisit(projectId: string): Promise<void> {
  await sql`
    INSERT INTO public.visits (project_id)
    VALUES (${projectId});
  `;
}

export async function getTotalVisits(projectId: string): Promise<number> {
  const rows = await sql`
    SELECT COUNT(*)::int as count
    FROM public.visits
    WHERE project_id = ${projectId};
  `;
  return rows[0]?.count || 0;
}

export async function getDailyVisits(projectId: string, days = 7): Promise<{ name: string; value: number; fullDate: string }[]> {
  const rows = await sql`
    SELECT 
      to_char(created_at, 'YYYY-MM-DD') as day,
      COUNT(*)::int as count
    FROM public.visits
    WHERE project_id = ${projectId} 
      AND created_at >= (NOW() - (${days} || ' days')::interval)
    GROUP BY day
    ORDER BY day ASC;
  `;

  const countsMap = new Map<string, number>();
  for (const row of rows) {
    countsMap.set(row.day, row.count);
  }

  // Ensure every day in the window is represented
  const result: { name: string; value: number; fullDate: string }[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const count = countsMap.get(dateStr) || 0;
    const name = d.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' });
    result.push({ name, value: count, fullDate: dateStr });
  }

  return result;
}
