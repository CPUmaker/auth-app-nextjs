"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { UserButton } from "@/components/auth/user-button";

const tabs = [
  {
    path: "/settings",
    name: "Settings",
  },
  {
    path: "/admin",
    name: "Admin",
  },
  {
    path: "/server",
    name: "Server",
  },
  {
    path: "/client",
    name: "Client",
  },
];

export const NavBar = () => {
  const pathname = usePathname();

  return (
    <nav className="bg-secondary flex justify-between p-4 rounded-xl w-[600px] shadow-sm">
      <div className="flex gap-x-2">
        {tabs.map((tab) => (
          <Button key={tab.name} asChild variant={pathname === tab.path ? "default" : "outline"}>
          <Link href={tab.path}>{tab.name}</Link>
        </Button>
        ))}
      </div>
      <UserButton />
    </nav>
  );
};
