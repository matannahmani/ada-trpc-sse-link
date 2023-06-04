import AuthRequiredPage from "@/components/auth/auth-required";
import { getServerAuthSession } from "@/server/auth";
import { api } from "@/trpc/server";
import { ScrollArea } from "@ui/scroll-area";
import { Separator } from "@ui/separator";
import ChatBox from "./chatbox";
import MessageBox from "./message-box";
import MessageStream from "./message-stream";

async function ChatPage({ params }: { params: { id: string } }) {
  const candidate = await api.candidates.show.query({ id: Number(params.id) });
  const session = await getServerAuthSession();
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
            <MessageStream
              candidate={candidate}
              session={session as NonNullable<typeof session>}
            />
          </MessageBox>
        </ScrollArea>
        <ChatBox />
      </div>
    </AuthRequiredPage>
  );
}

export default ChatPage;
