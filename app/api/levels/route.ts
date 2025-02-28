import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    // Récupérer l'utilisateur et ses points
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { points: true },
    });

    if (!user) {
      return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 });
    }

    // Définir les niveaux et leurs points requis
    const levels = [
      { level: 1, name: "Débutant", minPoints: 0, maxPoints: 500 },
      { level: 2, name: "Apprenti", minPoints: 500, maxPoints: 1500 },
      { level: 3, name: "Intermédiaire", minPoints: 1500, maxPoints: 3000 },
      { level: 4, name: "Avancé", minPoints: 3000, maxPoints: 5000 },
      { level: 5, name: "Expert", minPoints: 5000, maxPoints: 8000 },
      { level: 6, name: "Maître", minPoints: 8000, maxPoints: 12000 },
      { level: 7, name: "Grand Maître", minPoints: 12000, maxPoints: 17000 },
      { level: 8, name: "Légende", minPoints: 17000, maxPoints: 23000 },
      { level: 9, name: "Mythique", minPoints: 23000, maxPoints: 30000 },
      { level: 10, name: "Ultime", minPoints: 30000, maxPoints: Infinity },
    ];

    // Trouver le niveau actuel
    const currentLevel = levels.find(
      (level, index) =>
        user.points >= level.minPoints &&
        (index === levels.length - 1 || user.points < levels[index + 1].minPoints)
    );

    // Trouver le niveau suivant
    const nextLevel = levels.find((level) => level.minPoints > user.points);

    // Calculer la progression vers le niveau suivant
    let progress = 0;
    if (currentLevel && nextLevel) {
      const pointsInCurrentLevel = user.points - currentLevel.minPoints;
      const pointsNeededForNextLevel = nextLevel.minPoints - currentLevel.minPoints;
      progress = Math.round((pointsInCurrentLevel / pointsNeededForNextLevel) * 100);
    }

    return NextResponse.json({
      current: currentLevel,
      next: nextLevel,
      progress,
      totalPoints: user.points,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des niveaux:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
