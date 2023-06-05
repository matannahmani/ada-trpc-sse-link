/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { api } from "@/trpc/server";
import { type Candidate } from "@prisma/client";
import { Avatar, AvatarImage } from "@ui/avatar";
import { Separator } from "@ui/separator";
import type { Session } from "next-auth";
import { Suspense, forwardRef, memo } from "react";

export type TChat = {
  candidate: Candidate;
  session: Session;
};

const ChatAvatar = memo(({ image }: { image: string | undefined }) => {
  return (
    <Avatar className="mr-2 h-12 w-12 rounded-sm">
      <AvatarImage src={image} className="object-cover" />
    </Avatar>
  );
});
ChatAvatar.displayName = "ChatAvatar";

const ChatMessageHeader = memo(({ name }: { name: string }) => {
  return (
    <div className="w-fit">
      <p className="w-fit text-sm font-medium leading-none">{name}</p>
      <Separator className="my-1" />
    </div>
  );
});
ChatMessageHeader.displayName = "ChatMessageHeader";

const ChatMessageBody = memo(({ message }: { message: string }) => {
  return <p>{message}</p>;
});
ChatMessageBody.displayName = "ChatMessageBody";

type ChatMessageProps = {
  id: string;
  image?: string;
  name: string;
  message: string;
};

const ChatMessage = forwardRef<HTMLDivElement, ChatMessageProps>(
  ({ id, image, name, message }, ref) => {
    return (
      <div ref={ref} id={id} className="flex gap-2">
        <ChatAvatar image={image} />
        <div>
          <ChatMessageHeader name={name} />
          <ChatMessageBody message={message} />
        </div>
      </div>
    );
  }
);

ChatMessage.displayName = "ChatMessage";
export { ChatMessage };

const MessagePlaceholder = () => {
  return (
    <div className="flex gap-2">
      <div className="mr-2 h-12 w-12 animate-pulse rounded-sm bg-muted/50"></div>
      <p className="h-6 w-full animate-pulse rounded-sm bg-muted/50"></p>
    </div>
  );
};

async function ChatHistory({ ...props }: TChat) {
  const chat = await api.candidates.chatHistory.query({
    candidateId: props.candidate.id,
  });
  return (
    <>
      {chat.messages.map((message) => (
        <ChatMessage
          key={`message-${message.id}`}
          message={message.content}
          name={
            message.isResponse
              ? props.candidate.name
              : props.session.user?.name ?? ""
          }
          image={
            message.isResponse
              ? props.candidate.image
              : props.session.user?.image ?? undefined
          }
          id={`message-${message.id}`}
        />
      ))}
    </>
  );
}

const MessageBox = ({
  candidate,
  session,
  children,
}: TChat & {
  children: React.ReactNode;
}) => {
  return (
    <div
      id="chat-container"
      className=" backdrop-blur [&>*:nth-child(even)]:bg-muted/50  [&>*:nth-child(odd)]:bg-background [&>*]:p-4"
    >
      <ChatMessage
        name={candidate?.name}
        message={`Hello and welcome! I'm ${candidate?.name}, and I'm
            representing the ${candidate?.party}. As a chatbot, I'm here to
            assist you and provide information about our campaign and political
            agendas. Whether you have questions, concerns, or simply want to learn
            more about what we do, feel free to ask. I'm here to help! So,
            ${session?.user?.name ?? ""}, how can I assist you today?`}
        image={candidate?.image ?? undefined}
        id={"opening-message"}
      />
      <Suspense
        fallback={new Array(3).fill(0).map((_, i) => (
          <MessagePlaceholder key={`placeholder-${i}`} />
        ))}
      >
        {/* @ts-expect-error async component */}
        <ChatHistory candidate={candidate} session={session} />
        {children}
      </Suspense>
    </div>
  );
};

export default MessageBox;
