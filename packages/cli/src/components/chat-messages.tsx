import { TextAttributes } from "@opentui/core";
import type { ChatStatus, UIMessage } from "ai";
import { useEffect, useState } from "react";
import EmptyState from "./empty-state";
import Markdown from "./markdown";



const ROLE_COLOR: Record<string, string> = {
  user: "#7dd3fc",
  assistant: "#9ece6a",
};

const ROLE_LABEL: Record<string, string> = {
  user: "You",
  assistant: "ShiftTab",
  system: "System",
};

const ROLE_ICON: Record<string, string> = {
  user: "●",
  assistant: "✳",
  system: "•",
};

const SPINNER_FRAMES = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];

interface ChatBubbleProps {
  message: UIMessage;
}

function ChatBubble({ message }: ChatBubbleProps) {
  const color = ROLE_COLOR[message.role] ?? "white";
  const label = ROLE_LABEL[message.role] ?? message.role;
  const icon = ROLE_ICON[message.role] ?? "•";
  const isUser = message.role === "user";
  const textContent = message.parts
    .filter((part) => part.type === "text")
    .map((part) => part.text)
    .join("\n\n");

  return (
    <box
      flexDirection="column"
      alignItems={isUser ? "flex-end" : "flex-start"}
      marginBottom={1}
      paddingLeft={2}
      paddingRight={2}
    >
      <box flexDirection="row" gap={1}>
        {!isUser && <text fg={color}>{icon}</text>}
        <text attributes={TextAttributes.BOLD} fg={color}>
          {label}
        </text>
        {isUser && <text fg={color}>{icon}</text>}
      </box>
      <box
        borderStyle="rounded"
        borderColor={color}
        paddingLeft={1}
        paddingRight={1}
        maxWidth="80%"
      >
        {textContent ? <Markdown content={textContent} /> : null}
      </box>
    </box>
  );
}

function ThinkingIndicator() {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setFrame((f) => (f + 1) % SPINNER_FRAMES.length);
    }, 80);
    return () => clearInterval(id);
  }, []);

  return (
    <box flexDirection="column" marginBottom={1} paddingLeft={2}>
      <box flexDirection="row" gap={1}>
        <text fg={ROLE_COLOR.assistant}>{ROLE_ICON.assistant}</text>
        <text attributes={TextAttributes.BOLD} fg={ROLE_COLOR.assistant}>
          {ROLE_LABEL.assistant}
        </text>
      </box>
      <box borderStyle="rounded" borderColor={ROLE_COLOR.assistant} paddingLeft={1} paddingRight={1}>
        <text fg={ROLE_COLOR.assistant}>
          {SPINNER_FRAMES[frame]} Thinking
        </text>
      </box>
    </box>
  );
}

interface ChatMessagesProps {
  messages: UIMessage[];
  status: ChatStatus;
}

export function ChatMessages({ messages, status }: ChatMessagesProps) {
  if (messages.length === 0) {
    return (
      <EmptyState />
    );
  }

  return (
    <scrollbox
      height={'100%'}
      paddingLeft={1}
      paddingRight={1}
      stickyScroll
      stickyStart="bottom"
    >
      {messages.map((msg) => (
        <ChatBubble key={msg.id} message={msg} />
      ))}
      {status === 'streaming' || status === 'ready' && <ThinkingIndicator />}
    </scrollbox>
  );
}