import { Prisma } from "@/app/generated/prisma";
import { db } from "@/config/db";

export class MoodEntryRepository {
  async getAllEntries(userId: number) {
    return await db.moodEntry.findMany({
      where: { userId },
    });
  }

  async getEntriesByDate(userId: number, date: Date) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    return await db.moodEntry.findMany({
      where: {
        userId,
        createdAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });
  }

  async getEntryById(id: number) {
    return await db.moodEntry.findUnique({ where: { id } });
  }

  async createEntry(data: Prisma.MoodEntryCreateInput) {
    return await db.moodEntry.create({ data });
  }

  async updateEntry(id: number, data: Prisma.MoodEntryCreateInput) {
    return await db.moodEntry.update({
      where: { id },
      data,
    });
  }

  async deleteEntry(id: number) {
    return await db.moodEntry.delete({ where: { id } });
  }
}
