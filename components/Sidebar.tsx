"use client";
import { useSession, signOut } from "next-auth/react";
import { useTheme } from "@/context/ThemeContext";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CheckCircleIcon } from "@heroicons/react/24/outline";

export default function Sidebar() {
  const { data: session } = useSession();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const pathname = usePathname();

  const isActivePath = (path: string) => {
    return pathname === path;
  };

  return (
    <nav className="w-64 bg-white dark:bg-gray-800 shadow-lg h-screen fixed left-0">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            HabitTracker
          </h1>
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            {isDarkMode ? (
              <svg
                className="w-5 h-5 text-yellow-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                />
              </svg>
            ) : (
              <svg
                className="w-5 h-5 text-gray-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            )}
          </button>
        </div>

        {/* User Profile Section */}
        <div className="mb-8 pb-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
              {session?.user?.email?.[0]?.toUpperCase()}
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="space-y-2">
          <Link
            href="/dashboard"
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition duration-200 ${
              isActivePath("/dashboard")
                ? "bg-blue-50 dark:bg-gray-700 text-blue-600 dark:text-blue-400"
                : "text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-700"
            }`}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            <span>Tableau de bord</span>
          </Link>

          <Link
            href="/mes-habitudes"
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition duration-200 ${
              isActivePath("/mes-habitudes")
                ? "bg-blue-50 dark:bg-gray-700 text-blue-600 dark:text-blue-400"
                : "text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-700"
            }`}
          >
            <CheckCircleIcon className="w-5 h-5" />
            <span>Mes Habitudes</span>
          </Link>

          <Link
            href="/statistics"
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition duration-200 ${
              isActivePath("/statistics")
                ? "bg-blue-50 dark:bg-gray-700 text-blue-600 dark:text-blue-400"
                : "text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-700"
            }`}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            <span>Statistiques</span>
          </Link>

          <Link
            href="/settings"
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition duration-200 ${
              isActivePath("/settings")
                ? "bg-blue-50 dark:bg-gray-700 text-blue-600 dark:text-blue-400"
                : "text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-700"
            }`}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span>Paramètres</span>
          </Link>
        </div>
      </div>

      {/* Logout Button */}
      <div className="absolute bottom-0 w-full p-6">
        <button
          onClick={() => signOut()}
          className="flex items-center space-x-3 px-4 py-3 w-full text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-gray-700 rounded-lg transition duration-200"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          <span>Déconnexion</span>
        </button>
      </div>
    </nav>
  );
}
