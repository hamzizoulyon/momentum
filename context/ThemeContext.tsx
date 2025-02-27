"use client";
import { createContext, useContext, useEffect, useState } from "react";

type ThemeContextType = {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Initialisation du thème
  useEffect(() => {
    // Récupérer la préférence stockée ou la préférence système
    const storedTheme = localStorage.getItem("theme");
    const systemPrefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    const shouldUseDarkMode =
      storedTheme === "dark" || (!storedTheme && systemPrefersDark);

    setIsDarkMode(shouldUseDarkMode);
    if (shouldUseDarkMode) {
      document.documentElement.classList.add("dark");
    }
    setMounted(true);
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const newValue = !prev;
      localStorage.setItem("theme", newValue ? "dark" : "light");

      if (newValue) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }

      return newValue;
    });
  };

  // Éviter le flash en mode clair pendant le chargement
  if (!mounted) {
    return null;
  }

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
