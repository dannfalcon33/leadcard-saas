import { createClient } from "@/utils/supabase/server";
import PublicForm from "@/app/components/PublicForm";
import { notFound } from "next/navigation";

export const runtime = "edge";

// Esto le dice a Next.js que esta página es dinámica y no debe cachearse estáticamente
export const dynamic = "force-dynamic";

export default async function UserLandingPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const supabase = await createClient();
  const { username } = await params;

  // 1. Buscamos el ID del usuario basado en el username de la URL
  const { data: profile } = await supabase
    .from("profiles")
    .select("id, full_name, avatar_url")
    .eq("username", username)
    .single();

  if (!profile) return notFound(); // Si no existe el usuario -> 404

  // 2. Buscamos su proyecto activo
  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("user_id", profile.id)
    .single();

  if (!project) return notFound();

  // 3. REGISTRAR VISITA (Server Side Logic)
  // Insertamos sin esperar respuesta (fire and forget) para no bloquear la carga
  await supabase.from("visits").insert({ project_id: project.id });

  // Extraemos configuración visual
  const theme = (project.theme_config as any) || { primary: "#3b82f6" };
  const fields = (project.form_fields as string[]) || ["email"];

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Fondo decorativo (Blur) */}
      <div
        className="absolute w-[500px] h-[500px] rounded-full blur-[120px] opacity-20 pointer-events-none"
        style={{ backgroundColor: theme.primary }}
      />

      {/* TARJETA PRINCIPAL */}
      <main className="relative z-10 w-full max-w-md bg-black/40 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl animate-fade-in-up">
        {/* Avatar */}
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 rounded-full border-4 border-black shadow-xl overflow-hidden bg-gray-800">
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.full_name || username}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-3xl">
                👤
              </div>
            )}
          </div>
        </div>

        {/* Textos */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">{project.title}</h1>
          <p className="text-gray-400 leading-relaxed">{project.description}</p>
        </div>

        {/* Formulario (Cliente) */}
        <PublicForm
          projectId={project.id}
          ownerId={profile.id}
          fields={fields}
          themeColor={theme.primary}
          buttonText={theme.button_text}
        />

        {/* Footer pequeño */}
        <div className="mt-8 text-center">
          <a
            href="/"
            className="text-xs text-gray-600 hover:text-gray-400 transition"
          >
            Hecho con LeadCard ⚡
          </a>
        </div>
      </main>
    </div>
  );
}
