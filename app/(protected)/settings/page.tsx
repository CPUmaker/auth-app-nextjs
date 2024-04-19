"use client";

import { logout } from "@/actions/logout";
import { useUser } from "@/hooks/use-user";


const SettingsPage = () => {
  const user = useUser();

  const handleClick = () => {
    logout();
  };

  return (
    <div className="bg-white p-10 rounded-xl">
      <button onClick={handleClick}>Sign Out</button>
    </div>
  );
};

export default SettingsPage;
