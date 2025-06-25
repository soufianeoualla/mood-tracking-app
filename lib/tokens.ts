import { db } from "@/config/db";
import { UserRepository } from "@/prisma/repositories/user.repository";

import { v4 as uuid } from "uuid";

const userRepository = new UserRepository();

export const generateVerificationToken = async (email: string) => {
  const token = uuid();
  const expires = new Date(new Date().getTime() + 3600 * 1000);
  const existingToken = await userRepository.getVerificationToken(email);
  if (existingToken)
    await db.verificationToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  const verficationToken = await db.verificationToken.create({
    data: {
      token,
      email,
      expires_at: expires,
    },
  });
  return verficationToken;
};

export const generateResetToken = async (email: string) => {
  const token = uuid();
  const expires = new Date(new Date().getTime() + 3600 * 1000);
  const existingToken = await userRepository.getVerificationToken(email);

  if (existingToken)
    await db.resetToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  const resetToken = await db.resetToken.create({
    data: {
      token,
      email,
      expires_at: expires, 
    },
  });
  return resetToken;
};
