import { db } from "@/config/db";
import { Prisma } from "@prisma/client";

export class UserRepository {
  async getAllUsers() {
    return await db.user.findMany();
  }

  async getUserById(id: number) {
    return await db.user.findUnique({ where: { id } });
  }
  async getUserByEmail(email: string) {
    return await db.user.findUnique({ where: { email } });
  }
  async getVerificationToken(token: string) {
    return await db.verificationToken.findUnique({ where: { token } });
  }
  async getResetToken(token: string) {
    return await db.resetToken.findUnique({ where: { token } });
  }
  async deleteResetToken(token: string) {
    return await db.resetToken.delete({ where: { token } });
  }
  async deleteVerificationToken(token: string) {
    return await db.verificationToken.delete({ where: { token } });
  }

  async createUser(data: Prisma.UserCreateInput) {
    return await db.user.create({ data });
  }
  async updateUser(id: number, data: Prisma.UserUpdateInput) {
    return await db.user.update({ where: { id }, data });
  }
}
