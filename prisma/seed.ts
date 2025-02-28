import { PrismaClient, BadgeCategory } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Créer un utilisateur de test
  const user = await prisma.user.upsert({
    where: { email: "test@example.com" },
    update: {},
    create: {
      email: "test@example.com",
      password: await bcrypt.hash("password123", 12),
      points: 150,
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
      data: {
        name: badge.name,
        description: badge.description,
        pointsNeeded: badge.pointsNeeded,
        category: badge.category,
        imageUrl: badge.imageUrl,
      },
    });
  }

  // Attribuer le badge "Débutant" à l'utilisateur test
  const beginnerBadge = await prisma.badge.findFirst({ where: { name: "Débutant" } });
  if (beginnerBadge) {
    await prisma.userBadge.upsert({
      where: { userId_badgeId: { userId: user.id, badgeId: beginnerBadge.id } },
      update: {},
      create: { userId: user.id, badgeId: beginnerBadge.id },
    });
  }

  // Ajouter des habitudes avec historique
  const habits = [
    { name: "Méditation", description: "Pratiquez 10 minutes de méditation", userId: user.id },
    { name: "Lecture", description: "Lire 20 pages d'un livre", userId: user.id },
  ];

  for (const habit of habits) {
    const createdHabit = await prisma.habit.create({
      data: {
        userId: user.id,
        name: habit.name,
        description: habit.description,
      },
    });

    for (let i = 1; i <= 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      await prisma.habitTracking.create({
        data: {
          habitId: createdHabit.id,
          completed: Math.random() < 0.7,
          date,
        },
      });
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
