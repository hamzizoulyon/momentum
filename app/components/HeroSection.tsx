import React from "react";
import Link from "next/link";
import { ArrowRightIcon } from "@heroicons/react/24/outline";

function HeroSection() {
  return (
    <div className="relative overflow-hidden bg-white dark:bg-gray-900">
      {/* Fond décoratif */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-purple-900/20 opacity-70" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-blue-200/30 to-purple-200/30 dark:from-blue-700/20 dark:to-purple-700/20 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 sm:pt-24 sm:pb-20">
        <div className="text-center space-y-12">
          {/* En-tête principal */}
          <div className="space-y-6">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 text-transparent bg-clip-text">
              Construisez les habitudes <br className="hidden sm:block" />
              qui comptent vraiment
            </h1>
            <p className="max-w-2xl mx-auto text-lg sm:text-xl text-gray-600 dark:text-gray-300">
              Transformez vos objectifs en réalité, une habitude à la fois. Notre outil vous aide à
              créer et maintenir des habitudes positives qui changent votre vie.
            </p>
          </div>

          {/* Boutons d'action */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="group inline-flex items-center px-8 py-3 text-base font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-all duration-200 shadow-lg hover:shadow-blue-500/25"
            >
              Commencer gratuitement
              <ArrowRightIcon className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/demo"
              className="inline-flex items-center px-8 py-3 text-base font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-lg transition-all duration-200"
            >
              Voir la démo
            </Link>
          </div>

          {/* Statistiques */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 max-w-3xl mx-auto pt-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">10k+</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Utilisateurs actifs</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">50k+</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Habitudes suivies</div>
            </div>
            <div className="text-center col-span-2 md:col-span-1">
              <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">95%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Taux de satisfaction</div>
            </div>
          </div>

          {/* Image de présentation */}
          <div className="relative mt-16">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-full max-w-4xl bg-gradient-to-r from-blue-500/5 to-purple-500/5 dark:from-blue-500/10 dark:to-purple-500/10 rounded-2xl blur-3xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeroSection;
