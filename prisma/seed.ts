import { Feeling, PrismaClient } from "@prisma/client";
import { subDays } from "date-fns";

const prisma = new PrismaClient();

const feelingsPool = [
  "JOYFUL",
  "DOWN",
  "ANXIOUS",
  "CALM",
  "EXCITED",
  "FRUSTRATED",
  "LONELY",
  "GRATEFUL",
  "OVERWHELMED",
];

const getRandomFeelings = () => {
  const shuffled = feelingsPool.sort(() => 0.5 - Math.random());
  const count = Math.floor(Math.random() * 3) + 1; // 1 to 3 feelings
  return shuffled.slice(0, count);
};

const sleepOptions = [1, 3.5, 5.5, 7.5, 9];
const moodOptions = [-2, -1, 0, 1, 2];

async function seedMoodEntries(userId: number) {
  for (let i = 0; i < 20; i++) {
    const date = subDays(new Date(), i);

    await prisma.moodEntry.create({
      data: {
        userId,
        mood: moodOptions[Math.floor(Math.random() * moodOptions.length)],
        sleepHours:
          sleepOptions[Math.floor(Math.random() * sleepOptions.length)],
        comment: `Feeling something on day ${
          i + 1
        }. Just keeping track of my mood.`,
        feelings: getRandomFeelings() as Feeling[],
        createdAt: date,
        updatedAt: date,
      },
    });
  }

  console.log("🌱 Seeded mood entries for 20 days.");
}

async function main() {
  const user = await prisma.user.findFirst();
  if (!user) {
    throw new Error(
      "No user found. Please create a user before seeding mood entries."
    );
  }

  await seedMoodEntries(user.id);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
