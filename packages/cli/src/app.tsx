import { TextAttributes } from "@opentui/core";
import { useState, useCallback } from "react";
import Navbar from "./components/navbar";
import ChatInput from "./components/chat-input";
import EmptyState from "./components/empty-state";

// ─── Types ────────────────────────────────────────────────────────────────────

export type Role = "user" | "assistant";

export type ChatMessage = {
  id: string;
  role: Role;
  text: string;
  timestamp: number;
};

// ─── Constants ────────────────────────────────────────────────────────────────

const ROLE_LABEL: Record<Role, string> = {
  user:      "You",
  assistant: "ShiftTab",
};

const ROLE_COLOR: Record<Role, string> = {
  user:      "#7aa2f7",
  assistant: "#9ece6a",
};

// ─── ChatBubble ───────────────────────────────────────────────────────────────

function ChatBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";

  return (
    <box flexDirection="column" gap={0}>
      <text fg={ROLE_COLOR[message.role]} attributes={TextAttributes.BOLD}>
        {ROLE_LABEL[message.role]}
      </text>
      <text
        wrapMode="word"
        attributes={isUser ? TextAttributes.NONE : TextAttributes.DIM}
      >
        {message.text}
      </text>
    </box>
  );
}

// ─── Divider ──────────────────────────────────────────────────────────────────

function Divider() {
  return (
    <box height={1} borderStyle="single" border={["bottom"]} opacity={0.3} />
  );
}

// ─── ChatMessages ─────────────────────────────────────────────────────────────

function ChatMessages({ messages }: { messages: ChatMessage[] }) {
  return (
    <scrollbox
      flexGrow={1}
      scrollY
      stickyScroll
      stickyStart="bottom"
      paddingX={2}
      paddingY={1}
      verticalScrollbarOptions={{ showArrows: true }}
    >
      {messages.map((message, index) => (
        <box key={message.id} flexDirection="column" gap={0}>
          <ChatBubble message={message} />
          {index < messages.length - 1 && <Divider />}
        </box>
      ))}
    </scrollbox>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────

export function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");

  const sendMessage = useCallback((value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return;

    const now = Date.now();

    setMessages((prev) => [
      ...prev,
      {
        id:        `${now}-user`,
        role:      "user",
        text:      trimmed,
        timestamp: now,
      },
      {
        id:        `${now}-assistant`,
        role:      "assistant",
        text:      "ShiftTab will answer here once AI integration is added.",
        timestamp: now + 1,
      },
    ]);

    setDraft("");
  }, []);

  return (
    <box flexDirection="column" height="100%" width="100%">
      <Navbar />

      <box flexGrow={1}>
        {messages.length === 0
          ? <EmptyState />
          : <ChatMessages messages={messages} />}
      </box>

      <ChatInput
        value={draft}
        onValueChange={setDraft}
        onSubmit={sendMessage}
      />
    </box>
  );
}