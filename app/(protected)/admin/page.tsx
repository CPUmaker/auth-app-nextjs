"use client";

import { UserRole } from "@prisma/client";

import { FormSuccess } from "@/components/form-success";
import { RoleGate } from "@/components/protected/role-gate";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks/use-user";
import { toast } from "sonner";
import { admin } from "@/actions/admin";

const AdminPage = () => {
  const user = useUser();

  const role = user?.role;

  const handleApiRouteClick = () => {
    fetch("/api/admin")
      .then((res) => {
        if (res.ok) {
          toast.success("Allowed API Route!");
        } else {
          toast.error("FORBIDDEN!!!");
        }
      });
  };

  const handleServerActionClick = async () => {
    const { error, success } = await admin();

    if (error) {
      toast.error(error);
    }
    if (success) {
      toast.success(success);
    }
  }

  return (
    <Card className="w-[600px]">
      <CardHeader>
        <p className="text-2xl font-semibold text-center">🌟 Admin</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <RoleGate allowedRole={UserRole.ADMIN}>
          <FormSuccess message="Welcome, admin!" />
        </RoleGate>
        <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-md">
          <p className="text-sm font-medium">
            Admin-only API Route
          </p>
          <Button onClick={handleApiRouteClick}>
            Click to test
          </Button>
        </div>
        <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-md">
          <p className="text-sm font-medium">
            Admin-only Server Action
          </p>
          <Button onClick={handleServerActionClick}>
            Click to test
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminPage;