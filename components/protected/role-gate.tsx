"use client";

import React from "react";
import { UserRole } from "@prisma/client";

import { useUser } from "@/hooks/use-user";
import { FormError } from "@/components/form-error";

interface RoleGateProps {
  children: React.ReactNode;
  allowedRole: UserRole;
}

export const RoleGate = ({ children, allowedRole }: RoleGateProps) => {
  const user = useUser();
  const role = user?.role;

  if (role !== allowedRole) {
    return (
      <FormError message="You do not have permission to view this content!" />
    );
  }

  return (
    <>{children}</>
  );
};
