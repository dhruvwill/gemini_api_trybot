import { create } from "zustand";
import { persist } from "zustand/middleware";
import { nanoid } from "nanoid"; // for generating unique IDs

export type ChatState = {
  id: string; // Unique identifier for each message
  chat: string;
  chatType: "send" | "receive";
};

type LLM = {
  loading: boolean;
  messages: ChatState[];
};

export type ChatStore = {
  current: string;
  gemini: LLM;
  addMessage: (chat: ChatState, llm: string) => void;
  updateMessage: (id: string, chat: Partial<ChatState>, llm: string) => void;
};

export const useChatStore = create(
  persist(
    (set, get) => ({
      current: "gemini",
      gemini: {
        loading: false,
        messages: [],
      },
      addMessage: (chat, llm) => {
        set((state) => ({
          ...state,
          [llm]: {
            ...state[llm],
            messages: [...state[llm].messages, { ...chat }],
          },
        }));
      },
      updateMessage: (id, chat, llm) => {
        set((state) => ({
          ...state,
          [llm]: {
            ...state[llm],
            messages: state[llm].messages.map((message) =>
              message.id === id ? { ...message, ...chat } : message
            ),
          },
        }));
      },
    }),
    {
      name: "chat-storage",
    }
  )
);
