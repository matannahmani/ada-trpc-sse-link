import { createTRPCRouter } from "@/server/api/trpc";
import { candidatesRouter } from "./routes/candidates";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  candidates: candidatesRouter,
  // add your API routers here
});

// export type definition of API
export type AppRouter = typeof appRouter;
