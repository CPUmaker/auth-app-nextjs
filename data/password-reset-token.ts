import { db } from "@/lib/db";

export const getPassowrdResetTokenByEmail = async (email: string) => {
  try {
    const resetToken = await db.passwordResetToken.findFirst({
      where: { email },
    });
    return resetToken;
  } catch {
    return null;
  }
};

export const getPassowrdResetTokenByToken = async (token: string) => {
  try {
    const resetToken = await db.passwordResetToken.findUnique({
      where: { token },
    });
    return resetToken;
  } catch {
    return null;
  }
};
