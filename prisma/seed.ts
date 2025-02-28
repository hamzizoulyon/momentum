import { PrismaClient, BadgeCategory } from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  // Créer un utilisateur test
  const hashedPassword = await bcrypt.hash("password123", 10);

  const user = await prisma.user.create({
    data: {
      email: "test@example.com",
      password: hashedPassword,
      points: 150, // Points initiaux
    },
  });

  // Créer les badges
  const badges = [
    {
      name: "Débutant",
      description: "Commencez votre voyage",
      pointsNeeded: 0,
      category: BadgeCategory.BEGINNER,
      imageUrl: "/badges/beginner.png",
    },
    {
      name: "Apprenti",
      description: "Complétez 10 habitudes",
      pointsNeeded: 100,
      category: BadgeCategory.BEGINNER,
      imageUrl: "/badges/apprentice.png",
    },
    {
      name: "Habitué",
      description: "Atteignez 500 points",
      pointsNeeded: 500,
      category: BadgeCategory.INTERMEDIATE,
      imageUrl: "/badges/regular.png",
    },
    {
      name: "Expert",
      description: "Maintenez 5 habitudes pendant 30 jours",
      pointsNeeded: 1000,
      category: BadgeCategory.EXPERT,
      imageUrl: "/badges/expert.png",
    },
    {
      name: "Maître",
      description: "Atteignez 5000 points",
      pointsNeeded: 5000,
      category: BadgeCategory.MASTER,
      imageUrl: "/badges/master.png",
    },
  ];

  for (const badge of badges) {
    await prisma.badge.create({
      data: badge,
    });
  }

  // Attribuer le badge "Débutant" à l'utilisateur test
  const beginnerBadge = await prisma.badge.findFirst({
    where: { name: "Débutant" },
  });

  if (beginnerBadge) {
    await prisma.userBadge.create({
      data: {
        userId: user.id,
        badgeId: beginnerBadge.id,
      },
    });
  }

  console.log("Base de données initialisée avec :");
  console.log("- Utilisateur test créé");
  console.log("- Badges créés");
  console.log("Points initiaux:", user.points);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
