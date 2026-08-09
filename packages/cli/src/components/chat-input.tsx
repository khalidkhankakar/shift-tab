import { TextAttributes } from "@opentui/core";
import type { UseChatHelpers } from "@ai-sdk/react";
import type { ChatStatus, UIMessage } from "ai";
import { useEffect, useState } from "react";
import CommandSuggestionBar from "./commands/command-suggestion-bar";
import { commandsArr } from "./commands/commands";


interface ChatInputProps {
  sendMessage: UseChatHelpers<UIMessage>["sendMessage"];
  status: ChatStatus;
}

const SPINNER_FRAMES = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];

export function ChatInput({ sendMessage, status }: ChatInputProps) {

  const [inputValue, setInputValue] = useState("");
  const isLoading = status === 'streaming';
  const [spinnerFrame, setSpinnerFrame] = useState(0);
  const [isCompletedCommand, setIsCompletedCommand] = useState(false)

  const isCommandMode = inputValue.startsWith('/') && isCompletedCommand == false
  const commandQuery = inputValue.slice(0)

  useEffect(()=>{

    const completed = commandsArr.includes(inputValue)
    setIsCompletedCommand(completed)

  }, [inputValue])

  const handleCommandSelect = (commandValue: string) => {
    setInputValue(commandValue)
  }

  const handleSubmit = () => {
    const text = (inputValue ?? "").toString().trim();
    if (!text || isLoading) return;

    if (text.startsWith('/')) {
      return

    } else {
      sendMessage({ text });
    }
    setInputValue("");
  }




  useEffect(() => {
    if (!isLoading) return;
    const id = setInterval(() => {
      setSpinnerFrame((f) => (f + 1) % SPINNER_FRAMES.length);
    }, 80);
    return () => clearInterval(id);
  }, [isLoading]);

  // TODO: OPTIMIZATION LATER
  // const handleKey = useCallback(
  //   (key: string) => {
  //     if (key === "return" && inputValue.trim()) {
  //       sendMessage({ text: inputValue });
  //     }
  //   },
  //   [sendMessage, isLoading, inputValue]
  // );

  const accentColor = isLoading ? "#e0af68" : "#7dd3fc";
  const icon = isLoading ? SPINNER_FRAMES[spinnerFrame] : "›";

  return (
    <box flexDirection="column" flexShrink={0}>
      {isCommandMode ? <CommandSuggestionBar onSelectCommand={handleCommandSelect} query={commandQuery} /> : null}
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
        <text bg={accentColor} fg="#1a1b268b" marginRight={1}>
          {` ${icon} `}
        </text>
        <input
          flexGrow={1}
          value={inputValue}
          onInput={(value) => {
            const text = (value ?? "").toString().trim();
            setInputValue(text)
          }}
          onSubmit={handleSubmit}
          placeholder={isLoading ? "Waiting for response..." : "Type a message and press Enter"}
          placeholderColor="gray"
          focused={!isLoading}
        />
      </box>
      <box flexDirection="row" justifyContent="space-between" paddingLeft={1} paddingRight={1}>
        <text attributes={TextAttributes.DIM}>↵ send</text>
        <text attributes={TextAttributes.DIM}>/ commands</text>
        <text attributes={TextAttributes.DIM}>
          {isLoading ? "Streaming…" : `${inputValue.length} chars`}
        </text>
      </box>
    </box>
  );
}