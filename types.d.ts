import { User } from "next-auth";
import { UserRole } from "@prisma/client";

declare module "next-auth" {
  interface User {
    role?: UserRole;
    is2FaEnabled?: boolean;
  }
}

import { JWT } from "next-auth/jwt";

declare module "next-auth/jwt" {
  interface JWT {
    role: UserRole;
    is2FaEnabled?: boolean;
  }
}
