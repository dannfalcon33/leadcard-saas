import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { VisitsChart } from "@/app/components/Dashboard/VisitsChart";
import { LeadsPieChart } from "@/app/components/Dashboard/LeadsPieChart";
import { revalidatePath } from "next/cache";
import { PublicLinkBox } from "@/app/components/Dashboard/PublicLinkBox";

/* Helpers for UI */
function StatCard({
  title,
  value,
  sub,
  children,
}: {
  title: string;
  value: string | number;
  sub?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="bg-[#111827] border border-gray-800 p-6 rounded-2xl relative overflow-hidden">
      <div className="relative z-10">
        <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">
          {title}
        </h3>
        <p className="text-4xl font-bold text-white mb-1">{value}</p>
        {sub && <p className="text-gray-500 text-sm">{sub}</p>}
      </div>
      {children && (
        <div className="absolute right-0 bottom-0 top-0 w-1/2 opacity-30 pointer-events-none">
          {children}
        </div>
      )}
    </div>
  );
}

function SectionTitle({ title }: { title: string }) {
  return (
    <h2 className="text-lg font-bold text-white mb-6 border-l-4 border-blue-600 pl-3">
      {title}
    </h2>
  );
}

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
    .select("username, avatar_url")
    .eq("id", user.id)
    .single();

  // 2. Obtener Proyecto
  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("user_id", user.id)
    .single();

  // 3. Obtener Métricas y Leads
  let visitCount = 0;
  let leads = [];

  if (project) {
    // Contar visitas totales
    const { count } = await supabase
      .from("visits")
      .select("*", { count: "exact", head: true })
      .eq("project_id", project.id);
    visitCount = count || 0;

    // Traer leads recientes
    const { data: leadsData } = await supabase
      .from("leads")
      .select("*")
      .eq("project_id", project.id)
      .order("created_at", { ascending: false })
      .limit(5);
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

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-[#111827] rounded-xl border border-gray-800 border-dashed">
        <div className="text-6xl mb-4">🚀</div>
        <h2 className="text-2xl font-bold mb-2 text-white">
          Comienza tu LeadCard
        </h2>
        <p className="text-gray-400 mb-6 max-w-md text-center">
          Crea tu primera landing page para empezar a medir resultados.
        </p>
        <form action={createProject}>
          <button
            type="submit"
            className="bg-blue-600 text-white font-bold py-3 px-8 rounded-full hover:bg-blue-700 transition"
          >
            + Crear mi Landing Page
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="text-white">
      {/* Header */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">
            Panel de Control
          </h1>
          <p className="text-gray-400">
            Bienvenido, {profile?.username || "Usuario"}
          </p>
        </div>
        <div className="text-xs text-red-500 font-mono">
          Server Status: Online
        </div>
      </div>

      {/* Public Link Box */}
      {profile && profile.username && (
        <PublicLinkBox username={profile.username} />
      )}

      {/* Row 1: Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <StatCard title="Visitas Totales" value={visitCount}>
          {/* Visual decoration for Visits */}
          <div className="w-full h-full bg-gradient-to-t from-blue-500/20 to-transparent" />
        </StatCard>
        <StatCard title="Leads Captados" value={leads.length}>
          {/* Visual decoration for Leads */}
          <div className="flex items-end justify-end gap-1 h-full pb-6 pr-6 opacity-50">
            <div className="w-4 h-8 bg-purple-500 rounded-t"></div>
            <div className="w-4 h-12 bg-purple-500 rounded-t"></div>
            <div className="w-4 h-6 bg-purple-500 rounded-t"></div>
            <div className="w-4 h-10 bg-purple-500 rounded-t"></div>
          </div>
        </StatCard>
      </div>

      {/* Row 2: Charts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Main Chart */}
        <div className="md:col-span-2 bg-[#111827] border border-gray-800 p-6 rounded-2xl">
          <h3 className="text-gray-200 font-bold mb-6">Tendencia de Visitas</h3>
          <VisitsChart projectId={project.id} />
        </div>

        {/* Pie Chart */}
        <div className="bg-[#111827] border border-gray-800 p-6 rounded-2xl">
          <h3 className="text-gray-200 font-bold mb-6">Conversión de Leads</h3>
          <LeadsPieChart />
        </div>
      </div>

      {/* Row 4: Latest Leads Table */}
      <div className="bg-[#111827] border border-gray-800 rounded-2xl overflow-hidden">
        <div className="p-6 flex justify-between items-center border-b border-gray-800">
          <h3 className="text-gray-200 font-bold">Últimos Contactos</h3>
          <button className="text-xs bg-green-900/30 text-green-400 border border-green-900 px-3 py-1 rounded hover:bg-green-900/50 transition">
            Descargar CSV
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 uppercase bg-black/40">
              <tr>
                <th className="px-6 py-4 font-medium">Fecha</th>
                <th className="px-6 py-4 font-medium">Email</th>
                <th className="px-6 py-4 font-medium">Datos Importantes</th>
                <th className="px-6 py-4 font-medium text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {leads.length > 0 ? (
                leads.map((lead: any) => (
                  <tr key={lead.id} className="hover:bg-white/5 transition">
                    <td className="px-6 py-4 text-gray-400">
                      {new Date(lead.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-gray-300">
                      {(lead.data?.email as string) || "No email"}
                    </td>
                    <td className="px-6 py-4 text-gray-300">
                      <div className="flex items-center gap-2">
                        {(lead.data?.nombre as string) || "Anon"}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white px-3 py-1 rounded text-xs transition">
                        Contactar
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    No hay leads recientes.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
