/**
 * chat-messages.tsx
 *
 * Renders conversation messages. Tool call parts (any state) are dispatched to
 * <ToolCallCard> which is typed against MyUIMessage's TOOLS parameter, giving
 * full inference of input / output shapes per tool name.
 */

import { TextAttributes } from "@opentui/core";
import {
  isStaticToolUIPart,
  isDynamicToolUIPart,
  isTextUIPart,
  type ChatStatus,
  type UIMessage,
} from "ai";
import { useEffect, useState } from "react";
import EmptyState from "./empty-state";
import Markdown from "./markdown";
// Server exports MyUIMessage so we get the exact TOOLS generic
// Use a local, looser UIMessage alias instead of importing server types
import type { UIMessage as BaseUIMessage, ToolUIPart, DynamicToolUIPart } from "ai";
type MyUIMessage = BaseUIMessage<any, any, any>;
import { ToolCallCard } from "./tools/tool-call-card";

// ─── constants ───────────────────────────────────────────────────────────────
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

const SPINNER_FRAMES = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"] as const;

// ─── spinner hook ─────────────────────────────────────────────────────────────
function useSpinner(): string {
  const [frame, setFrame] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setFrame((f) => (f + 1) % SPINNER_FRAMES.length), 80);
    return () => clearInterval(id);
  }, []);
  return SPINNER_FRAMES[frame] ?? "";
}

// ─── ChatBubble ───────────────────────────────────────────────────────────────
interface ChatBubbleProps {
  message: MyUIMessage;
}

function ChatBubble({ message }: ChatBubbleProps) {
  const color = ROLE_COLOR[message.role] ?? "white";
  const label = ROLE_LABEL[message.role] ?? message.role;
  const icon = ROLE_ICON[message.role] ?? "•";
  const isUser = message.role === "user";

  // Collect text parts into a single string for the markdown renderer
  const textContent = message.parts
    .filter(isTextUIPart)
    .map((p) => p.text)
    .join("\n\n");

  // Collect tool parts — typed to MyUIMessage's TOOLS via isStaticToolUIPart
  // Looser runtime check to avoid complex type predicate mismatches with the
  // UI types exposed by the `ai` package across packages.
  const toolParts = message.parts.filter((p) =>
    typeof (p as any)?.type === "string" && (p as any).type.startsWith?.("tool-")
  ) as Array<ToolUIPart<any> | DynamicToolUIPart>;

  return (
    <box
      flexDirection="column"
      alignItems={isUser ? "flex-end" : "flex-start"}
      marginBottom={1}
      paddingLeft={2}
      paddingRight={2}
    >
      {/* ── role header ── */}
      <box flexDirection="row" gap={1}>
        {!isUser && <text fg={color}>{icon}</text>}
        <text attributes={TextAttributes.BOLD} fg={color}>
          {label}
        </text>
        {isUser && <text fg={color}>{icon}</text>}
      </box>

      {/* ── text bubble ── */}
      {textContent ? (
        <box
          borderStyle="rounded"
          borderColor={color}
          paddingLeft={1}
          paddingRight={1}
          maxWidth="80%"
        >
          <Markdown content={textContent} />
        </box>
      ) : null}

      {/* ── tool call cards ── */}
      {toolParts.length > 0 && (
        <box flexDirection="column" width="100%" marginTop={textContent ? 1 : 0}>
          {toolParts.map((part) => (
            <ToolCallCard
              key={(part as { toolCallId: string }).toolCallId}
              part={part as any}
            />
          ))}
        </box>
      )}
    </box>
  );
}

// ─── ThinkingIndicator ────────────────────────────────────────────────────────
function ThinkingIndicator() {
  const spinner = useSpinner();

  return (
    <box flexDirection="column" marginBottom={1} paddingLeft={2}>
      <box flexDirection="row" gap={1}>
        <text fg={ROLE_COLOR.assistant}>{ROLE_ICON.assistant}</text>
        <text attributes={TextAttributes.BOLD} fg={ROLE_COLOR.assistant}>
          {ROLE_LABEL.assistant}
        </text>
      </box>
      <box
        borderStyle="rounded"
        borderColor={ROLE_COLOR.assistant}
        paddingLeft={1}
        paddingRight={1}
      >
        <text fg={ROLE_COLOR.assistant}>{spinner} Thinking</text>
      </box>
    </box>
  );
}

// ─── ChatMessages ─────────────────────────────────────────────────────────────
interface ChatMessagesProps {
  messages: UIMessage[];
  status: ChatStatus;
}

export function ChatMessages({ messages, status }: ChatMessagesProps) {
  if (messages.length === 0) {
    return <EmptyState />;
  }

  return (
    <scrollbox
      height="100%"
      paddingLeft={1}
      paddingRight={1}
      stickyScroll
      stickyStart="bottom"
    >
      {(messages as MyUIMessage[]).map((msg) => (
        <ChatBubble key={msg.id} message={msg} />
      ))}
      {status === "streaming" && <ThinkingIndicator />}
    </scrollbox>
  );
}