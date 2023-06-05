"use client";
import { useAtom, useSetAtom } from "jotai";
import { useParams, usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import {
  chatMessagesAtom,
  chatCompletionStatusAtom,
  chatCompletionPromptAtom,
  chatCompletionResAtom,
  chatCandidateIdAtom,
} from "./chat-utils";

/**
 * @description this hook will sync the chat history with the server
 * after the user change the candidate id the chat history will be cleared and loaded from the server
 * @important this hook should be important at the layout level
 */
export const ChatHistorySyncer = () => {
  const params = useParams(); // Get current route
  const [chatCandidateId, setChatCandidateId] = useAtom(chatCandidateIdAtom);

  const setChatMessages = useSetAtom(chatMessagesAtom);
  const setChatCompletionStatus = useSetAtom(chatCompletionStatusAtom);
  const setChatCompletionPrompt = useSetAtom(chatCompletionPromptAtom);
  const setChatCompletionRes = useSetAtom(chatCompletionResAtom);

  /**
   * @description compare the current candidate id with the route candidate id
   * if they are not the same we will clear the client messages as we load the new messages from the server
   */
  useEffect(() => {
    if (chatCandidateId !== params?.candidateId?.toString()) {
      setChatCandidateId(params?.candidateId?.toString() || "");
      setChatMessages([]);
      setChatCompletionStatus("complete");
      setChatCompletionPrompt("");
      setChatCompletionRes("");
    }
  }, [chatCandidateId]);
  /**
   * @description first time the component is mounted we will set the candidate id from the route
   */
  useEffect(() => {
    if (chatCandidateId === "") {
      setChatCandidateId(params?.candidateId?.toString() || "");
    }
  }, []);
  return <></>;
};
