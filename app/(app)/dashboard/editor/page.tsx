import { auth } from "@/utils/auth/server";
import { getProjectByUserId, getProfileByUserId, ensureProfile } from "@/utils/db-service";
import { redirect } from "next/navigation";
import ProjectEditor from "../ProjectEditor";
import { PublicLinkBox } from "@/app/components/Dashboard/PublicLinkBox";

export const dynamic = "force-dynamic";

export default async function EditorPage() {
  const { data: session } = await auth.getSession();
  if (!session?.user) redirect("/");

  const project = await getProjectByUserId(session.user.id);
  let profile = await getProfileByUserId(session.user.id);
  if (!profile) {
    profile = await ensureProfile(session.user.id, session.user.email, session.user.name);
  }

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

      <PublicLinkBox username={profile?.username || "user"} />

      <div className="grid grid-cols-1 gap-8">
        <ProjectEditor
          project={project}
          username={profile?.username || "user"}
        />
      </div>
    </div>
  );
}
