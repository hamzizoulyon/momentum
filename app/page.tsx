import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <Navbar />
      <main className="flex flex-col items-center justify-center px-6 sm:px-12">
        <HeroSection />

        {/* Add a section below the HeroSection if needed */}
        <section className="mt-10 text-center">
          <h2 className="text-2xl font-semibold">
            Start Building Better Habits
          </h2>
          <p className="mt-2 text-gray-600">
            Track your progress, stay consistent, and achieve your goals.
          </p>
        </section>
      </main>
      <footer className="mt-64 py-6 text-center text-gray-500">
        © {new Date().getFullYear()} Your Brand - All Rights Reserved
      </footer>
    </div>
  );
}
