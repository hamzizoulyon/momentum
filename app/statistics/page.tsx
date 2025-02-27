"use client";
import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { format, startOfWeek, eachDayOfInterval, subDays } from "date-fns";
import { fr } from "date-fns/locale";
import {
  ChartBarIcon,
  CalendarDaysIcon,
  ChartPieIcon,
  FireIcon,
} from "@heroicons/react/24/outline";
import Sidebar from "@/components/Sidebar";

export default function StatisticsPage() {
  const [habits, setHabits] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState("week");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHabitsData();
  }, [selectedPeriod]);

  const fetchHabitsData = async () => {
    try {
      const response = await fetch(
        "/api/habits/statistics?" +
          new URLSearchParams({
            period: selectedPeriod,
          })
      );
      const data = await response.json();
      setHabits(data);
      setLoading(false);
    } catch (error) {
      console.error("Erreur lors de la récupération des statistiques:", error);
      setLoading(false);
    }
  };

  // Préparer les données pour les graphiques
  const prepareWeeklyData = () => {
    const startDate = startOfWeek(new Date(), { weekStartsOn: 1 });
    const days = eachDayOfInterval({
      start: startDate,
      end: new Date(),
    });

    return days.map((day) => ({
      date: format(day, "EEE", { locale: fr }),
      completed: habits.filter((habit) =>
        habit.tracking.some(
          (t) =>
            new Date(t.date).toDateString() === day.toDateString() &&
            t.completed
        )
      ).length,
      total: habits.length,
    }));
  };

  const prepareCategoryData = () => {
    const categories = habits.reduce((acc, habit) => {
      const category = habit.category || "Non catégorisé";
      if (!acc[category]) {
        acc[category] = { total: 0, completed: 0 };
      }
      acc[category].total += 1;
      acc[category].completed += habit.tracking.filter(
        (t) => t.completed
      ).length;
      return acc;
    }, {});

    return Object.entries(categories).map(([name, data]) => ({
      name,
      percentage: (data.completed / data.total) * 100,
    }));
  };

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      <Sidebar />
      <div className="ml-64 flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8 flex items-center">
            <ChartBarIcon className="h-8 w-8 mr-3 text-blue-500" />
            Statistiques
          </h1>

          {/* Filtres de période */}
          <div className="mb-8 flex space-x-4">
            <button
              onClick={() => setSelectedPeriod("week")}
              className={`px-4 py-2 rounded-lg flex items-center ${
                selectedPeriod === "week"
                  ? "bg-blue-500 text-white"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
              }`}
            >
              <CalendarDaysIcon className="h-5 w-5 mr-2" />
              Semaine
            </button>
            <button
              onClick={() => setSelectedPeriod("month")}
              className={`px-4 py-2 rounded-lg flex items-center ${
                selectedPeriod === "month"
                  ? "bg-blue-500 text-white"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
              }`}
            >
              <CalendarDaysIcon className="h-5 w-5 mr-2" />
              Mois
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Graphique de progression quotidienne */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
              <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-white flex items-center">
                <FireIcon className="h-6 w-6 mr-2 text-orange-500" />
                Progression quotidienne
              </h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={prepareWeeklyData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="completed"
                      stroke="#0088FE"
                      name="Habitudes complétées"
                    />
                    <Line
                      type="monotone"
                      dataKey="total"
                      stroke="#82ca9d"
                      name="Total des habitudes"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Graphique par catégorie */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
              <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-white flex items-center">
                <ChartPieIcon className="h-6 w-6 mr-2 text-purple-500" />
                Répartition par catégorie
              </h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={prepareCategoryData()}
                      dataKey="percentage"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label
                    >
                      {prepareCategoryData().map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Statistiques globales */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm lg:col-span-2">
              <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-white">
                Statistiques globales
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 bg-blue-50 dark:bg-gray-700 rounded-lg">
                  <h3 className="text-sm font-medium text-blue-600 dark:text-blue-400">
                    Taux de réussite
                  </h3>
                  <p className="text-2xl font-bold text-blue-800 dark:text-blue-300">
                    {Math.round(
                      (habits.reduce(
                        (acc, habit) =>
                          acc +
                          habit.tracking.filter((t) => t.completed).length,
                        0
                      ) /
                        (habits.length * 7)) *
                        100
                    )}
                    %
                  </p>
                </div>
                <div className="p-4 bg-green-50 dark:bg-gray-700 rounded-lg">
                  <h3 className="text-sm font-medium text-green-600 dark:text-green-400">
                    Habitudes actives
                  </h3>
                  <p className="text-2xl font-bold text-green-800 dark:text-green-300">
                    {habits.length}
                  </p>
                </div>
                <div className="p-4 bg-purple-50 dark:bg-gray-700 rounded-lg">
                  <h3 className="text-sm font-medium text-purple-600 dark:text-purple-400">
                    Meilleure série
                  </h3>
                  <p className="text-2xl font-bold text-purple-800 dark:text-purple-300">
                    7 jours
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
