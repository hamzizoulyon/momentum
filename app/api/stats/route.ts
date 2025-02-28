import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        habits: {
          include: {
            tracking: {
              orderBy: { date: "desc" },
            },
          },
        },
      },
    });

    // Calcul de la série actuelle
    const currentStreak = calculateCurrentStreak(user.habits);

    // Calcul du pourcentage de complétion mensuel
    const monthlyCompletion = calculateMonthlyCompletion(user.habits);

    // Calcul de la tendance (comparaison avec le mois précédent)
    const trend = calculateTrend(user.habits);

    return NextResponse.json({
      currentStreak,
      monthlyCompletion,
      trend,
    });
  } catch (error) {
    console.error("Erreur lors du calcul des statistiques:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

function calculateCurrentStreak(habits: any[]) {
  if (!habits || habits.length === 0) return 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  let streak = 0;
  let currentDate = new Date(today);

  try {
    while (true) {
      const dateStr = currentDate.toISOString().split("T")[0];
      const allHabitsCompleted = habits.every((habit) =>
        habit.tracking?.some(
          (t: any) => new Date(t.date).toISOString().split("T")[0] === dateStr && t.completed
        )
      );

      if (!allHabitsCompleted) break;
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    }

    return streak;
  } catch (error) {
    console.error("Erreur dans calculateCurrentStreak:", error);
    return 0;
  }
}

function calculateMonthlyCompletion(habits) {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const totalDays = now.getDate();
  let completedDays = 0;

  for (let i = 0; i < totalDays; i++) {
    const currentDate = new Date(startOfMonth);
    currentDate.setDate(currentDate.getDate() + i);
    const dateStr = currentDate.toISOString().split("T")[0];

    const allCompleted = habits.every((habit) =>
      habit.tracking.some((t) => t.date.toISOString().split("T")[0] === dateStr && t.completed)
    );

    if (allCompleted) completedDays++;
  }

  return Math.round((completedDays / totalDays) * 100);
}

function calculateTrend(habits) {
  const now = new Date();
  const currentMonth = calculateMonthlyCompletion(habits);

  // Calculer pour le mois précédent
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1);
  const lastMonthHabits = habits.map((habit) => ({
    ...habit,
    tracking: habit.tracking.filter(
      (t) =>
        t.date.getMonth() === lastMonth.getMonth() &&
        t.date.getFullYear() === lastMonth.getFullYear()
    ),
  }));

  const lastMonthCompletion = calculateMonthlyCompletion(lastMonthHabits);

  return lastMonthCompletion === 0
    ? 0
    : Math.round(((currentMonth - lastMonthCompletion) / lastMonthCompletion) * 100);
}
