import { TextAttributes } from "@opentui/core";
import { useState } from "react";

type ChatMessage = {
  role: "user" | "assistant";
  Text: string;
};

const NAV_TITLE = "ShiftTab";
const MODEL_LABEL = "GPT-5.5";
const INPUT_PLACEHOLDER = "Ask anything...";

function Navbar() {
  return (
    <box flexDirection="row" alignItems="center" justifyContent="space-between" height={3} paddingX={1}>
      <text attributes={TextAttributes.BOLD}>◉ {NAV_TITLE}</text>

      <text>{MODEL_LABEL} ▼</text>

      <box flexDirection="row" alignItems="center" gap={2}>
        <text attributes={TextAttributes.DIM}>Tokens</text>
        <text attributes={TextAttributes.DIM}>⚙</text>
        <text attributes={TextAttributes.DIM}>☰</text>
      </box>
    </box>
  );
}

function EmptyState() {
  return (
    <box flexGrow={1} justifyContent="center" alignItems="center" flexDirection="column" gap={1} paddingX={2}>
      <text>👋</text>
      <text attributes={TextAttributes.BOLD}>Welcome to ShiftTab</text>
      <text attributes={TextAttributes.DIM}>How can I help you today?</text>
      <text attributes={TextAttributes.DIM}>Ask coding questions, debug projects, explain concepts, or write code.</text>
    </box>
  );
}

function ChatMessages({ messages }: { messages: ChatMessage[] }) {
  return (
    <box flexGrow={1} paddingX={1} paddingY={1} flexDirection="column" gap={1}>
      {messages.map((message, index) => (
        <box key={index} flexDirection="column" gap={0}>
          <text attributes={message.role === "user" ? TextAttributes.BOLD : TextAttributes.DIM}>
            {message.role === "user" ? "User" : "Assistant"}
          </text>
          <text>{message.Text}</text>
        </box>
      ))}
    </box>
  );
}

function ChatInput({
  value,
  onValueChange,
  onSubmit,
}: {
  value: string;
  onValueChange: (value: string) => void;
  onSubmit: (value: string) => void;
}) {
  return (
    <box height={3} flexDirection="column" paddingX={1} paddingY={0}>
      <box flexDirection="row" alignItems="center" gap={1}>
        <text>▸</text>
        <input
          placeholder={INPUT_PLACEHOLDER}
          focused
          value={value}
          onInput={onValueChange}
          onSubmit={() => onSubmit(value)}
          flexGrow={1}
        />
        <text attributes={TextAttributes.DIM}>⌘↵</text>
      </box>

      <box justifyContent="space-between" paddingTop={0}>
        <text attributes={TextAttributes.DIM}>@file /command Ctrl+K Shift+Tab Esc</text>
      </box>
    </box>
  );
}

export function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");

  const sendMessage = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) {
      return;
    }

    setMessages((current) => [
      ...current,
      { role: "user", Text: trimmed },
      { role: "assistant", Text: "ShiftTab will answer here once AI integration is added." },
    ]);
    setDraft("");
  };

  return (
    <box flexDirection="column" height="100%">
      <Navbar />

      <box flexGrow={1}>
        {messages.length === 0 ? <EmptyState /> : <ChatMessages messages={messages} />}
      </box>

      <ChatInput value={draft} onValueChange={setDraft} onSubmit={sendMessage} />
    </box>
  );
}

