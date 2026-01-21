import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import ProjectEditor from "./ProjectEditor";
import LeadsTable from "./LeadsTable"; // Importamos la tabla
import { revalidatePath } from "next/cache";

export const runtime = "edge";

export default async function Dashboard() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/");

  // 1. Obtener Perfil
  const { data: profile } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", user.id)
    .single();

  // 2. Obtener Proyecto
  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("user_id", user.id)
    .single();

  // 3. Obtener Métricas y Leads (Solo si existe proyecto)
  let visitCount = 0;
  let leads = [];

  if (project) {
    // Contar visitas
    const { count } = await supabase
      .from("visits")
      .select("*", { count: "exact", head: true })
      .eq("project_id", project.id);
    visitCount = count || 0;

    // Traer leads
    const { data: leadsData } = await supabase
      .from("leads")
      .select("*")
      .eq("project_id", project.id)
      .order("created_at", { ascending: false });
    leads = leadsData || [];
  }

  // ACTION: Crear Proyecto
  async function createProject() {
    "use server";
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    await supabase.from("projects").insert({
      user_id: user?.id,
      title: "Mi Nuevo Proyecto",
      description: "Edita esto en el dashboard",
      theme_config: { primary: "#3b82f6" },
      form_fields: ["nombre", "email"],
    });
    revalidatePath("/dashboard");
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      {/* HEADER */}
      <header className="flex justify-between items-center mb-10 border-b border-white/10 pb-4">
        <div>
          <h1 className="text-3xl font-bold">Panel de Control</h1>
          <p className="text-gray-400">Bienvenido, {profile?.username}</p>
        </div>
        <form action="/auth/signout" method="post">
          <button className="text-xs text-red-400 hover:underline">
            Cerrar Sesión
          </button>
        </form>
      </header>

      {project ? (
        <div className="space-y-10">
          {/* SECCIÓN 1: MÉTRICAS (KPIs) */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-900/20 border border-blue-500/20 p-6 rounded-xl">
              <h3 className="text-blue-400 text-sm uppercase font-bold mb-1">
                Visitas Totales
              </h3>
              <p className="text-4xl font-bold">{visitCount}</p>
            </div>
            <div className="bg-purple-900/20 border border-purple-500/20 p-6 rounded-xl">
              <h3 className="text-purple-400 text-sm uppercase font-bold mb-1">
                Leads Captados
              </h3>
              <p className="text-4xl font-bold">{leads.length}</p>
            </div>
          </div>

          {/* SECCIÓN 2: EDITOR */}
          <ProjectEditor
            project={project}
            username={profile?.username || "user"}
          />

          {/* SECCIÓN 3: LISTA DE LEADS */}
          <LeadsTable leads={leads} />
        </div>
      ) : (
        // ESTADO VACÍO (Create Project)
        <div className="flex flex-col items-center justify-center py-20 bg-white/5 rounded-xl border border-white/10 border-dashed">
          <div className="text-6xl mb-4">🚀</div>
          <h2 className="text-2xl font-bold mb-2">Comienza tu LeadCard</h2>
          <p className="text-gray-400 mb-6 max-w-md text-center">
            Crea tu primera landing page para empezar a medir resultados.
          </p>
          <form action={createProject}>
            <button
              type="submit"
              className="bg-white text-black font-bold py-3 px-8 rounded-full hover:bg-gray-200 transition"
            >
              + Crear mi Landing Page
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
