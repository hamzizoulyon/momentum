"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import AddHabitModal from "@/components/AddHabitModal";
import ProgressRing from "@/components/ProgressRing";
import {
  CheckCircleIcon,
  ChartBarIcon,
  PlusIcon,
  FireIcon,
  CalendarIcon,
  TrophyIcon,
  ArrowTrendingUpIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import Sidebar from "@/components/Sidebar";
import EditHabitModal from "@/components/EditHabitModal";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [habits, setHabits] = useState([]);
  const [mounted, setMounted] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  useEffect(() => {
    setMounted(true);
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

  useEffect(() => {
    fetchHabits();
  }, []);

  // Calculer le pourcentage de réussite
  const calculateProgress = (habits: any[]) => {
    if (!habits || habits.length === 0) return 0;
    const completedToday = habits.filter((habit) =>
      habit.tracking?.some((t: any) => t.completed)
    ).length;
    return (completedToday / habits.length) * 100;
  };

  const handleTrackingUpdate = async (habit: any, completed: boolean) => {
    try {
      const existingTracking = habit.tracking?.[0];

      if (existingTracking) {
        // Si un tracking existe déjà, on le met à jour
        await fetch(`/api/habits/tracking/${existingTracking.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            completed,
          }),
        });
      } else {
        // Sinon, on en crée un nouveau
        await fetch("/api/habits/tracking", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            habitId: habit.id,
            completed,
            date: new Date(),
          }),
        });
      }

      fetchHabits(); // Rafraîchir les habitudes
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

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

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      <Sidebar />
      <div className="ml-64 flex-1 p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Section Progression */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
            <div className="flex items-center mb-4">
              <TrophyIcon className="h-6 w-6 text-yellow-500 mr-2" />
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                Progression du jour
              </h2>
            </div>
            <div className="flex flex-col items-center justify-center">
              <ProgressRing
                progress={calculateProgress(habits)}
                className="mb-4"
              />
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                <p>
                  {
                    habits.filter((habit) =>
                      habit.tracking?.some((t: any) => t.completed)
                    ).length
                  }{" "}
                  sur {habits.length} habitudes complétées
                </p>
              </div>
            </div>
          </div>

          {/* Section Statistiques */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
            <div className="flex items-center mb-4">
              <ChartBarIcon className="h-6 w-6 text-blue-500 mr-2" />
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                Statistiques
              </h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <FireIcon className="h-5 w-5 text-orange-500 mr-2" />
                  <span className="text-gray-600 dark:text-gray-400">
                    Série actuelle
                  </span>
                </div>
                <span className="font-semibold text-gray-800 dark:text-white">
                  3 jours
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CalendarIcon className="h-5 w-5 text-purple-500 mr-2" />
                  <span className="text-gray-600 dark:text-gray-400">
                    Ce mois
                  </span>
                </div>
                <span className="font-semibold text-gray-800 dark:text-white">
                  75%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <ArrowTrendingUpIcon className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-gray-600 dark:text-gray-400">
                    Tendance
                  </span>
                </div>
                <span className="text-green-500">+12%</span>
              </div>
            </div>
          </div>

          {/* Section Habitudes */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <CheckCircleIcon className="h-6 w-6 text-green-500 mr-2" />
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                  Mes habitudes
                </h2>
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
              >
                <PlusIcon className="h-5 w-5 mr-1" />
                Ajouter
              </button>
            </div>
            <div className="space-y-4">
              {habits.map((habit: any) => (
                <div
                  key={habit.id}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <input
                      type="checkbox"
                      checked={habit.tracking?.[0]?.completed || false}
                      onChange={(e) =>
                        handleTrackingUpdate(habit, e.target.checked)
                      }
                      className="w-5 h-5 rounded text-blue-600"
                    />
                    <div>
                      <span className="text-gray-700 dark:text-gray-200 font-medium">
                        {habit.name}
                      </span>
                      {habit.description && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {habit.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                      <CalendarIcon className="h-4 w-4 mr-1" />
                      {habit.frequency.toLowerCase()}
                    </span>
                    <button
                      onClick={() => {
                        setEditingHabit(habit);
                        setIsEditModalOpen(true);
                      }}
                      className="p-1 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteHabit(habit.id)}
                      className="p-1 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Widget de conseils */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl shadow-sm text-white">
            <h2 className="text-xl font-semibold mb-4">Conseil du jour</h2>
            <p className="text-blue-100">
              "Commencez petit : visez la constance plutôt que la perfection.
              Une habitude de 5 minutes pratiquée régulièrement est plus
              efficace qu'une habitude d'une heure pratiquée sporadiquement."
            </p>
          </div>
        </div>
      </div>

      <AddHabitModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={fetchHabits}
      />

      {editingHabit && (
        <EditHabitModal
          habit={editingHabit}
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingHabit(null);
          }}
          onEdit={fetchHabits}
        />
      )}
    </div>
  );
}
