"use client";

import { UserInfo } from "@/components/protected/user-info";
import { useUser } from "@/hooks/use-user";

const ClientPage = () => {
  const user = useUser();

  return (
    <UserInfo user={user} label="📱 Client Component" />
  );
};

export default ClientPage;
