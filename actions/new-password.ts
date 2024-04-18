"use server";

import * as z from "zod";
import { hashSync } from "bcrypt";

import { NewPasswordSchema } from "@/schemas";
import { getUserByEmail } from "@/data/user";
import { generatePasswordResetToken } from "@/lib/tokens";
import { sendPasswordResetEmail } from "@/lib/mail";
import { getPassowrdResetTokenByToken } from "@/data/password-reset-token";
import { db } from "@/lib/db";

export const newPassword = async (
  values: z.infer<typeof NewPasswordSchema>,
  token: string
) => {
  const validatedFields = NewPasswordSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid email!" };
  }

  const { password } = validatedFields.data;

  const existingToken = await getPassowrdResetTokenByToken(token);

  if (!existingToken) {
    return { error: "Invalid token!" };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) {
    return { error: "Token has expired!" };
  }

  const existingUser = await getUserByEmail(existingToken.email);

  if (!existingUser) {
    return { error: "Email not found!" };
  }

  await db.user.update({
    where: { id: existingUser.id },
    data: { password: hashSync(password, 10) },
  });

  await db.passwordResetToken.delete({
    where: { id: existingToken.id },
  });

  return { success: "New password set!" };
};
