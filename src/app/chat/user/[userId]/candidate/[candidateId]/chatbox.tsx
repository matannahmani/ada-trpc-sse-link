"use client";

import { streamApi } from "@/trpc/client";
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
  HoverCardArrow,
} from "@ui/hover-card";
import { Textarea } from "@ui/textarea";
import { useSetAtom } from "jotai";
import { Loader2, Send } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import {
  chatCompletionStatusAtom,
  chatCompletionPromptAtom,
  chatCompletionResAtom,
  useOnResponseComplete,
} from "./chat-utils";

const ChatBox = () => {
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const setChatCompletionStatus = useSetAtom(chatCompletionStatusAtom);
  const setChatCompletionPrompt = useSetAtom(chatCompletionPromptAtom);
  const setChatCompletionRes = useSetAtom(chatCompletionResAtom);
  const params = useParams();
  const appendMessageHandler = useOnResponseComplete();

  const onSubmitHandler = useCallback(
    (text: string) => {
      setText("");
      if (text.length < 3 || text.length > 512) {
        return;
      }
      setIsLoading(true);
      streamApi.candidates.chatComplete.subscribe(
        {
          candidateId: Number(params?.candidateId as string),
          message: text,
        },
        {
          onStarted: () => {
            setChatCompletionStatus("streaming");
            setChatCompletionPrompt(text);
            setChatCompletionRes("");
          },
          onData: (data) => {
            setChatCompletionRes((pre) => pre + data);
          },
          onComplete: () => {
            setChatCompletionStatus("complete");
            appendMessageHandler();
            setIsLoading(false);
          },
          onStopped() {
            setIsLoading(false);
          },
          onError: (err) => {
            console.error(err);
            setChatCompletionStatus("error");

            setIsLoading(false);
          },
        }
      );
    },
    [params?.id]
  );

  return (
    <div className="relative flex items-center shadow-xl">
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type your message here."
      />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmitHandler(text);
        }}
        className="absolute right-4"
      >
        <HoverCard openDelay={0}>
          <HoverCardTrigger>
            <button disabled={isLoading} onClick={() => onSubmitHandler(text)}>
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Send className="mr-2 h-4 w-4" />
              )}
            </button>
          </HoverCardTrigger>
          <HoverCardContent>
            <p>Send message</p>
            <HoverCardArrow />
          </HoverCardContent>
        </HoverCard>
      </form>
    </div>
  );
};
export default ChatBox;
