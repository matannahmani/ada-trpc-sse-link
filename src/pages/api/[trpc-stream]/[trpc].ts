/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { createNextApiHandler } from "@trpc/server/adapters/next";
import { type NextApiRequest, type NextApiResponse } from "next";
import { type AnyProcedure } from "@trpc/server";
import { isObservable } from "@trpc/server/observable";
import { appRouter } from "@/server/api/root";
import { createPagesTRPCContext } from "@/server/api/trpc-pages-api-handler";

/**
 * @todo improve typings
 * @return a trpc handler that allows you to communicate with a SSE endpoint's
 * @deprecated waiting for next to implement abort signal on Route handlers
 * @see https://github.com/vercel/next.js/discussions/48682
 * @see https://github.com/vercel/next.js/discussions/48427

 */
const defaultHandler = createNextApiHandler({
  // @ts-expect-error - this is a hacky way to generate the context,
  // the context originally expects a Route handler which has different typings
  createContext: createPagesTRPCContext,
  router: appRouter,
  onError: (opts) => {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    console.error(`Unhandled error for '${opts.path}'`, opts.error);
  },
});

const handler = async (request: NextApiRequest, response: NextApiResponse) => {
  // https://github.com/trpc/trpc/blob/7ad695ea33810a162808c43b6fba1fb920e05325/packages/server/src/adapters/next.ts#L23
  // https://github.com/trpc/trpc/blob/7ad695ea33810a162808c43b6fba1fb920e05325/packages/server/src/core/router.ts#L345
  // @ts-expect-error - this is a hacky way to get the procedure name
  const procedure = appRouter?._def?.procedures?.[
    request.query.trpc as string
  ] as AnyProcedure | undefined;
  if (request.method === "GET" && procedure?._def?.subscription) {
    const ctx = await createPagesTRPCContext({ req: request, res: response });

    try {
      // TODO: support POST
      // https://github.com/trpc/trpc/blob/7ad695ea33810a162808c43b6fba1fb920e05325/packages/server/src/http/resolveHTTPResponse.ts#L25
      // TODO https://github.com/trpc/trpc/blob/7ad695ea33810a162808c43b6fba1fb920e05325/packages/server/src/http/resolveHTTPResponse.ts#L141-L145
      // https://gist.github.com/OutdatedVersion/8ea31e6790d6514094487e2f76e1b652
      const input = request.query.input
        ? JSON.parse(request.query.input as string)
        : undefined;

      const call = {
        type: "subscription",
        ctx,
        path: request.query.trpc as string,
        input,
        rawInput: input,
      } as const;

      const res = await procedure(call);

      if (!isObservable(res)) {
        response?.end();
        throw new Error(`subscription must return observable`);
      }

      response?.writeHead(200, {
        Connection: "keep-alive",
        "Cache-Control": "no-cache, no-transform",
        "Content-Type": "text/event-stream;charset=utf-8",
        "Access-Control-Allow-Origin": "*",
      });
      response?.flushHeaders();

      // https://github.com/trpc/trpc/blob/7ad695ea33810a162808c43b6fba1fb920e05325/packages/server/src/http/resolveHTTPResponse.ts#L189-L193
      const subscription = res?.subscribe({
        /**
         *
         * @param value - the value of the observable (the data)
         * @return {void} - send the packet to the client
         */
        next(value) {
          // https://html.spec.whatwg.org/multipage/server-sent-events.html#server-sent-events
          response?.write(`event:data\ndata: ${JSON.stringify(value)}\n\n`);
        },
        error(err) {
          console.error("server subscription error", err);
          response?.end();
        },
        complete() {
          response?.end("event:end\ndata: {}\n\n");
        },
      });

      response.on("close", () => {
        subscription?.unsubscribe();
      });
      response.on("abort", () => {
        subscription?.unsubscribe();
      });

      request.on("close", () => {
        subscription?.unsubscribe();
      });
      request.on("end", () => {
        subscription?.unsubscribe();
      });
      request.on("error", () => console.error("request error"));
      request.on("pause", () => console.log("request paused"));
    } catch (error) {
      // https://github.com/trpc/trpc/blob/7ad695ea33810a162808c43b6fba1fb920e05325/packages/server/src/http/resolveHTTPResponse.ts#L198-L202
      console.error("Uncaught subscription error", error);
      response?.end();
    }
    return;
  }

  return defaultHandler(request, response);
};

export default handler;
