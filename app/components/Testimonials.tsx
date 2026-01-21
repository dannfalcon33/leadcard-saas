"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

const testimonials = [
  {
    id: 1,
    name: "Carlos Rodríguez",
    role: "Freelancer",
    text: "LeadCard transformó la forma en que comparto mi portafolio. Ahora mis clientes me contactan directamente desde mi tarjeta digital.",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=faces",
  },
  {
    id: 2,
    name: "Ana García",
    role: "Consultora de Marketing",
    text: "Increíble herramienta. Súper fácil de usar y muy profesional. Mis leads han aumentado un 30% desde que la uso.",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=faces",
  },
  {
    id: 3,
    name: "Miguel Ángel",
    role: "Fotógrafo",
    text: "La mejor manera de mostrar mi trabajo y que me contacten al instante. El diseño es limpio y moderno, justo lo que buscaba.",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=faces",
  },
  {
    id: 4,
    name: "Laura Martínez",
    role: "Agente Inmobiliario",
    text: "Me encanta que puedo exportar los contactos a Excel. Me ahorra muchísimo tiempo de gestión manual. Totalmente recomendada.",
    avatar:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=faces",
  },
];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative py-24 px-4 bg-black overflow-hidden">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-5xl font-bold mb-16 text-white">
          Lo que dicen nuestros{" "}
          <span className="text-indigo-500">clientes</span>
        </h2>

        <div className="relative h-72 md:h-56">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className={`absolute top-0 left-0 w-full transition-opacity duration-1000 ease-in-out ${
                index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
            >
              <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 p-8 rounded-2xl mx-auto max-w-2xl">
                <div className="w-16 h-16 mx-auto mb-4 relative">
                  <Image
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    fill
                    className="object-cover rounded-full border-2 border-indigo-500"
                  />
                </div>
                <p className="text-lg md:text-xl text-gray-300 italic mb-6">
                  "{testimonial.text}"
                </p>
                <div>
                  <h4 className="font-bold text-white">{testimonial.name}</h4>
                  <p className="text-sm text-indigo-400">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Indicators */}
        <div className="flex justify-center gap-3 mt-8">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "bg-indigo-500 w-8"
                  : "bg-gray-700 hover:bg-gray-600"
              }`}
              aria-label={`Ir al testimonio ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
