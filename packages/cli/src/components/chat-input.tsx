import { TextAttributes } from "@opentui/core";
import type { UseChatHelpers } from "@ai-sdk/react";
import type { ChatStatus, UIMessage } from "ai";
import { useCallback, useEffect, useState } from "react";

interface ChatInputProps {
  sendMessage: UseChatHelpers<UIMessage>["sendMessage"];
  status: ChatStatus;
}

const SPINNER_FRAMES = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];

export function ChatInput({ sendMessage, status }: ChatInputProps) {

    const [inputValue, setInputValue] = useState("");

  const isLoading = status === 'streaming';

  const [spinnerFrame, setSpinnerFrame] = useState(0);
  useEffect(() => {
    if (!isLoading) return;
    const id = setInterval(() => {
      setSpinnerFrame((f) => (f + 1) % SPINNER_FRAMES.length);
    }, 80);
    return () => clearInterval(id);
  }, [isLoading]);

  const handleKey = useCallback(
    (key: string) => {
      if (key === "return" && inputValue.trim()) {
        sendMessage({ text: inputValue });
      }
    },
    [sendMessage, isLoading, inputValue]
  );

  const accentColor = isLoading ? "#e0af68" : "#7dd3fc";
  const icon = isLoading ? SPINNER_FRAMES[spinnerFrame] : "›";

  return (
    <box flexDirection="column" flexShrink={0}>
      <box
        flexDirection="row"
        alignItems="center"
        height={3}
        flexShrink={0}
        borderStyle="rounded"
        borderColor={accentColor}
        title={isLoading ? "Waiting" : "Message"}
        titleColor={accentColor}
        paddingLeft={1}
        paddingRight={1}
      >
        <text bg={accentColor} fg="#1a1b26" marginRight={1}>
          {` ${icon} `}
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
      <box flexDirection="row" justifyContent="space-between" paddingLeft={1} paddingRight={1}>
        <text attributes={TextAttributes.DIM}>↵ send</text>
        <text attributes={TextAttributes.DIM}>
          {isLoading ? "Streaming…" : `${inputValue.length} chars`}
        </text>
      </box>
    </box>
  );
}