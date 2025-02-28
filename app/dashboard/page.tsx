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
  XMarkIcon,
  StarIcon,
  CheckBadgeIcon,
  GiftIcon,
} from "@heroicons/react/24/outline";
import Sidebar from "@/components/Sidebar";
import EditHabitModal from "@/components/EditHabitModal";
import { Input } from "@/components/ui/input";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { log } from "console";
import useSWR from "swr";

// Fonction pour obtenir le niveau en fonction des points
function getLevelInfo(points: number) {
  const levels = [
    { level: 1, name: "Débutant", minPoints: 0, maxPoints: 100 },
    { level: 2, name: "Débutant motivé", minPoints: 100, maxPoints: 300 },
    { level: 3, name: "Habitué", minPoints: 300, maxPoints: 600 },
    { level: 4, name: "Expert", minPoints: 600, maxPoints: 1000 },
    { level: 5, name: "Maître", minPoints: 1000, maxPoints: 2000 },
  ];

  const currentLevel = levels.findLast((level) => points >= level.minPoints);
  const nextLevel = levels.find((level) => points < level.maxPoints);

  return {
    current: currentLevel,
    next: nextLevel,
    progress: nextLevel
      ? ((points - nextLevel.minPoints) / (nextLevel.maxPoints - nextLevel.minPoints)) * 100
      : 100,
  };
}

interface User {
  id: string;
  email: string;
  points: number;
}

interface Badge {
  id: string;
  name: string;
  category: string;
  pointsNeeded: number;
}

interface Tracking {
  id: string;
  completed: boolean;
  date: Date;
}

