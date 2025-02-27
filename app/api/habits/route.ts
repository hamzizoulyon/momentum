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

    const { name, description, frequency } = await req.json();

    // Récupérer l'utilisateur par email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    const habit = await prisma.habit.create({
      data: {
        name,
        description,
        frequency,
        userId: user.id,
      },
    });

    return NextResponse.json(habit);
  } catch (error) {
    console.error("Erreur création habitude:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création de l'habitude" },
      { status: 500 }
    );
  }
}

// Récupérer toutes les habitudes de l'utilisateur
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    // Récupérer l'utilisateur par email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    const habits = await prisma.habit.findMany({
      where: {
        userId: user.id,
      },
      include: {
        tracking: {
          where: {
            date: {
              gte: new Date(new Date().setHours(0, 0, 0, 0)),
            },
          },
        },
      },
    });

    return NextResponse.json(habits);
  } catch (error) {
    console.error("Erreur récupération habitudes:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des habitudes" },
      { status: 500 }
    );
  }
}
