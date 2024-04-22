"use server";

import { AuthError } from "next-auth";
import * as z from "zod";

import { signIn } from "@/auth";
import { LoginSchema } from "@/schemas";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { getUserByEmail } from "@/data/user";
import {
  generateTwoFactorToken,
  generateVerificationToken,
} from "@/lib/tokens";
import { sendTwoFactorEmail, sendVerificationEmail } from "@/lib/mail";
import { getTwoFactorTokenByEmail } from "@/data/two-factor-token";
import { db } from "@/lib/db";
import { getTwoFactorConfirmationByUserId } from "@/data/two-factor-confirmation";

export const login = async (values: z.infer<typeof LoginSchema>, callbackUrl: string | null) => {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { email, password, code } = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { error: "Invalid credentials!" };
  }

  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(email);
    await sendVerificationEmail(email, verificationToken.token);
    return { error: "Need confirm your email!" };
  }

  if (existingUser.is2FaEnabled) {
    if (!code) {
      const twoFactorToken = await generateTwoFactorToken(email);
      await sendTwoFactorEmail(email, twoFactorToken.token);
      return { twoFactor: true };
    }

    const twoFactorToken = await getTwoFactorTokenByEmail(email);

    if (!twoFactorToken || twoFactorToken.token !== code) {
      return { error: "Invalid code!" };
    }

    const hasExpired = new Date(twoFactorToken.expires) < new Date();

    if (hasExpired) {
      return { error: "Code has expired!" };
    }

    await db.twoFactorToken.delete({
      where: { id: twoFactorToken.id },
    });

    const existingConfirmation = await getTwoFactorConfirmationByUserId(
      existingUser.id
    );

    if (!existingConfirmation) {
      await db.twoFactorConfirmation.create({
        data: { userId: existingUser.id },
      });
    }
  }

  try {
    await signIn("credentials", { email, password, redirectTo: callbackUrl || DEFAULT_LOGIN_REDIRECT });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials!" };
        default:
          return { error: "Something went wrong!" };
      }
    }
    throw error;
  }
  return { success: "Successfully login!" };
};

export const socialLogin = async (provider: "github" | "google", callbackUrl: string | null) => {
  await signIn(provider, {
    redirectTo: callbackUrl || DEFAULT_LOGIN_REDIRECT,
  });
};
