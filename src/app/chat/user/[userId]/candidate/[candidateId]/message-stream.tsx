"use client";

import { useAtomValue } from "jotai";
import {
  chatCompletionPromptAtom,
  chatCompletionResAtom,
  chatCompletionStatusAtom,
  chatMessagesAtom,
  messageKeyTemplate,
  newMessageAtom,
} from "./chat-utils";
import { ChatMessage, type TChat } from "./message-box";
import { useEffect, useMemo, useRef } from "react";

// I split this component into two components to make it easier to understand
// and to optimize the rendering of the chatbox
// the first component only renders the prompt once
// the second component re-renders the message from SSE stream
// probably can be optimized further by using react.memo and more separation

function MessagePrompt({ ...props }: TChat) {
  const prompt = useAtomValue(chatCompletionPromptAtom);
  const clientMessagesAtom = useAtomValue(chatMessagesAtom);
  const index = useMemo(() => clientMessagesAtom.length, [clientMessagesAtom]);
  return (
    <ChatMessage
      key={messageKeyTemplate(index.toString(), "client")}
      message={prompt}
      name={props.session.user.name ?? ""}
      image={props.session.user.image ?? undefined}
      id={messageKeyTemplate(index.toString(), "client")}
    />
  );
}

function MessageResponse({ ...props }: TChat) {
  const prompt = useAtomValue(chatCompletionResAtom);
  const clientMessagesAtom = useAtomValue(chatMessagesAtom);
  const index = useMemo(() => clientMessagesAtom.length, [clientMessagesAtom]);
  const ref = useRef<HTMLDivElement>(null);
  /**
   * @description scroll to the bottom of the chatbox on new message
   * interval of 100ms until the ref is null
   */
  useEffect(() => {
    let isFirstScroll = true;
    const interval = setInterval(() => {
      if (ref.current) {
        if (isFirstScroll) {
          isFirstScroll = false;
          ref.current.scrollIntoView({
            behavior: "instant",
            block: "end",
          });
          return;
        }
        ref.current.scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
      }
    }, 250);
    return () => clearInterval(interval);
  }, []);

  return (
    <ChatMessage
      ref={ref}
      key={messageKeyTemplate(index.toString(), "response")}
      message={prompt}
      name={props.candidate.name}
      image={props.candidate.image}
      id={messageKeyTemplate(index.toString(), "response")}
    />
  );
}

function MessageStream({ ...props }: TChat) {
  const status = useAtomValue(chatCompletionStatusAtom);
  if (status !== "streaming") {
    return null;
  }

  return (
    <>
      <MessagePrompt {...props} />
      <MessageResponse {...props} />
    </>
  );
}

export default MessageStream;
