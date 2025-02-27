import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { habitId, completed, date, notes } = await req.json();

    // Vérifier que l'habitude appartient à l'utilisateur
    const habit = await prisma.habit.findFirst({
      where: {
        id: habitId,
        userId: session.user.id,
      },
    });

    if (!habit) {
      return NextResponse.json({ error: "Habitude non trouvée" }, { status: 404 });
    }

    // Créer ou mettre à jour le suivi
    const tracking = await prisma.habitTracking.upsert({
      where: {
        habitId_date: {
          habitId,
          date: new Date(date),
        },
      },
      update: {
        completed,
        notes,
      },
      create: {
        habitId,
        completed,
        date: new Date(date),
        notes,
      },
    });

    return NextResponse.json(tracking);
  } catch (error) {
    return NextResponse.json({ error: "Erreur lors du suivi de l'habitude" }, { status: 500 });
  }
}

// Récupérer les statistiques
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const habitId = searchParams.get("habitId");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    const tracking = await prisma.habitTracking.findMany({
      where: {
        habitId: habitId || undefined,
        habit: {
          userId: session.user.id,
        },
        date: {
          gte: startDate ? new Date(startDate) : undefined,
          lte: endDate ? new Date(endDate) : undefined,
        },
      },
      include: {
        habit: true,
      },
      orderBy: {
        date: "desc",
      },
    });

    // Calculer les statistiques
    const stats = {
      total: tracking.length,
      completed: tracking.filter((t) => t.completed).length,
      completionRate:
        tracking.length > 0
          ? (tracking.filter((t) => t.completed).length / tracking.length) * 100
          : 0,
    };

    return NextResponse.json({ tracking, stats });
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de la récupération des statistiques" },
      { status: 500 }
    );
  }
}
