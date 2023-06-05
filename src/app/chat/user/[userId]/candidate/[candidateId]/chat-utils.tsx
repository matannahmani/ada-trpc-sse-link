"use client";
import { atom, useSetAtom } from "jotai";
import { useCallback } from "react";
import { useAtomCallback } from "jotai/utils";

/**
 * @description this is a atom will show the new message while it's beeing streamed
 */

export const newMessageAtom = atom<{
  text: string;
  question: string;
  reason?: string;
  status: "error" | "streaming" | "complete" | "abort";
}>({
  text: "",
  question: "",
  status: "complete",
});

export const messageKeyTemplate = (id: string, type: "client" | "response") =>
  `new-message-${id}-${type}`;

export const chatMessagesAtom = atom<
  {
    question: string;
    answer: string;
  }[]
>([]);

export const chatCandidateIdAtom = atom<string>("");

export const chatCompletionStatusAtom = atom<
  "error" | "streaming" | "complete" | "abort"
>("complete");
export const chatCompletionPromptAtom = atom<string>("");
export const chatCompletionResAtom = atom<string>("");
export const useOnResponseComplete = () => {
  const setClientMessages = useSetAtom(chatMessagesAtom);
  const readChatResponse = useAtomCallback(
    useCallback((get) => {
      const currCount = get(chatCompletionResAtom);
      return currCount;
    }, [])
  );
  const readChatPrompt = useAtomCallback(
    useCallback((get) => {
      const currCount = get(chatCompletionPromptAtom);
      return currCount;
    }, [])
  );
  const appendMessageHandler = useCallback(() => {
    const prompt = readChatPrompt();
    const response = readChatResponse();
    setClientMessages((prev) => {
      return [
        ...prev,
        {
          question: prompt,
          answer: response,
        },
      ];
    });
  }, [readChatResponse, readChatPrompt, setClientMessages]);
  return appendMessageHandler;
};
