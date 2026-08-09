import { TextAttributes } from "@opentui/core";
import type { UseChatHelpers } from "@ai-sdk/react";
import type { ChatStatus, UIMessage } from "ai";
import { useCallback, useEffect, useState } from "react";
import { useCommandHandler } from "./commands/use-handler";
import { commandsArr, findCommand } from "./commands/commands";
import CommandSuggestionBar from "./commands/command-suggestion-bar";

interface ChatInputProps {
  sendMessage: UseChatHelpers<UIMessage>["sendMessage"];
  status: ChatStatus;
  /** Most recent assistant message text — forwarded to /copy */
  lastAssistantMessage: string;
  // ── command callbacks (lifted to App) ───────────────────────────────────────
  onNewChat: () => void;
  onClearChat: () => void;
  onDeleteAndExit: () => void;
  onOpenModelSelector: () => void;
}

const SPINNER_FRAMES = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];

export function ChatInput({
  sendMessage,
  status,
  lastAssistantMessage,
  onNewChat,
  onClearChat,
  onDeleteAndExit,
  onOpenModelSelector,
}: ChatInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [spinnerFrame, setSpinnerFrame] = useState(0);

  const isLoading = status === "streaming";

  // True when the user has typed a slash but hasn't completed a command name yet
  const isTypingCommand =
    inputValue.startsWith("/") && !commandsArr.includes(inputValue);

  // The full input string is the query — CommandSuggestionBar does its own prefix filter
  const commandQuery = inputValue;

  const { executeCommand } = useCommandHandler({
    onNewChat,
    onClearChat,
    onDeleteAndExit,
    onOpenModelSelector,
    lastAssistantMessage,
  });

  // When the user selects a suggestion, populate the input and execute immediately
  const handleCommandSelect = useCallback((commandName: string) => {
    setInputValue(commandName);
    // Small defer so the input value is visually committed before executing
    setTimeout(() => {
      executeCommand(commandName);
      setInputValue("");
    }, 0);
  }, [executeCommand]);

  const handleSubmit = useCallback(() => {
    const text = (inputValue ?? "").toString().trim();
    if (!text || isLoading) return;

    if (text.startsWith("/")) {
      // Only execute if it's a known complete command
      if (commandsArr.includes(text)) {
        executeCommand(text);
        setInputValue("");
      }
      // Unknown / incomplete slash command — do nothing (let user keep editing)
      return;
    }

    sendMessage({ text });
    setInputValue("");
  }, [inputValue, isLoading, sendMessage, executeCommand]);

  // Spinner animation
  useEffect(() => {
    if (!isLoading) return;
    const id = setInterval(() => {
      setSpinnerFrame((f) => (f + 1) % SPINNER_FRAMES.length);
    }, 80);
    return () => clearInterval(id);
  }, [isLoading]);

  const accentColor = isLoading ? "#e0af68" : "#7dd3fc";
  const icon = isLoading ? SPINNER_FRAMES[spinnerFrame] : "›";

  // Resolve current command name for the status bar hint
  const currentCommand = commandsArr.includes(inputValue)
    ? findCommand(inputValue)
    : null;

  return (
    <box flexDirection="column" flexShrink={0}>
      {isTypingCommand ? (
        <CommandSuggestionBar
          query={commandQuery}
          onSelectCommand={handleCommandSelect}
        />
      ) : null}

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
            setInputValue((value ?? "").toString());
          }}
          onSubmit={handleSubmit}
          placeholder={
            isLoading ? "Waiting for response..." : "Type a message and press Enter"
          }
          placeholderColor="gray"
          focused={!isLoading}
        />
      </box>

      <box
        flexDirection="row"
        justifyContent="space-between"
        paddingLeft={1}
        paddingRight={1}
      >
        <text attributes={TextAttributes.DIM}>↵ send</text>
        <text attributes={TextAttributes.DIM}>
          {currentCommand ? `↵ ${currentCommand.description}` : "/ commands"}
        </text>
        <text attributes={TextAttributes.DIM}>
          {isLoading ? "Streaming…" : `${inputValue.length} chars`}
        </text>
      </box>
    </box>
  );
}