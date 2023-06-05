import AuthRequiredPage from "@/components/auth/auth-required";
import { getServerAuthSession } from "@/server/auth";
import { api } from "@/trpc/server";
import { ScrollArea } from "@ui/scroll-area";
import { Separator } from "@ui/separator";
import ChatBox from "./chatbox";
import { ClientChatMessages } from "./chat-client-messages";
import MessageBox from "./message-box";
import MessageStream from "./message-stream";
import { redirect } from "next/navigation";

export const dynamic = "auto";
// revaildate every 24 hours we will use next on demand revalidation endpoint on new messages
// export const revalidate = 86400;
export const fetchCache = "auto";
export const runtime = "nodejs";
export const preferredRegion = "auto";

async function ChatPage({
  params,
}: {
  params: { userId: string; candidateId: string };
}) {
  const candidate = await api.candidates.show.query({
    id: Number(params.candidateId),
  });
  const session = await getServerAuthSession();
  if (!session && params.userId !== "-1") {
    redirect(`/chat/user/-1/candidate/${params.candidateId}`);
  }
  if (session && params.userId !== session.user.id) {
    redirect(`/chat/user/${session.user.id}/candidate/${params.candidateId}`);
  }
  return (
    // @ts-expect-error async component not support by typescript yet
    <AuthRequiredPage>
      <div className="mr-auto  max-w-full lg:max-w-xl">
        <div className="w-fit px-2">
          <h1 className="font-semibold">{candidate?.name}</h1>
          <Separator className="my-2" />
        </div>
        <ScrollArea className="h-[calc(100vh-240px)] py-2 ">
          <MessageBox
            candidate={candidate}
            session={session as NonNullable<typeof session>}
          >
            <>
              <ClientChatMessages
                candidate={candidate}
                session={session as NonNullable<typeof session>}
              />
              <MessageStream
                candidate={candidate}
                session={session as NonNullable<typeof session>}
              />
            </>
          </MessageBox>
        </ScrollArea>
        <ChatBox />
      </div>
    </AuthRequiredPage>
  );
}

export default ChatPage;
