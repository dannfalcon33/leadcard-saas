export default function HowItWorks() {
  const steps = [
    {
      id: 1,
      title: "Introduce tus datos",
      desc: "Llena tu perfil con enlaces, bio y foto.",
      icon: "📝",
    },
    {
      id: 2,
      title: "Genera tu LeadCard",
      desc: "Obtén un enlace único para compartir.",
      icon: "⚡",
    },
    {
      id: 3,
      title: "Capta Leads",
      desc: "Los visitantes te contactan y guardamos sus datos.",
      icon: "📈",
    },
  ];

  return (
    <section className="py-24 px-4 bg-black relative">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-bold text-center mb-20 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
          ¿Cómo funciona?
        </h2>

        <div className="relative flex flex-col md:flex-row justify-between items-center gap-12 md:gap-8">
          {/* Connecting Line (Desktop) */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 -translate-y-1/2 opacity-30 blur-sm rounded-full"></div>

          {steps.map((step) => (
            <div
              key={step.id}
              className="relative z-10 bg-gray-900 border border-gray-800 p-8 rounded-2xl max-w-sm w-full text-center hover:border-blue-500/50 transition-colors duration-300 shadow-2xl"
            >
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-gray-800 to-black rounded-full flex items-center justify-center text-3xl mb-6 border border-gray-700 shadow-inner">
                {step.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">
                {step.title}
              </h3>
              <p className="text-gray-400">{step.desc}</p>

              {/* Step Number Badge */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-sm font-bold border-2 border-black">
                {step.id}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
