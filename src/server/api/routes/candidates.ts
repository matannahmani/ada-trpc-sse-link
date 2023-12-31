/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-floating-promises */
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { prisma } from "@/server/db";
import { observable } from "@trpc/server/observable";
import { z } from "zod";
// this package is only for now, streaming is a bit messed in offical sdk
import { OpenAI } from "openai-streams";
import { TRPCError } from "@trpc/server";
import { env } from "@/env.mjs";
import { revalidatePath, revalidateTag } from "next/cache";
import { generateCacheTag } from "@/trpc/shared";

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
      if (!candidate) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Candidate not found",
        });
      }
      return candidate;
    }),
  list: publicProcedure.query(async () => {
    const candidates = await prisma.candidate.findMany();
    return candidates;
  }),
  chatHistory: protectedProcedure
    .input(
      z.object({
        candidateId: z.number(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { candidateId } = input;
      const chatInformation = await prisma.chat.findFirst({
        where: {
          candidateId: candidateId,
          userId: ctx.session.user.id,
        },
        include: {
          messages: true,
          candidate: true,
        },
      });

      // if there is no chat information create one
      if (!chatInformation) {
        const candidate = await prisma.candidate.findUnique({
          where: {
            id: candidateId,
          },
        });
        if (!candidate) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Candidate not found",
          });
        }
        const newChatInformation = await prisma.chat.create({
          data: {
            userId: ctx.session.user.id,
            candidateId: candidateId,
          },
        });
        return {
          ...newChatInformation,
          candidate: candidate,
          messages: [],
        };
      }
      if (!chatInformation.candidate) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Candidate not found",
        });
      }
      type ChatInformation = Omit<typeof chatInformation, "candidate"> & {
        candidate: NonNullable<(typeof chatInformation)["candidate"]>;
      };
      // typescript is not smart enough to understand that candidate is not null
      return chatInformation as ChatInformation;
    }),
  chatComplete: protectedProcedure
    .input(
      z.object({
        candidateId: z.number(),
        message: z.string().min(0).max(512),
      })
    )
    .subscription(async ({ input, ctx }) => {
      const { candidateId, message } = input;
      const chat = await prisma.chat.findFirst({
        where: {
          candidateId: candidateId,
          userId: ctx.session.user.id,
        },
        include: {
          candidate: true,
        },
      });
      if (!chat) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Chat not found",
        });
      }
      if (!chat.candidate) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Candidate not found",
        });
      }
      const { candidate } = chat;
      const moreInformationKeyword = "**I need more information**";
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
      const data = await OpenAI(
        "chat",
        {
          messages: [
            {
              content: `You're acting as candidate: ${candidate.name} personalized chatbot,
              you're goal is to provide accuracte responses while taking in considiration the candidate opinion and party: ${candidate.party}
              A person is asking you: ${message}, what is your response?
              in case of missing information you can ask for more information by saying: "${moreInformationKeyword}"`,
              role: "user",
            },
          ],
          model: "gpt-3.5-turbo",
        },
        {
          apiKey: env.OPEN_AI_API_KEY,
          // mode: 'raw',
        }
      );
      const reader = data.getReader();
      const decoder = new TextDecoder("utf-8");

      let content = "";
      let whileDecoding = true;
      return observable<string>((sub) => {
        (async () => {
          while (whileDecoding) {
            const { value, done } = await reader.read();
            const decoded = decoder.decode(value);
            content += decoded;
            sub.next(decoded);
            if (done) {
              await prisma.message.createMany({
                data: [
                  // user message first
                  {
                    chatId: chat.id,
                    content: message,
                  },
                  // bot message second
                  {
                    chatId: chat.id,
                    content,

                    isResponse: true,
                  },
                ],
              });
              //   // we revalidate the path on demand after every message.
              //   // this is bugged on nextjs 14.4.4
              //   // @see https://github.com/vercel/next.js/issues/50714
              //   // try {
              //   //   revalidateTag(
              //   //     generateCacheTag("candidates.chatHistory", {
              //   //       candidateId,
              //   //     })
              //   //   );
              //   // } catch (err) {
              //   //   console.error(err);
              //   // }
              whileDecoding = false;
              sub.complete();
            }
          }
        })();
      });
    }),
});
