import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import LeadsTable from "../LeadsTable";

export const runtime = "edge";

export default async function LeadsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/");

  const { data: project } = await supabase
    .from("projects")
    .select("id")
    .eq("user_id", user.id)
    .single();

  let leads = [];

  if (project) {
    const { data: leadsData } = await supabase
      .from("leads")
      .select("*")
      .eq("project_id", project.id)
      .order("created_at", { ascending: false });
    leads = leadsData || [];
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Mis Leads</h1>
          <p className="text-gray-400">Gestiona los contactos captados.</p>
        </div>
        <button className="bg-green-600 hover:bg-green-500 text-white text-sm font-bold py-2 px-4 rounded-lg transition">
          Descargar Excel
        </button>
      </div>

      <LeadsTable leads={leads} />
    </div>
  );
}
