import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function PUT(req: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { completed } = await req.json();

    // Récupérer l'ancien état du tracking
    const oldTracking = await prisma.habitTracking.findUnique({
      where: { id: params.id },
    });

    const trackingId = await params.id;
    const tracking = await prisma.habitTracking.update({
      where: { id: trackingId },
      data: { completed },
    });

    // Gérer les points de l'utilisateur
    if (oldTracking?.completed !== completed) {
      await prisma.user.update({
        where: {
          email: session.user.email,
        },
        data: {
          points: {
            increment: completed ? 100 : -100,
          },
        },
      });
    }

    return NextResponse.json(tracking);
  } catch (error) {
    console.error("Erreur lors de la mise à jour du tracking:", error);
    return NextResponse.json({ error: "Erreur lors de la mise à jour" }, { status: 500 });
  }
}
