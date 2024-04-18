"use client";

import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { socialLogin } from "@/actions/login";

export const Social = () => {

  return (
    <div className="flex items-center w-full gap-x-2">
      <Button size="lg" className="w-full" variant="outline" onClick={() => socialLogin("google")}>
        <FcGoogle className="w-5 h-5" />
      </Button>
      <Button size="lg" className="w-full" variant="outline" onClick={() => socialLogin("github")}>
        <FaGithub className="w-5 h-5" />
      </Button>
    </div>
  );
};
