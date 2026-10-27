"use client";

import { authClient } from "@/utils/auth/client";
import { useState } from "react";
import BackgroundShapes from "./BackgroundShapes";
import { useRouter } from "next/navigation";

export default function CTASection() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    setErrorMsg(null);

    try {
      const { error } = await authClient.signUp.email({
        email,
        password,
        name: email.split("@")[0],
        callbackURL: "/dashboard",
      });
      if (error) throw new Error(error.message || "Error al crear tu cuenta");
      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative py-24 px-4 overflow-hidden text-center bg-gray-900/10">
      <BackgroundShapes />

      <div className="max-w-4xl mx-auto relative z-10">
        <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">
          ¿Listo para potenciar tu marca?
        </h2>
        <p className="text-lg md:text-xl text-indigo-200 mb-10 max-w-2xl mx-auto">
          Únete a profesionales que ya usan LeadCard con Neon para captar leads y analizar métricas.
        </p>

        {/* Auth Form */}
        <div className="max-w-md mx-auto w-full bg-gray-950/70 border border-gray-800 p-6 rounded-2xl shadow-xl backdrop-blur-md text-left">
          {errorMsg && (
            <div className="mb-4 p-3 text-xs bg-red-950/60 border border-red-800/80 rounded-lg text-red-300">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSignUp} className="space-y-3">
            <input
              type="email"
              placeholder="tu@email.com"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3.5 rounded-xl bg-gray-900/80 border border-gray-800 text-white focus:border-indigo-500 outline-none transition text-sm placeholder:text-gray-600"
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3.5 rounded-xl bg-gray-900/80 border border-gray-800 text-white focus:border-indigo-500 outline-none transition text-sm placeholder:text-gray-600"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-3.5 rounded-xl font-bold hover:bg-indigo-500 transition disabled:opacity-50 shadow-lg shadow-indigo-600/20 active:scale-98 cursor-pointer text-sm"
            >
              {loading ? "Creando..." : "Crear mi LeadCard"}
            </button>
          </form>
          <p className="text-xs text-indigo-300/80 mt-4 text-center">
            Prueba gratuita. Desarrollado sobre Neon Lakebase Postgres.
          </p>
        </div>
      </div>
    </section>
  );
}
