"use server";

import * as z from "zod";
import bcrypt from "bcrypt";

import { auth } from "@/auth";
import { SettingsSchema } from "@/schemas";
import { getUserByEmail, getUserById } from "@/data/user";
import { db } from "@/lib/db";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";

export const settings = async (values: z.infer<typeof SettingsSchema>) => {
  const session = await auth();

  const user = session?.user;
  if (!user) return { error: "Unauthorized!" };

  const dbUser = await getUserById(user.id);
  if (!dbUser) return { error: "Unauthorized!" };

  if (user.isOAuth) {
    values.email = undefined;
    values.password = undefined;
    values.newPassword = undefined;
    values.is2FaEnabled = undefined;
  }

  if (values.email && values.email !== dbUser.email) {
    const existingUser = await getUserByEmail(values.email);

    if (existingUser) {
      return { error: "Email already in use!" };
    }

    const verificationToken = await generateVerificationToken(values.email);
    await sendVerificationEmail(values.email, verificationToken.token);

    await db.user.update({
      where: { id: dbUser.id },
      data: {
        emailVerified: null,
        email: values.email,
      },
    });

    return { success: "Verification email sent!" };
  }

  if (values.password && values.newPassword && dbUser.password) {
    const passwordMatch = bcrypt.compareSync(values.password, dbUser.password);

    if (!passwordMatch) {
      return { error: "Invalid credentials!" };
    }

    const hashedPassword = bcrypt.hashSync(values.newPassword, 10);

    values.password = hashedPassword;
    values.newPassword = undefined;
  }

  await db.user.update({
    where: { id: user.id },
    data: { ...values },
  });

  return { success: "Settings updated!" };
};