interface Habit {
  id: string;
  tracking: Tracking[];
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [habits, setHabits] = useState([]);
  const [mounted, setMounted] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showTip, setShowTip] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [nextBadges, setNextBadges] = useState<Badge[]>([]);
  const levelInfo = user
    ? getLevelInfo(user.points || 0)
    : { current: null, next: null, progress: 0 };
  const [stats, setStats] = useState({
    currentStreak: 0,
    monthlyCompletion: 0,
    trend: 0,
  });

  // Récupération des données utilisateur avec SWR
  const { data: userData, mutate: mutateUser } = useSWR("/api/user", fetcher);
  const { data: levelInfoData, mutate: mutateLevel } = useSWR("/api/levels", fetcher);
  const { data: nextBadgesData, mutate: mutateBadges } = useSWR("/api/badges/next", fetcher);

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

  const calculateStats = async () => {
    try {
      const response = await fetch("/api/stats");
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Erreur lors du calcul des statistiques:", error);
    }
  };

  useEffect(() => {
    calculateStats();
  }, [habits]);

  // Calculer le pourcentage de réussite
  const calculateProgress = (habits: any[]) => {
    if (!habits || habits.length === 0) return 0;
    const completedToday = habits.filter((habit) =>
      habit.tracking?.some((t: any) => t.completed)
    ).length;
    return (completedToday / habits.length) * 100;
  };

  const handleTrackingUpdate = async (habit: Habit, completed: boolean) => {
    try {
      const today = new Date().toISOString().split("T")[0];
      const existingTracking = habit.tracking?.find((t: any) => {
        const trackingDate = new Date(t.date).toISOString().split("T")[0];
        return trackingDate === today;
      });

      if (!existingTracking || !existingTracking.id) {
        console.log("No existing tracking found");
        return;
      }

      await fetch(`/api/habits/tracking/${existingTracking.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          completed,
        }),
      });

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

  async function awardPointsForHabit(userId: string, habitId: string) {
    const habit = await prisma.habit.findUnique({ where: { id: habitId } });
    const points = habit.pointsValue;

    await prisma.user.update({
      where: { id: userId },
      data: { points: { increment: points } },
    });

    // Vérifier et attribuer les nouveaux badges
    await checkAndAwardBadges(userId);
  }

  async function checkAndAwardBadges(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { userBadges: true },
    });

    const eligibleBadges = await prisma.badge.findMany({
      where: {
        pointsNeeded: { lte: user.points },
        NOT: {
          id: { in: user.userBadges.map((ub) => ub.badgeId) },
        },
      },
    });

    for (const badge of eligibleBadges) {
      await prisma.userBadge.create({
        data: {
          userId: user.id,
          badgeId: badge.id,
        },
      });
    }
  }

  // Fonction pour rafraîchir toutes les données
  const refreshUserData = async () => {
    await Promise.all([mutateUser(), mutateLevel(), mutateBadges()]);
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
              <ProgressRing progress={calculateProgress(habits)} className="mb-4" />
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                <p>
                  {habits.filter((habit) => habit.tracking?.some((t: any) => t.completed)).length}{" "}
                  sur {habits.length} habitudes complétées
                </p>
              </div>
            </div>
          </div>

          {/* Section Statistiques */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
            <div className="flex items-center mb-4">
              <ChartBarIcon className="h-6 w-6 text-blue-500 mr-2" />
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Statistiques</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <FireIcon className="h-5 w-5 text-orange-500 mr-2" />
                  <span className="text-gray-600 dark:text-gray-400">Série actuelle</span>
                </div>
                <span className="font-semibold text-gray-800 dark:text-white">
                  {stats.currentStreak} jours
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CalendarIcon className="h-5 w-5 text-purple-500 mr-2" />
                  <span className="text-gray-600 dark:text-gray-400">Ce mois</span>
                </div>
                <span className="font-semibold text-gray-800 dark:text-white">
                  {stats.monthlyCompletion}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <ArrowTrendingUpIcon className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-gray-600 dark:text-gray-400">Tendance</span>
                </div>
                <span className={stats.trend >= 0 ? "text-green-500" : "text-red-500"}>
                  {stats.trend > 0 ? "+" : ""}
                  {stats.trend}%
                </span>
              </div>
            </div>
          </div>

          {/* Nouvelle Section Objectifs */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
            <div className="flex items-center mb-4">
              <StarIcon className="h-6 w-6 text-amber-500 mr-2" />
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Objectifs</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                    <CheckBadgeIcon className="h-5 w-5 text-green-500" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                      Niveau actuel
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {levelInfoData?.current?.name || "Chargement..."}
                    </p>
                  </div>
                </div>
                <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  Niveau {levelInfoData?.current?.level || "0"}
                </span>
              </div>

              <div className="relative pt-1">
                <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                  Progression niveau suivant
                </div>
                <div className="flex h-2 overflow-hidden rounded bg-gray-200 dark:bg-gray-700">
                  <div
                    className="flex flex-col justify-center overflow-hidden bg-blue-500"
                    role="progressbar"
                    style={{ width: `${levelInfoData?.progress || 0}%` }}
                    aria-valuenow={levelInfoData?.progress || 0}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  ></div>
                </div>
                <div className="text-right text-xs text-gray-600 dark:text-gray-400 mt-1">
                  {userData?.points || 0}/{levelInfoData?.next?.maxPoints || 0} points
                </div>
              </div>

              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Prochaines récompenses
                </h3>
                <div className="space-y-2">
                  {(nextBadgesData || []).map((badge) => (
                    <div key={badge.id} className="flex items-center text-sm">
                      {badge.category === "SPECIAL" ? (
                        <GiftIcon className="h-4 w-4 text-purple-500 mr-2" />
                      ) : (
                        <TrophyIcon className="h-4 w-4 text-yellow-500 mr-2" />
                      )}
                      <span className="text-gray-600 dark:text-gray-400">
                        Badge "{badge.name}" à {badge.pointsNeeded} points
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Section des habitudes */}
          <div
            className={`bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm ${
              showTip ? "lg:col-span-2" : "lg:col-span-3"
            }`}
          >
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
              {habits.map((habit: Habit) => (
                <div
                  key={habit.id}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <Input
                      type="checkbox"
                      checked={habit.tracking?.[0]?.completed || false}
                      onChange={(e) => handleTrackingUpdate(habit, e.target.checked)}
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
          {showTip && (
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-sm text-white relative max-w-2xl h-fit">
              <div className="absolute top-2 right-2">
                <button
                  onClick={() => setShowTip(false)}
                  className="p-1 hover:bg-blue-600 rounded-full transition-colors"
                  aria-label="Fermer le conseil"
                >
                  <XMarkIcon className="h-5 w-5 text-blue-100 hover:text-white" />
                </button>
              </div>

              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">Conseil du jour</h2>
                <p className="text-blue-100">
                  Commencez petit : visez la constance plutôt que la perfection. Une habitude de 5
                  minutes pratiquée régulièrement est plus efficace qu'une habitude d'une heure
                  pratiquée sporadiquement.
                </p>
              </div>
            </div>
          )}
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
