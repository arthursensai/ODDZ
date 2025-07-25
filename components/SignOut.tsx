"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

const Logout = () => {
  return (
    <Button
      onClick={() => signOut()}
      className="flex items-center gap-2 px-4 py-2 rounded-md group bg- text-red-500 hover:text-red-800 transition-all duration-300 hover:cursor-pointer"
      variant="link"
    >
      <span className="text-[16px]">
        Logout
      </span>
    </Button>
  );
};

export default Logout;
