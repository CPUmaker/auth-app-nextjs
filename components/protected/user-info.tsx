import { User } from "next-auth";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface UserInfoProps {
  user?: User;
  label: string;
}

export const UserInfo = ({ user, label }: UserInfoProps) => {
  const info = [
    {
      label: "ID",
      value: user?.id,
    },
    {
      label: "Name",
      value: user?.name,
    },
    {
      label: "Email",
      value: user?.email,
    },
    {
      label: "Role",
      value: user?.role,
    },
    {
      label: "2FA Authentication",
      value: user?.is2FaEnabled,
    },
  ];

  return (
    <Card className="w-[600px] shadow-md">
      <CardHeader>
        <p className="text-2xl font-semibold text-center">
          {label}
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        {info.map((elem) => (
          <div key={elem.label} className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
            <p className="text-sm font-medium">{elem.label}</p>
            {
              elem.label === "2FA Authentication" ?
              <Badge variant={elem.value ? "success" : "destructive"}>
                {elem.value ? "ON" : "OFF"}
              </Badge> :
              <p className="truncate text-xs max-w-[180px] font-mono p-1 bg-slate-100 rounded-md">
                {elem.value}
              </p>
            }
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
