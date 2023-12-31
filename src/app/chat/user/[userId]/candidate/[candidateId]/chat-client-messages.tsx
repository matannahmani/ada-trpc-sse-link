"use client";
import { useAtomValue } from "jotai";
import { ChatMessage, TChat } from "./message-box";
import { chatMessagesAtom, messageKeyTemplate } from "./chat-utils";
import { useEffect } from "react";

export const ClientChatMessages = ({ ...props }: TChat) => {
  const messages = useAtomValue(chatMessagesAtom);
  useEffect(() => {
    console.log("messages", messages);
  }, [messages]);
  return (
    <>
      {messages.map((message, index) => {
        return (
          <>
            <ChatMessage
              image={props.session.user.image ?? undefined}
              id={messageKeyTemplate(index.toString(), "client")}
              name={props.session.user.name ?? ""}
              message={message.question}
            />
            <ChatMessage
              image={props.candidate.image}
              id={messageKeyTemplate(index.toString(), "response")}
              name={props.candidate.name}
              message={message.answer}
            />
          </>
        );
      })}
    </>
  );
};
