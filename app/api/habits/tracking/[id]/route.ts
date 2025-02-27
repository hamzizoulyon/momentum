import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { completed } = await req.json();
    const trackingId = params.id;

    const tracking = await prisma.habitTracking.update({
      where: { id: trackingId },
      data: { completed },
    });

    return NextResponse.json(tracking);
  } catch (error) {
    console.error("Erreur mise à jour tracking:", error);
    return NextResponse.json({ error: "Erreur lors de la mise à jour" }, { status: 500 });
  }
}
