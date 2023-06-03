import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { prisma } from "@/server/db";
import { z } from "zod";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const candidatesRouter = createTRPCRouter({
  // add your API routers here
  show: publicProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .query(async ({ input }) => {
      const { id } = input;
      const candidate = await prisma.candidate.findUnique({
        where: {
          id: id,
        },
      });
      return candidate;
    }),
  list: publicProcedure.query(async () => {
    const candidates = await prisma.candidate.findMany();
    return candidates;
  }),
});
