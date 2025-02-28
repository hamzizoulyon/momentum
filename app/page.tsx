"use client";

import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import { ArrowUpIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import {
  ChartBarIcon,
  BellIcon,
  UserGroupIcon,
  GlobeAltIcon as TwitterIcon,
  ShareIcon as FacebookIcon,
  PhotoIcon as InstagramIcon,
  LinkIcon as LinkedInIcon,
} from "@heroicons/react/24/outline";

export default function Home() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="">
      {/* Background decoration */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/2 w-[1000px] h-[1000px] bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2 opacity-50" />
        <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-gradient-to-tl from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full blur-3xl transform translate-x-1/3 translate-y-1/3 opacity-50" />
      </div>

      {/* Content */}
      <div className="relative">
        <Navbar />

        <main className="relative z-10">
          <HeroSection />

          {/* Features Section */}
          <section className="py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">
                Pourquoi choisir notre application ?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-xl shadow-blue-500/5 hover:shadow-blue-500/10 transition-shadow duration-300"
                  >
                    <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center mb-4">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="relative z-10 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
          <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="col-span-2">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  À propos de nous
                </h3>
                <p className="text-gray-600 dark:text-gray-300 max-w-md">
                  Nous aidons les personnes à développer des habitudes positives et à atteindre
                  leurs objectifs grâce à notre application intuitive et personnalisable.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Liens rapides
                </h3>
                <ul className="space-y-2">
                  {quickLinks.map((link, index) => (
                    <li key={index}>
                      <a
                        href={link.href}
                        className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Suivez-nous
                </h3>
                <div className="flex space-x-4">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.href}
                      className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {social.icon}
                    </a>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800">
              <p className="text-center text-gray-500 dark:text-gray-400">
                © {new Date().getFullYear()} HabitTracker - Tous droits réservés
              </p>
            </div>
          </div>
        </footer>

        {/* Scroll to top button */}
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 z-50 p-2 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition-all duration-300 animate-fade-in"
            aria-label="Retour en haut"
          >
            <ArrowUpIcon className="h-6 w-6" />
          </button>
        )}
      </div>
    </div>
  );
}

// Data for features section
const features = [
  {
    icon: <ChartBarIcon className="w-6 h-6 text-blue-600" />,
    title: "Suivi détaillé",
    description:
      "Visualisez vos progrès avec des statistiques claires et des graphiques intuitifs.",
  },
  {
    icon: <BellIcon className="w-6 h-6 text-blue-600" />,
    title: "Rappels intelligents",
    description: "Recevez des notifications personnalisées pour maintenir vos bonnes habitudes.",
  },
  {
    icon: <UserGroupIcon className="w-6 h-6 text-blue-600" />,
    title: "Communauté active",
    description: "Rejoignez une communauté motivée et partagez vos succès avec d'autres membres.",
  },
];

// Data for quick links
const quickLinks = [
  { label: "Accueil", href: "/" },
  { label: "Fonctionnalités", href: "/features" },
  { label: "Tarifs", href: "/pricing" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

// Data for social links
const socialLinks = [
  {
    icon: <TwitterIcon className="h-6 w-6" />,
    href: "https://twitter.com",
  },
  {
    icon: <FacebookIcon className="h-6 w-6" />,
    href: "https://facebook.com",
  },
  {
    icon: <InstagramIcon className="h-6 w-6" />,
    href: "https://instagram.com",
  },
  {
    icon: <LinkedInIcon className="h-6 w-6" />,
    href: "https://linkedin.com",
  },
];
