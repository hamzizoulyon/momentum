"use client";

import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <Navbar />
      <main className="flex flex-col items-center justify-center px-6 sm:px-12">
        <HeroSection />
      </main>
      <footer className="mt-64 py-6 text-center text-gray-500">
        © {new Date().getFullYear()} Your Brand - All Rights Reserved
      </footer>
    </div>
  );
}
