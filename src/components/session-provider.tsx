"use client";
import { SessionProvider as SessionProviderAuth } from "next-auth/react";
import { type ReactElement } from "react";

function SessionProvider({ children }: { children: ReactElement }) {
  return <SessionProviderAuth>{children}</SessionProviderAuth>;
}
export default SessionProvider;
