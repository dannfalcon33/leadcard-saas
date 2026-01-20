"use client";

import { createClient } from "@/utils/supabase/client";
import { useState } from "react";

interface Props {
  projectId: string;
  ownerId: string;
  fields: string[];
  themeColor: string;
  buttonText?: string;
}

export default function PublicForm({
  projectId,
  ownerId,
  fields,
  themeColor,
  buttonText,
}: Props) {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Estado dinámico para guardar los datos del formulario
  const [formData, setFormData] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from("leads").insert({
      project_id: projectId,
      owner_id: ownerId, // Vital para el RLS
      data: formData, // Guardamos el JSON completo
    });

    if (error) {
      alert("Error enviando datos: " + error.message);
    } else {
      setSuccess(true);
    }
    setLoading(false);
  };

  // Si ya envió, mostramos mensaje de éxito
  if (success) {
    return (
      <div className="text-center p-8 bg-green-500/10 border border-green-500/30 rounded-xl text-green-400">
        <h3 className="text-xl font-bold mb-2">¡Recibido! ✅</h3>
        <p>Tus datos han sido enviados correctamente.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-sm mx-auto">
      {fields.map((field) => (
        <div key={field}>
          <input
            required
            type={field === "email" ? "email" : "text"}
            placeholder={`Ingresa tu ${field}...`}
            className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-white/30 outline-none transition"
            onChange={(e) =>
              setFormData({ ...formData, [field]: e.target.value })
            }
          />
        </div>
      ))}

      <button
        type="submit"
        disabled={loading}
        style={{ backgroundColor: themeColor }}
        className="w-full p-4 rounded-xl font-bold text-white shadow-lg brightness-110 hover:brightness-125 transition disabled:opacity-50"
      >
        {loading ? "Enviando..." : buttonText || "Enviar Mis Datos"}
      </button>
    </form>
  );
}
