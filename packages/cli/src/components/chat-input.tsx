import type { UseChatHelpers } from "@ai-sdk/react";
import type { ChatStatus, UIMessage } from "ai";
import { useCallback, useState } from "react";

interface ChatInputProps {
  sendMessage: UseChatHelpers<UIMessage>["sendMessage"];
  status: ChatStatus;
}

export function ChatInput({ sendMessage, status }: ChatInputProps) {

    const [inputValue, setInputValue] = useState("");

  const isLoading = status === 'streaming';
  const handleKey = useCallback(
    (key: string) => {
      if (key === "return" && inputValue.trim()) {
        sendMessage({ text: inputValue });
      }
    },
    [sendMessage, isLoading, inputValue]
  );

  return (
    <box
      flexDirection="row"
      alignItems="center"
      height={3}
      flexShrink={0}
      borderStyle="rounded"
      borderColor={isLoading ? "yellow" : "cyan"}
      paddingLeft={1}
      paddingRight={1}
    >
      <text bg={isLoading ? "yellow" : "cyan"} marginRight={1}>
        {isLoading ? "⏳" : "›"}
      </text>
      <input
        flexGrow={1}
        value={inputValue}
        onChange={setInputValue}
        onSubmit={(value) => {
          const text = (value ?? "").toString().trim();
          if (!text || isLoading) return;
          sendMessage({ text });
          setInputValue("");
        }}
        placeholder={isLoading ? "Waiting for response..." : "Type a message and press Enter"}
        placeholderColor="gray"
        focused={!isLoading}
      />
    </box>
  );
}