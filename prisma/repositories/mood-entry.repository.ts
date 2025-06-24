import { db } from "@/config/db";
import { Prisma } from "@prisma/client";

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

  async getLastEntries(userId: number) {
    return await db.moodEntry.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 10,
    });
  }

  async getEntriesBetweenDates(userId: number, from: Date, to: Date) {
    return db.moodEntry.findMany({
      where: {
        userId,
        createdAt: {
          gte: from,
          lte: to,
        },
      },
      orderBy: {
        createdAt: "asc",
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
