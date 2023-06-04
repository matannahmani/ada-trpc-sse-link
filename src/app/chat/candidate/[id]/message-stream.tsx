"use client";

import { useAtomValue } from "jotai";
import {
  chatCompletionPromptAtom,
  chatCompletionResAtom,
  chatCompletionStatusAtom,
  newMessageAtom,
} from "./chatbox";
import { ChatMessage, type TChat } from "./message-box";

// I split this component into two components to make it easier to understand
// and to optimize the rendering of the chatbox
// the first component only renders the prompt once
// the second component re-renders the message from SSE stream
// probably can be optimized further by using react.memo and more separation

function MessagePrompt({ ...props }: TChat) {
  const prompt = useAtomValue(chatCompletionPromptAtom);
  return (
    <ChatMessage
      key={`new-message-client`}
      message={prompt}
      name={props.session.user.name ?? ""}
      image={props.session.user.image ?? undefined}
      id={`new-message-client`}
    />
  );
}

function MessageResponse({ ...props }: TChat) {
  const prompt = useAtomValue(chatCompletionResAtom);
  return (
    <ChatMessage
      key={`new-message-response`}
      message={prompt}
      name={props.candidate.name}
      image={props.candidate.image}
      id={`new-message-response`}
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
