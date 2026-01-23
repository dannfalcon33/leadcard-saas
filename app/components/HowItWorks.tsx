import Image from "next/image";

export default function HowItWorks() {
  const steps = [
    {
      id: 1,
      title: "Introduce tus datos",
      desc: "Llena tu Landing Card con enlaces, biografía y foto.",
      icon: "/icon-captar.png",
    },
    {
      id: 2,
      title: "Genera tu LeadCard",
      desc: "Obtén un enlace único para compartir ya listo en segundos.",
      icon: "/icon-rayo.png",
    },
    {
      id: 3,
      title: "Capta Leads",
      desc: "Los visitantes te contactan y guardamos sus datos.",
      icon: "/icon-grafico.png",
    },
  ];

  return (
    <section className="py-24 px-4 bg-black relative">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-bold text-center mb-20 text-indigo-600">
          ¿Cómo funciona?
        </h2>

        <div className="relative flex flex-col md:flex-row justify-between items-center gap-12 md:gap-8">
          {/* Connecting Line (Desktop) */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 -translate-y-1/2 opacity-30 blur-sm rounded-full"></div>

          {steps.map((step) => (
            <div
              key={step.id}
              className="relative z-10 bg-black/40 backdrop-blur-md border border-white/10 p-8 rounded-2xl max-w-sm w-full text-center hover:bg-white/5 transition-all duration-300 shadow-xl hover:-translate-y-2"
            >
              <div className="w-16 h-16 mx-auto bg-white/5 rounded-full flex items-center justify-center text-3xl mb-6 border border-white/10 shadow-inner">
                <Image
                  src={step.icon}
                  alt={step.title}
                  width={64}
                  height={64}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <h3 className="text-xl font-bold mb-3 text-indigo-400">
                {step.title}
              </h3>
              <p className="text-indigo-200">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
