"use client";

import { authClient } from "@/utils/auth/client";
import { useState } from "react";
import BackgroundShapes from "./BackgroundShapes";
import { useRouter } from "next/navigation";

export default function Hero() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    setErrorMsg(null);

    try {
      if (isSignUp) {
        const { error } = await authClient.signUp.email({
          email,
          password,
          name: email.split("@")[0],
          callbackURL: "/dashboard",
        });
        if (error) throw new Error(error.message || "Error creando cuenta");
      } else {
        const { error } = await authClient.signIn.email({
          email,
          password,
          callbackURL: "/dashboard",
        });
        if (error) throw new Error(error.message || "Credenciales incorrectas");
      }
      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: `${window.location.origin}/dashboard`,
      });
    } catch (err: any) {
      setErrorMsg(err.message);
      setLoading(false);
    }
  };

  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center text-center px-4 overflow-hidden">
      <BackgroundShapes />

      <div className="max-w-3xl space-y-8 relative z-10 py-16">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-indigo-500 drop-shadow-lg">
          Tu Landing Page, <br /> lista en segundos.
        </h1>
        <p className="text-xl text-indigo-200 max-w-xl mx-auto leading-relaxed">
          Crea tu tarjeta de presentación digital con Neon Lakebase Postgres, capta leads y analiza visitas en tiempo real.
        </p>

        {/* Auth Box */}
        <div className="mt-8 max-w-md mx-auto w-full bg-gray-950/70 border border-gray-800 p-6 rounded-2xl shadow-2xl backdrop-blur-md text-left">
          {errorMsg && (
            <div className="mb-4 p-3 text-xs bg-red-950/60 border border-red-800/80 rounded-lg text-red-300">
              {errorMsg}
            </div>
          )}

          {/* Social Google Button */}
          <button
            type="button"
            onClick={handleGoogleAuth}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-gray-700 bg-gray-900/90 text-white font-medium hover:bg-gray-800 transition shadow-sm cursor-pointer disabled:opacity-50"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            Continuar con Google
          </button>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#0B0E14] px-2 text-gray-500">O con tu correo</span>
            </div>
          </div>

          <form onSubmit={handleEmailAuth} className="space-y-3">
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
              {loading ? "Procesando..." : isSignUp ? "Crear Cuenta Gratis" : "Iniciar Sesión"}
            </button>
          </form>

          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setErrorMsg(null);
              }}
              className="text-xs text-indigo-400 hover:text-indigo-300 transition"
            >
              {isSignUp ? "¿Ya tienes una cuenta? Inicia sesión" : "¿No tienes cuenta aún? Regístrate aquí"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
