import { v4 as uuidv4 } from "uuid";

import { getVerificationTokenByEmail } from "@/data/verification-token";
import { db } from "@/lib/db";
import { getPassowrdResetTokenByEmail } from "@/data/password-reset-token";

export const generateVerificationToken = async (email: string) => {
  const token = uuidv4();
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  const existingToken = await getVerificationTokenByEmail(email);
  if (existingToken) {
    db.verificationToken.delete({
      where: { id: existingToken.id },
    });
  }

  const verificationToken = await db.verificationToken.create({
    data: {
      email,
      token,
      expires,
    },
  });

  return verificationToken;
};

export const generatePasswordResetToken = async (email: string) => {
  const token = uuidv4();
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  const existingToken = await getPassowrdResetTokenByEmail(email);
  if (existingToken) {
    db.passwordResetToken.delete({
      where: { id: existingToken.id },
    });
  }

  const resetToken = await db.passwordResetToken.create({
    data: {
      email,
      token,
      expires,
    },
  });

  return resetToken;
};
