import { prisma } from '@/server/db';
import { type CreateNextContextOptions } from "@trpc/server/adapters/next";
import { getPagesServerAuthSession } from "../auth";
import { type CreateOldContextOptions } from "./trpc";

/**
 * this is temporary until next app route handler is fixed
 * current app route handler is missing, listenning to abort signal
 * @see https://github.com/vercel/next.js/discussions/48427
 * @see https://github.com/vercel/next.js/discussions/48682
 */

/**
 * This is the actual context you will use in your router. It will be used to process every request
 * that goes through your tRPC endpoint.
 *
 * @see https://trpc.io/docs/context
 */

export const createPagesTRPCContext = async (opts: CreateNextContextOptions) => {
  const { req, res } = opts;

  // Get the session from the server using the getServerSession wrapper function
  const session = await getPagesServerAuthSession({ req, res });

  return createOldInnerTRPCContext({
    session,
  });
};/**
 * This helper generates the "internals" for a tRPC context. If you need to use it, you can export
 * it from here.
 *
 * Examples of things you may need it for:
 * - testing, so we don't have to mock Next.js' req/res
 * - tRPC's `createSSGHelpers`, where we don't have req/res
 *
 * @see https://create.t3.gg/en/usage/trpc#-serverapitrpcts
 */

export const createOldInnerTRPCContext = (opts: CreateOldContextOptions) => {
  return {
    session: opts.session,
    prisma,
  };
};

