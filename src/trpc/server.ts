"use server";

import { generateCacheTag, getUrl, transformer } from "./shared";
import { httpBatchLink, httpLink, loggerLink } from "@trpc/client";
import { experimental_createTRPCNextAppDirServer } from "@trpc/next/app-dir/server";
import { headers } from "next/headers";
import { type AppRouter } from "@/server/api/root";
import { nextFetchLink } from "./next-fetch-link";

export const api = experimental_createTRPCNextAppDirServer<AppRouter>({
  config() {
    return {
      transformer,
      links: [
        // loggerLink({
        //   enabled: (op) =>
        //     process.env.NODE_ENV === "development" ||
        //     (op.direction === "down" && op.result instanceof Error),
        // }),
        httpLink({
          url: getUrl(),
          // @ts-expect-error - need to override headers type
          headers(ctx) {
            const cacheTag = generateCacheTag(ctx.op.path, ctx.op.input);
            let revalidate: number | false | undefined = false;
            if (
              ctx.op.context?.revalidate &&
              typeof ctx.op.context.revalidate === "number"
            ) {
              revalidate = ctx.op.context.revalidate;
            }
            // console.log(ctx.op.context);
            // Forward headers from the browser to the API
            return {
              ...Object.fromEntries(headers()),
              "x-trpc-source": "rsc",
              "next.tags": cacheTag,
              "next.revalidate": revalidate,
            };
          },
        }),
      ],
    };
  },
});

// export const createAction =
