/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { env } from "@/env.mjs";
import { appRouter } from "@/server/api/root";
import { createTRPCContext } from "@/server/api/trpc";
import { type AnyProcedure } from "@trpc/server";
import { isObservable } from "@trpc/server/observable";
export const runtime = "nodejs";
// This is required to enable streaming
export const dynamic = "force-dynamic";
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
const handler = async (
  req: Request,
  context: {
    params: { trpc: string | string[] };
  }
) => {
  if (Array.isArray(context.params.trpc)) {
    return fetchRequestHandler({
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
  }
  // @ts-expect-error @todo to fix it
  const procedure = appRouter?._def?.procedures?.[context.params.trpc] as
    | AnyProcedure
    | undefined;
  if (req.method === "GET" && procedure?._def.subscription) {
    const resHeaders = new Headers();
    const ctx = await createTRPCContext({
      req,
      resHeaders,
    });
    // Create a TransformStream for writing the response as the tokens as generated
    const responseStream = new TransformStream();
    const writer = responseStream.writable.getWriter();
    const encoder = new TextEncoder();
    try {
      // TODO: support POST
      // https://github.com/trpc/trpc/blob/7ad695ea33810a162808c43b6fba1fb920e05325/packages/server/src/http/resolveHTTPResponse.ts#L25
      // TODO https://github.com/trpc/trpc/blob/7ad695ea33810a162808c43b6fba1fb920e05325/packages/server/src/http/resolveHTTPResponse.ts#L141-L145
      // https://gist.github.com/OutdatedVersion/8ea31e6790d6514094487e2f76e1b652
      const urlParams = new URL(req.url).searchParams;
      const inputParams = urlParams.get("input");
      const input = inputParams ? JSON.parse(inputParams) : undefined;

      const call = {
        type: "subscription",
        ctx,
        path: context.params.trpc,
        input,
        rawInput: input,
      } as const;

      const res = await procedure(call);
      if (!isObservable(res)) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        await writer.close();
        throw new Error(`subscription must return observable`);
      }

      // https://github.com/trpc/trpc/blob/7ad695ea33810a162808c43b6fba1fb920e05325/packages/server/src/http/resolveHTTPResponse.ts#L189-L193
      try {
        const subscription = res.subscribe({
          next(value) {
            // https://html.spec.whatwg.org/multipage/server-sent-events.html#server-sent-events
            void writer?.write(
              encoder.encode(`event:data\ndata: ${JSON.stringify(value)}\n\n`)
            );
          },
          error(err) {
            console.log("server subscription error", err);
            void writer.abort(err);
            // subscription?.unsubscribe();
          },
          complete() {
            console.log("server subscription complete");
            void writer.write(encoder.encode("event:end\ndata: {}\n\n"));
            void writer.close();
            // subscription?.unsubscribe();
          },
        });
      } catch (err) {
        console.log("server subscription error", err);
        void writer.abort(err);
      }
    } catch (error) {
      // https://github.com/trpc/trpc/blob/7ad695ea33810a162808c43b6fba1fb920e05325/packages/server/src/http/resolveHTTPResponse.ts#L198-L202
      console.error("Uncaught subscription error", error);
      void writer.abort(error);
    }
    // return new Response(responseStream.readable, {
    //   headers: {
    //     Connection: "keep-alive",
    //     "Content-Type": "text/event-stream",
    //     "Cache-Control": "no-cache, no-transform",
    //     "Access-Control-Allow-Origin": "*",
    //   },
    // });
    return new Response(responseStream.readable, {
      status: 200,
      headers: {
        Connection: "keep-alive",
        "Cache-Control": "no-cache, no-transform",
        "Content-Type": "text/event-stream;charset=utf-8",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }
  return fetchRequestHandler({
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
};
export { handler as GET, defaultHandler as POST };
