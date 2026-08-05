
import { TextAttributes } from "@opentui/core";
import type { ChatStatus, UIMessage } from "ai";

const ROLE_COLOR: Record<string, string> = {
  user: "cyan",
  assistant: "green",
  system: "gray",
};

const ROLE_LABEL: Record<string, string> = {
  user: "You",
  assistant: "ShiftTab",
  system: "System",
};

interface ChatBubbleProps {
  message: UIMessage;
}

function ChatBubble({ message }: ChatBubbleProps) {
  const color = ROLE_COLOR[message.role] ?? "white";
  const label = ROLE_LABEL[message.role] ?? message.role;
  const isUser = message.role === "user";

  return (
    <box
      flexDirection="column"
      alignItems={isUser ? "flex-end" : "flex-start"}
      marginBottom={1}
      paddingLeft={2}
      paddingRight={2}
    >
      <text bg={color} attributes={TextAttributes.BOLD}>
        {label}
      </text>
      <box
        borderStyle="rounded"
        borderColor={color}
        paddingLeft={1}
        paddingRight={1}
        maxWidth="80%"
      >
        {message.parts.map((part, i) => {
            switch (part.type) {
              case 'text':
                return <text wrapMode="word" bg="white" key={`${message.id}-${i}`}>{part.text}</text>;
            }
          })}
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
      <box flexGrow={1} alignItems="center" justifyContent="center">
        <text bg="gray">No messages yet. Start a conversation below.</text>
      </box>
    );
  }

  return (
    <scrollbox flexGrow={1} stickyScroll stickyStart="bottom" flexDirection="column">
      {messages.map((msg) => (
        <ChatBubble key={msg.id} message={msg} />
      ))}
      {status =='streaming' && (
        <box paddingLeft={2}>
          <text bg="green" attributes={TextAttributes.BOLD}>
            ShiftTab
          </text>
          <box borderStyle="rounded" borderColor="green" paddingLeft={1} paddingRight={1}>
            <text bg="gray">▌</text>
          </box>
        </box>
      )}
    </scrollbox>
  );
}