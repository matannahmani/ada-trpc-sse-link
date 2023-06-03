import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { prisma } from "@/server/db";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const candidatesRouter = createTRPCRouter({
  // add your API routers here
  list: publicProcedure.query(async () => {
    const candidates = await prisma.candidate.findMany();
    return candidates;
  })
});
