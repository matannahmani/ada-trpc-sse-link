/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { TRPCClientError, type TRPCLink } from "@trpc/client";
import { type AnyRouter } from "@trpc/server";
import { observable } from "@trpc/server/observable";

/**
 * @todo improve typings
 * @return {TRPCLink} that allows you to connect to a SSE endpoint
 */
export const httpSseLink = <TRouter extends AnyRouter>(opts: {
  baseUrl: string;
  EventSource?: typeof EventSource;
}): TRPCLink<TRouter> => {
  const open = ({
    url,
    handleEvent,
    handleError,
    handleCloseRequest,
    handleOpen,
  }: any) => {
    const es = opts.EventSource
      ? new opts.EventSource(url)
      : new EventSource(url);

    es.onopen = () => {
      // usually when the first packet is sent
      handleOpen();
    };

    es.onerror = (error: unknown) => {
      if (error instanceof Error) {
        handleError(new TRPCClientError(error.message));
        return;
      }
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      handleError(new TRPCClientError(`${error}`));
    };

    es.addEventListener("data", ({ data }) => {
      handleEvent(JSON.parse(data.trim()));
    });
    es.addEventListener("end", () => {
      handleCloseRequest();
    });

    return {
      close: () => {
        es.close();
      },
    };
  };

  return (_) => {
    return ({ op }) => {
      if (op.type !== "subscription") {
        throw new Error("httpSseLink must use subscription type");
      }

      const getUrl = () => {
        let url = `${opts.baseUrl}/${op.path}`;
        if (op.input !== undefined) {
          url += `?input=${encodeURIComponent(JSON.stringify(op.input))}`;
        }
        return url;
      };

      return observable((observer) => {
        const handleEvent = (data: /*json*/ any) => {
          observer.next({ result: { type: "data", data }, context: {} });
        };

        const source = open({
          url: getUrl(),
          handleEvent,
          /**
           * @explantion handle router client error
           */
          handleError: (error: TRPCClientError<AnyRouter>) => {
            observer.error(error);
          },
          handleCloseRequest: () => {
            observer.next({ result: { type: "stopped" } });
            observer.complete();
          },
          handleOpen: () => {
            observer.next({ result: { type: "started" } });
          },
        });

        return () => {
          console.log("something something");
          source.close();
        };
      });
    };
  };
};
