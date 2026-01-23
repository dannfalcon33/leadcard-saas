import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import ProjectEditor from "../ProjectEditor";

export const runtime = "edge";

export default async function EditorPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/");

  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("user_id", user.id)
    .single();

  const { data: profile } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", user.id)
    .single();

  if (!project) {
    return (
      <div className="text-gray-400 text-center py-20">
        Crea un proyecto primero en el inicio.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">
          Editar Landing Page
        </h1>
        <p className="text-gray-400">
          Personaliza el contenido y diseño de tu tarjeta.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <ProjectEditor
          project={project}
          username={profile?.username || "user"}
        />
      </div>
    </div>
  );
}
