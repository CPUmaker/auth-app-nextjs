import { auth, signOut } from "@/auth";
import { Button } from "@/components/ui/button";

const SettingsPage = async () => {
  const session = await auth();
  return <div>
    <p>{JSON.stringify(session)}</p>
    <form action={async () => {
      "use server";

      await signOut();
    }}>
      <button type="submit">Sign Out</button>
    </form>
  </div>;
};

export default SettingsPage;
