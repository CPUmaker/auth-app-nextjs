"use server";

import { auth } from "@/auth";
import { UserRole } from "@prisma/client";

export const admin = async () => {
  const session = await auth();

  if (session?.user?.role !== UserRole.ADMIN) {
    return { error: "Forbidden!" };
  }

  return { success: "Allowed!" };
};
