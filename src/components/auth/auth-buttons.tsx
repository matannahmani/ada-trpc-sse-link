"use client";

import { signIn } from "next-auth/react";
import { Button } from "@ui/button";
import Image from "next/image";

const AuthButtons = () => {
  return (
    <div className="flex flex-col gap-2">
      <Button onClick={() => signIn("google")} className="font-semibold">
        <Image
          className="mr-2"
          src="/google.webp"
          alt="Google Logo"
          width={20}
          height={20}
        />
        Continue with Google
      </Button>
    </div>
  );
};

export default AuthButtons;
