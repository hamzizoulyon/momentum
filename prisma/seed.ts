import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Créer un utilisateur de test
  const hashedPassword = await bcrypt.hash('password123', 10)
  const user = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      password: hashedPassword,
    },
  })

  // Créer quelques habitudes
  const habits = [
    {
      name: 'Méditation',
      description: '10 minutes de méditation le matin',
      frequency: 'DAILY',
    },
    {
      name: 'Lecture',
      description: 'Lire 30 minutes',
      frequency: 'DAILY',
    },
    {
      name: 'Sport',
      description: 'Séance de sport',
      frequency: 'WEEKLY',
    },
  ]

  for (const habit of habits) {
    const createdHabit = await prisma.habit.create({
      data: {
        ...habit,
        userId: user.id,
      },
    })

    // Créer des trackings pour les 7 derniers jours
    const dates = Array.from({ length: 7 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - i)
      return date
    })

    for (const date of dates) {
      await prisma.habitTracking.create({
        data: {
          habitId: createdHabit.id,
          completed: Math.random() > 0.3, // 70% de chance d'être complété
          date,
          notes: Math.random() > 0.5 ? 'Note de test' : undefined,
        },
      })
    }
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 