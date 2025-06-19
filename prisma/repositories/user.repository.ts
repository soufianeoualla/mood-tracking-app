import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class UserRepository {
  async getAllUsers() {
    return await prisma.user.findMany();
  }

  async getUserById(id: string) {
    return await prisma.user.findUnique({ where: { id } });
  }
  async getUserByEmail(email: string) {
    return await prisma.user.findUnique({ where: { email } });
  }

  async createUser(data: { email: string; password: string }) {
    return await prisma.user.create({ data });
  }
}
