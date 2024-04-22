"use client";

import { useSearchParams } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { socialLogin } from "@/actions/login";

export const Social = () => {
  const searchParams = useSearchParams();

  const callbackUrl = searchParams.get("callbackUrl");

  return (
    <div className="flex items-center w-full gap-x-2">
      <Button size="lg" className="w-full" variant="outline" onClick={() => socialLogin("google", callbackUrl)}>
        <FcGoogle className="w-5 h-5" />
      </Button>
      <Button size="lg" className="w-full" variant="outline" onClick={() => socialLogin("github", callbackUrl)}>
        <FaGithub className="w-5 h-5" />
      </Button>
    </div>
  );
};
