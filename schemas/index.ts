import { UserRole } from "@prisma/client";
import * as z from "zod";

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, { message: "Password is required" }),
  code: z.optional(z.string()),
});

export const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, { message: "Minimum 6 characters is required" }),
  name: z.string().min(6, { message: "Name is required" }),
});

export const ResetSchema = z.object({
  email: z.string().email(),
});

export const NewPasswordSchema = z.object({
  password: z.string().min(6, { message: "Minimum 6 characters is required" }),
});

export const SettingsSchema = z.object({
  name: z.optional(z.string()),
  is2FaEnabled: z.optional(z.boolean()),
  role: z.optional(z.enum([UserRole.ADMIN, UserRole.USER])),
  email: z.optional(z.string().email()),
  password: z.optional(z.string().min(6)),
  newPassword: z.optional(z.string().min(6)),
})
  .refine((data) => {
    if (data.password && !data.newPassword) {
      return false;
    }

    return true;
  }, {
    message: "New password is required!",
    path: ["newPassword"],
  })
  .refine((data) => {
    if (!data.password && data.newPassword) {
      return false;
    }

    return true;
  }, {
    message: "Password is required!",
    path: ["password"],
  });
