"use client";

import { createClient } from "@/utils/supabase/client";
import { useState } from "react";

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

  return (
    <div className="bg-[#111827] border border-gray-800 p-6 rounded-2xl h-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-gray-200 font-bold">Editar Contenido</h3>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-xs text-gray-500 uppercase font-bold block mb-2">
            Título Principal
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className="w-full bg-black/50 border border-gray-700 p-3 rounded-lg text-gray-300 text-sm focus:border-blue-500 focus:outline-none transition-colors"
          />
        </div>

        <div>
          <label className="text-xs text-gray-500 uppercase font-bold block mb-2">
            Descripción (Bio)
          </label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            rows={3}
            className="w-full bg-black/50 border border-gray-700 p-3 rounded-lg text-gray-300 text-sm focus:border-blue-500 focus:outline-none transition-colors resize-none"
          />
        </div>

        <div>
          <label className="text-xs text-gray-500 uppercase font-bold block mb-2">
            Color del Tema
          </label>
          <div className="flex items-center gap-3">
            <div className="relative">
              <input
                type="color"
                value={formData.theme_color}
                onChange={(e) =>
                  setFormData({ ...formData, theme_color: e.target.value })
                }
                className="h-10 w-10 rounded-lg cursor-pointer border-0 p-0 overflow-hidden"
              />
              <div
                className="absolute inset-0 pointer-events-none rounded-lg border border-gray-700"
                style={{ backgroundColor: formData.theme_color }}
              />
            </div>
            <span className="text-xs text-gray-500">
              Elige el color de tus botones
            </span>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-lg transition mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Guardando..." : "Guardar Cambios"}
        </button>
      </div>
    </div>
  );
}
