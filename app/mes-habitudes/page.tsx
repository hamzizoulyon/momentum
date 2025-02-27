"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import {
  CheckCircleIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

interface Category {
  id: string;
  name: string;
  color: string;
  description?: string;
}

interface Habit {
  id: string;
  name: string;
  description?: string;
  frequency: string;
  categoryId?: string;
  category?: Category;
}

export default function MesHabitudesPage() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchHabits();
    fetchCategories();
  }, []);

  const fetchHabits = async () => {
    try {
      const response = await fetch("/api/habits");
      if (response.ok) {
        const data = await response.json();
        setHabits(data);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des habitudes:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories");
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des catégories:", error);
    }
  };

  // Filtrer les habitudes en fonction de la catégorie et du terme de recherche
  const filteredHabits = habits.filter((habit) => {
    const matchesCategory =
      selectedCategory === "all" || habit.categoryId === selectedCategory;
    const matchesSearch =
      habit.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      habit.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      habit.category?.name.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const handleDeleteHabit = async (habitId: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette habitude ?")) {
      try {
        await fetch(`/api/habits/${habitId}`, {
          method: "DELETE",
        });
        fetchHabits();
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      <Sidebar />
      <div className="ml-64 flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            Mes Habitudes
          </h1>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700">
            <PlusIcon className="h-5 w-5" />
            Nouvelle habitude
          </button>
        </div>

        {/* Barre de recherche et filtres */}
        <div className="mb-6 space-y-4">
          {/* Barre de recherche */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Rechercher une habitude..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filtres par catégorie */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                  selectedCategory === category.id
                    ? "text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200"
                }`}
                style={{
                  backgroundColor:
                    selectedCategory === category.id
                      ? category.color
                      : undefined,
                }}
              >
                <span
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: category.color }}
                />
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Liste des habitudes */}
        <div className="grid gap-4">
          {filteredHabits.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              Aucune habitude ne correspond à votre recherche
            </div>
          ) : (
            filteredHabits.map((habit) => (
              <div
                key={habit.id}
                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm flex justify-between items-center"
              >
                <div>
                  <div className="flex items-center gap-2">
                    {habit.category && (
                      <span
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: habit.category.color }}
                      />
                    )}
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                      {habit.name}
                    </h2>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    {habit.description}
                  </p>
                  <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    Fréquence: {habit.frequency.toLowerCase()}
                    {habit.category && ` • ${habit.category.name}`}
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button
                    className="p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400"
                    onClick={() => {
                      /* Logique d'édition */
                    }}
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    className="p-2 text-gray-500 hover:text-red-600 dark:text-gray-400"
                    onClick={() => handleDeleteHabit(habit.id)}
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
