import { useEffect } from "react";
import { useChat } from "@ai-sdk/react";

import Navbar from "./components/navbar";
import { ChatMessages } from "./components/chat-messages";
import { ChatInput } from "./components/chat-input";
import { DefaultChatTransport } from "ai";

const SERVER_URL = "http://localhost:3000";

export function App() {
  // api: `${SERVER_URL}/api/chat`,


  const {error, messages,setMessages, sendMessage,status} = useChat({
    transport: new DefaultChatTransport({
      api: `${SERVER_URL}/api/chat`,
    }),
  });

  // Toggle this to `true` to populate fake messages for layout testing.
  const USE_FAKE_MESSAGES = false;

  useEffect(() => {
    if (!USE_FAKE_MESSAGES) return;

    const fakeMessages = [
      { id: "m1", role: "system", parts: [{ type: "text", text: "Conversation started" }] },
      { id: "m2", role: "user", parts: [{ type: "text", text: "Hi — can you help me refactor a function?" }] },
      { id: "m3", role: "assistant", parts: [{ type: "text", text: "Sure — share the function and tell me what the goal is." }] },
      { id: "m4", role: "user", parts: [{ type: "text", text: "It's long and has nested loops; I want it faster and clearer." }] },
      { id: "m5", role: "assistant", parts: [{ type: "text", text: "Consider splitting responsibilities into helpers, and avoid repeated work inside loops. Also please provide input sizes so we can focus on complexity." }] },
      { id: "m6", role: "user", parts: [{ type: "text", text: "Example input: array of 10k items, each item is an object with 3 fields." }] },
      { id: "m7", role: "assistant", parts: [{ type: "text", text: "Great — for that size, aim for O(n) passes only and prefer maps over nested scans where possible." }] },
      { id: "m8", role: "user", parts: [{ type: "text", text: "Thanks! Can you show a refactor example with comments?" }] },
      { id: "m9", role: "assistant", parts: [{ type: "text", text: "Here's a short example:\n1) Extract helper\n2) Use a single pass\n3) Avoid extra allocations." }] },
    ];

    setMessages(fakeMessages as any);
  }, [setMessages]);





  return (
    <box flexDirection="column" height="100%" width="100%">
      <Navbar  />

      <box flexGrow={1} >

      <ChatMessages messages={messages} status={status} />
      </box>

      {/* {error && (
        <box paddingLeft={2} paddingRight={2} flexShrink={0}>
          <text>Error: {error.message}</text>
        </box>
      )} */}

      <ChatInput
        sendMessage={sendMessage}
        status={status}
      />
    </box>
  );
}