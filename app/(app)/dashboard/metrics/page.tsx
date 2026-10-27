import { auth } from "@/utils/auth/server";
import { getProjectByUserId } from "@/utils/db-service";
import { redirect } from "next/navigation";
import { VisitsChart } from "@/app/components/Dashboard/VisitsChart";
import { LeadsPieChart } from "@/app/components/Dashboard/LeadsPieChart";

export const dynamic = "force-dynamic";

export default async function MetricsPage() {
  const { data: session } = await auth.getSession();
  if (!session?.user) redirect("/");

  const project = await getProjectByUserId(session.user.id);

  if (!project) {
    return (
      <div className="text-gray-400 text-center py-20">
        Debes crear un proyecto primero para ver métricas.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Métricas</h1>
        <p className="text-gray-400">
          Analiza el rendimiento de tu Landing Page en tiempo real.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-[#111827] border border-gray-800 p-6 rounded-2xl">
          <h3 className="text-gray-200 font-bold mb-6">Tendencia de Visitas</h3>
          <VisitsChart projectId={project.id} />
        </div>

        <div className="bg-[#111827] border border-gray-800 p-6 rounded-2xl">
          <h3 className="text-gray-200 font-bold mb-6">Conversión de Leads</h3>
          <LeadsPieChart />
        </div>
      </div>
    </div>
  );
}
