"use client";

import { createClient } from "@/utils/supabase/client";
import { useState, useEffect } from "react";

interface Project {
  id: string;
  title: string;
  description: string;
  theme_config: {
    primary?: string;
    button_text?: string;
    [key: string]: any;
  };
}

export default function ProjectEditor({
  project,
  username,
}: {
  project: Project;
  username: string;
}) {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);

  // Estado local para el formulario (inicializado con los datos de la DB)
  const [formData, setFormData] = useState({
    title: project.title || "Mi Tarjeta Digital",
    description:
      project.description || "Hola, contáctame para servicios de desarrollo.",
    theme_color: project.theme_config?.primary || "#3b82f6", // Azul por defecto
    button_text: project.theme_config?.button_text || "Contactar Ahora",
  });

  const handleSave = async () => {
    setLoading(true);
    const { error } = await supabase
      .from("projects")
      .update({
        title: formData.title,
        description: formData.description,
        // Guardamos la config visual en el JSONB
        theme_config: {
          ...project.theme_config,
          primary: formData.theme_color,
          button_text: formData.button_text,
        },
      })
      .eq("id", project.id);

    if (error) alert("Error guardando: " + error.message);
    else alert("¡Cambios guardados correctamente!");
    setLoading(false);
  };

  const [origin, setOrigin] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
    }
  }, []);

  // URL pública de su landing
  const publicUrl = origin ? `${origin}/${username}` : "";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* COLUMNA IZQUIERDA: EL EDITOR */}
      <div className="bg-white/5 border border-white/10 p-6 rounded-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Editar Contenido</h2>
          <a
            href="/dashboard"
            className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1 rounded transition text-gray-300"
          >
            ← Volver
          </a>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Título Principal
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full bg-black/50 border border-white/10 p-2 rounded text-white"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Descripción (Bio)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
              className="w-full bg-black/50 border border-white/10 p-2 rounded text-white"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Color del Tema
            </label>
            <div className="flex gap-2">
              <input
                type="color"
                value={formData.theme_color}
                onChange={(e) =>
                  setFormData({ ...formData, theme_color: e.target.value })
                }
                className="h-10 w-20 cursor-pointer"
              />
              <span className="text-xs self-center text-gray-500">
                Elige el color de tus botones
              </span>
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded transition"
          >
            {loading ? "Guardando..." : "Guardar Cambios"}
          </button>
        </div>
      </div>

      {/* COLUMNA DERECHA: VISTA PREVIA & LINKS */}
      <div className="space-y-6">
        <div className="bg-gradient-to-br from-gray-900 to-black p-6 rounded-xl border border-white/10 text-center">
          <h3 className="text-gray-400 text-sm uppercase tracking-widest mb-2">
            Tu Enlace Público
          </h3>
          <div className="bg-black/40 p-3 rounded mb-3 font-mono text-sm truncate text-blue-400">
            {publicUrl}
          </div>
          <a
            href={`/${username}`}
            target="_blank"
            className="text-sm text-white underline hover:text-blue-300"
          >
            Ver Landing en vivo &rarr;
          </a>
        </div>

        {/* PREVISUALIZACIÓN SIMULADA (MÓVIL) */}
        <div className="border border-white/10 rounded-3xl p-4 max-w-[300px] mx-auto bg-black aspect-[9/16] relative overflow-hidden shadow-2xl">
          {/* Aquí simulamos cómo se ve la landing */}
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-16 h-16 bg-gray-700 rounded-full mb-4"></div>
            <h2 className="font-bold text-lg leading-tight">
              {formData.title}
            </h2>
            <p className="text-xs text-gray-400 mt-2">{formData.description}</p>
            <button
              className="mt-6 w-full py-2 rounded text-xs font-bold"
              style={{ backgroundColor: formData.theme_color }}
            >
              {formData.button_text}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
