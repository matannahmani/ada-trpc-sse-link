"use client";
import { Button } from "@ui/button";
import { signIn } from "next-auth/react";
import Image from "next/image";

/**
 * @explaination - This component is a button that when clicked, will sign the user in with google
 * @returns - A button that when clicked, will sign the user in with google
 * @clientonly
 */
const ProfileMenuUnlogged = () => (
  <Button onClick={() => signIn("google")} className="font-semibold">
    <Image
      className="mr-2"
      src="/google.webp"
      alt="Google Logo"
      width={20}
      height={20}
    />
    Login
  </Button>
);

export default ProfileMenuUnlogged;
