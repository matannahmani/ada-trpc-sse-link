import AuthRequiredPage from "@/components/auth/auth-required";
import { getServerAuthSession } from "@/server/auth";
import { api } from "@/trpc/server";
import { Avatar, AvatarImage } from "@ui/avatar";
import { Button } from "@ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
  HoverCardArrow,
} from "@ui/hover-card";
import { ScrollArea } from "@ui/scroll-area";
import { Separator } from "@ui/separator";
import { Textarea } from "@ui/textarea";
import { Send } from "lucide-react";

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
          <div
            id="chat-container"
            className=" [&>*:nth-child(even)]:bg-gray-800  [&>*:nth-child(odd)]:bg-background [&>*]:p-4"
          >
            <div className="flex gap-2">
              <Avatar className="mr-2 h-12 w-12 rounded-sm">
                <AvatarImage src={candidate?.image} className="object-cover" />
              </Avatar>
              <p>
                Hello and welcome! I&apos;m {candidate?.name}, and I&apos;m
                representing the {candidate?.party}. As a chatbot, I&apos;m here
                to assist you and provide information about our campaign and
                political agendas. Whether you have questions, concerns, or
                simply want to learn more about what we do, feel free to ask.
                I&apos;m here to help! So, hello Person {session?.user?.name},
                how can I assist you today?
              </p>
            </div>
            <div className="flex gap-2">
              <Avatar className="mr-2 h-12 w-12 rounded-sm">
                <AvatarImage
                  src={session?.user.image}
                  className="object-cover"
                />
              </Avatar>
              <p>
                Hello {candidate?.name}, I would like to know more about your
                plan for climate changes.
              </p>
            </div>
            <div className="flex gap-2">
              <Avatar className="mr-2 h-12 w-12 rounded-sm">
                <AvatarImage src={candidate?.image} className="object-cover" />
              </Avatar>
              <p>
                Hello and welcome! I&apos;m {candidate?.name}, and I&apos;m
                representing the {candidate?.party}. As a chatbot, I&apos;m here
                to assist you and provide information about our campaign and
                political agendas. Whether you have questions, concerns, or
                simply want to learn more about what we do, feel free to ask.
                I&apos;m here to help! So, hello Person {session?.user?.name},
                how can I assist you today?
              </p>
            </div>
            <div className="flex gap-2">
              <Avatar className="mr-2 h-12 w-12 rounded-sm">
                <AvatarImage
                  src={session?.user.image}
                  className="object-cover"
                />
              </Avatar>
              <p>
                Hello {candidate?.name}, I would like to know more about your
                plan for climate changes.
              </p>
            </div>
          </div>
        </ScrollArea>
        <div className="relative flex items-center shadow-xl">
          <Textarea placeholder="Type your message here." />
          <div className="absolute right-4">
            <HoverCard openDelay={0}>
              <HoverCardTrigger>
                <button>
                  <Send />
                </button>
              </HoverCardTrigger>
              <HoverCardContent>
                <p>Send message</p>
                <HoverCardArrow />
              </HoverCardContent>
            </HoverCard>
          </div>
        </div>
      </div>
    </AuthRequiredPage>
  );
}

export default ChatPage;
