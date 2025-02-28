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

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { points: true },
    });

    if (!user) {
      return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 });
    }

    // Définition des badges disponibles
    const badges = [
      { id: "1", name: "Premier Pas", pointsNeeded: 100, category: "NORMAL" },
      { id: "2", name: "Débutant Motivé", pointsNeeded: 500, category: "NORMAL" },
      { id: "3", name: "Habitué", pointsNeeded: 1000, category: "NORMAL" },
      { id: "4", name: "Expert", pointsNeeded: 2000, category: "SPECIAL" },
      { id: "5", name: "Maître", pointsNeeded: 5000, category: "SPECIAL" },
      { id: "6", name: "Légende", pointsNeeded: 10000, category: "SPECIAL" },
    ];

    // Filtrer pour ne retourner que les 3 prochains badges non débloqués
    const nextBadges = badges
      .filter((badge) => badge.pointsNeeded > user.points)
      .sort((a, b) => a.pointsNeeded - b.pointsNeeded)
      .slice(0, 3);

    return NextResponse.json(nextBadges);
  } catch (error) {
    console.error("Erreur lors de la récupération des badges:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
