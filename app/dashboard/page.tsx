import { createClient } from "@/src/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const supabase = await createClient(); // Await created client
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  // Mock data for UI demonstration
  const stats = [
    { label: "Total Proyectos", value: "0", change: "+0%" },
    { label: "Leads Totales", value: "0", change: "+0%" },
    { label: "Tasa de Conversión", value: "0%", change: "+0%" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Navigation */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
              L
            </div>
            <span className="text-xl font-bold text-gray-900">LeadCard</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500 hidden sm:block">
              {user.email}
            </span>
            <form action="/auth/signout" method="post">
              <button className="text-sm text-red-600 hover:text-red-700 font-medium">
                Cerrar Sesión
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-500 mt-1">
              Bienvenido de nuevo, gestiona tus landing pages.
            </p>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-colors flex items-center gap-2">
            <span>+</span>
            Crear Nuevo Proyecto
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm"
            >
              <p className="text-sm font-medium text-gray-500">{stat.label}</p>
              <div className="flex items-baseline mt-2 gap-2">
                <span className="text-3xl font-bold text-gray-900">
                  {stat.value}
                </span>
                <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                  {stat.change}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Projects Section */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gray-50/50">
            <h2 className="text-lg font-semibold text-gray-900">
              Mis Proyectos
            </h2>
            <button className="text-sm text-blue-600 font-medium hover:underline">
              Ver todos
            </button>
          </div>

          <div className="divide-y divide-gray-100">
            {/* Empty State */}
            <div className="p-12 text-center">
              <div className="mx-auto h-12 w-12 text-gray-300 mb-4">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
              <h3 className="text-sm font-medium text-gray-900">
                No hay proyectos aún
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Comienza creando tu primera landing page para captar leads.
              </p>
              <div className="mt-6">
                <button className="inline-flex items-center px-4 py-2 border border-blue-600 shadow-sm text-sm font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  Crear Proyecto
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
