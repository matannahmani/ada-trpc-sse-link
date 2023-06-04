/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { env } from "@/env.mjs";
import { appRouter } from "@/server/api/root";
import { createTRPCContext } from "@/server/api/trpc";
import { type AnyProcedure } from "@trpc/server";
import { isObservable } from "@trpc/server/observable";
import EventSource from "eventsource";
import { NextApiRequest, NextApiResponse } from "next";

const defaultHandler = (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: createTRPCContext,
    onError:
      env.NODE_ENV === "development"
        ? ({ path, error }) => {
            console.error(
              `❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`
            );
          }
        : undefined,
  });

export { defaultHandler as GET, defaultHandler as POST };
