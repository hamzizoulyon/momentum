import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { name, description, frequency } = await req.json();
    const habitId = params.id;

    const habit = await prisma.habit.update({
      where: { id: habitId },
      data: {
        name,
        description,
        frequency,
      },
    });

    return NextResponse.json(habit);
  } catch (error) {
    console.error("Erreur modification habitude:", error);
    return NextResponse.json({ error: "Erreur lors de la modification" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const habitId = params.id;

    await prisma.habit.delete({
      where: { id: habitId },
    });

    return NextResponse.json({ message: "Habitude supprimée" });
  } catch (error) {
    console.error("Erreur suppression habitude:", error);
    return NextResponse.json({ error: "Erreur lors de la suppression" }, { status: 500 });
  }
}
