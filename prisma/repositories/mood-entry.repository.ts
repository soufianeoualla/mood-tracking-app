import { Prisma } from "@/app/generated/prisma";
import {  PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class MoodEntryRepository {
  async getAllEntries(userId: number) {
    return await prisma.moodEntry.findMany({
      where: { userId },
    });
  }

  async getEntriesByDate(userId: number, date: Date) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    return await prisma.moodEntry.findMany({
      where: {
        userId,
        createdAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });
  }

  async getEntryById(id: string) {
    return await prisma.moodEntry.findUnique({ where: { id } });
  }

  async createEntry(data: Prisma.MoodEntryCreateInput) {
    return await prisma.moodEntry.create({ data });
  }

  async updateEntry(id: string, data: { mood?: string; comment?: string }) {
    return await prisma.moodEntry.update({
      where: { id },
      data,
    });
  }

  async deleteEntry(id: string) {
    return await prisma.moodEntry.delete({ where: { id } });
  }
}
