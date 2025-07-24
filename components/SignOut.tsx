"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

const Logout = () => {
  return (
    <Button
      onClick={() => signOut()}
      className="flex items-center gap-2 px-4 py-2 rounded-md text-white group bg-red-500 hover:bg-red-800 transition-all duration-300 hover:cursor-pointer w-full"
    >
      <span className="text-[16px]">
        Logout
      </span>
      <LogOut className="w-5 h-5"/>
    </Button>
  );
};

export default Logout;
