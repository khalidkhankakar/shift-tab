import { useState, useCallback, useMemo, useEffect } from "react";
import { useChat } from "@ai-sdk/react";
import { useAppContext } from "@opentui/react";
import ModelSelector, { AVAILABLE_MODELS } from "./components/model-selector";
import { ChatInput } from "./components/chat-input";

import { DefaultChatTransport } from "ai";

import { fakeMessages } from "./utils/constant";
import { ChatMessages } from "./components/chat-messages";
import Navbar from "./components/navbar";

const SERVER_URL = "http://localhost:3000";
const DEFAULT_MODEL = AVAILABLE_MODELS[0].id; // "claude-sonnet-4-6"
 

export function App() {

  const { renderer } = useAppContext();

  // ── model selection ──────────────────────────────────────────────────────────
  const [model, setModel] = useState(DEFAULT_MODEL);
  const [modelSelectorOpen, setModelSelectorOpen] = useState(false);

  // ── chat lifecycle ───────────────────────────────────────────────────────────
  // Incrementing chatKey remounts useChat, giving a fresh conversation
  const [chatKey, setChatKey] = useState(0);

    const {error, messages, setMessages, sendMessage,status} = useChat({
    transport: new DefaultChatTransport({
      api: `${SERVER_URL}/api/chat`,
    }),         // reactive — changes on model switch
  });

  // ── last assistant message for /copy ────────────────────────────────────────
  const lastAssistantMessage = useMemo(() => {
    const msgs = [...messages].reverse();
    return msgs.find((m) => m.role === "assistant")?.parts[0]?.type=== "text" ? msgs.find((m) => m.role === "assistant")?.parts[0] ?? "" : "";
  }, [messages]);


    const USE_FAKE_MESSAGES = false;

  useEffect(() => {
    if (!USE_FAKE_MESSAGES) return;
    setMessages(fakeMessages as any);
  }, [setMessages]);

  // ── command callbacks ────────────────────────────────────────────────────────
  const handleNewChat = useCallback(() => {
    setMessages([]);
    setChatKey((k) => k + 1);
  }, [setMessages]);

  const handleClearChat = useCallback(() => {
    // Same as new — keep model, wipe messages
    setMessages([]);
    setChatKey((k) => k + 1);
  }, [setMessages]);

  const handleDeleteAndExit = useCallback(() => {
    // In a real implementation, persist a "deleted" flag to disk here,
    // then destroy the renderer and quit.
    setMessages([]);
    renderer?.destroy();
    process.exit(0);
  }, [renderer, setMessages]);

  const handleOpenModelSelector = useCallback(() => {
    setModelSelectorOpen(true);
  }, []);

  const handleModelSelect = useCallback((modelId: string) => {
    setModel(modelId);
  }, []);

  const handleModelSelectorClose = useCallback(() => {
    setModelSelectorOpen(false);
  }, []);

  // ── render ───────────────────────────────────────────────────────────────────
  return (
    <box flexDirection="column" width="100%" height="100%">
      <Navbar />
      {/* ── Model selector overlay (renders above everything) ── */}
      {modelSelectorOpen && (
        <ModelSelector
          currentModel={model}
          onSelect={handleModelSelect}
          onClose={handleModelSelectorClose}
        />
      )}

      {/* ── Chat messages ── */}
 <box flexGrow={1} paddingLeft={1} paddingRight={1}>

      <ChatMessages messages={messages} status={status} />
      </box>
      {/* ── Input bar ── */}
      <ChatInput
        sendMessage={sendMessage}
        status={status}
        lastAssistantMessage={lastAssistantMessage}
        onNewChat={handleNewChat}
        onClearChat={handleClearChat}
        onDeleteAndExit={handleDeleteAndExit}
        onOpenModelSelector={handleOpenModelSelector}
      />
    </box>
  );
}

