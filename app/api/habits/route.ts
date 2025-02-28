import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

// Créer une nouvelle habitude
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 });
    }

    const { name, description, frequency, categoryId } = await req.json();

    const habit = await prisma.habit.create({
      data: {
        name,
        description,
        frequency,
        categoryId,
        userId: user.id,
        tracking: {
          create: {
            date: new Date(),
            completed: false,
          },
        },
      },
      include: {
        tracking: true,
      },
    });

    console.log("Habitude créée avec tracking:", habit);

    return NextResponse.json(habit);
  } catch (error) {
    console.error("Erreur lors de la création de l'habitude:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// Récupérer toutes les habitudes de l'utilisateur
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const habits = await prisma.habit.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        tracking: {
          orderBy: {
            date: "desc",
          },
          take: 1,
        },
      },
    });

    return NextResponse.json(habits);
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de la récupération des habitudes" },
      { status: 500 }
    );
  }
}
