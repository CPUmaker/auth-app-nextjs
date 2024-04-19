import { auth } from "@/auth";
import { UserInfo } from "@/components/protected/user-info";

const ServerPage = async () => {
  const session = await auth();
  const user = session?.user;

  return (
    <UserInfo user={user} label="💻 Server Component" />
  );
};

export default ServerPage;
