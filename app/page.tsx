"use client";

import Header from "./components/Header";
import Hero from "./components/Hero";
import HowItWorks from "./components/HowItWorks";
import Benefits from "./components/Benefits";
import Footer from "./components/Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Header />
      <Hero />
      <HowItWorks />
      <Benefits />
      <Footer />
    </div>
  );
}
