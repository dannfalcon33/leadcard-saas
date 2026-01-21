import BackgroundShapes from "./BackgroundShapes";

export default function Benefits() {
  const benefits = [
    {
      title: "Sin Configuración",
      desc: "Olvídate de servidores, dominios y hosting complicado.",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      title: "Exporta a Excel",
      desc: "Descarga todos tus leads en un clic compatible con Excel.",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      title: "100% Personalizable",
      desc: "Adapta los colores y estilos a tu marca personal.",
      gradient: "from-orange-500 to-red-500",
    },
    {
      title: "Súper Rápido",
      desc: "Carga instantánea optimizada para móviles.",
      gradient: "from-green-500 to-emerald-500",
    },
  ];

  return (
    <section className="relative py-24 px-4 text-center overflow-hidden">
      <BackgroundShapes />
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-bold text-center mb-16 text-white">
          Todo lo que necesitas para{" "}
          <span className="text-purple-500">crecer</span>.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((item, index) => (
            <div
              key={index}
              className="group p-6 rounded-2xl bg-gray-900/50 border border-gray-800 hover:bg-gray-900 transition-all duration-300 hover:-translate-y-2"
            >
              <div
                className={`w-12 h-1 mb-6 rounded-full bg-gradient-to-r ${item.gradient}`}
              />
              <h3 className="text-xl font-bold mb-3 text-white group-hover:text-blue-400 transition-colors">
                {item.title}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
