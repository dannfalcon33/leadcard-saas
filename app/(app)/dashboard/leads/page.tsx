import { auth } from "@/utils/auth/server";
import { getProjectByUserId, getLeads } from "@/utils/db-service";
import { redirect } from "next/navigation";
import LeadsTable from "../LeadsTable";

export const dynamic = "force-dynamic";

export default async function LeadsPage() {
  const { data: session } = await auth.getSession();
  if (!session?.user) redirect("/");

  const project = await getProjectByUserId(session.user.id);
  let leads: any[] = [];

  if (project) {
    leads = await getLeads(project.id, 100);
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Mis Leads</h1>
          <p className="text-gray-400">Gestiona los contactos captados.</p>
        </div>
        <button className="bg-green-600 hover:bg-green-500 text-white text-sm font-bold py-2 px-4 rounded-lg transition cursor-pointer">
          Descargar Excel
        </button>
      </div>

      <LeadsTable leads={leads} />
    </div>
  );
}
