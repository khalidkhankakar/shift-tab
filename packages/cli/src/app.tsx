import { useState } from "react";
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





  return (
    <box flexDirection="column" height="100%" width="100%">
      <Navbar  />

      <ChatMessages messages={messages} status={status} />

      {error && (
        <box paddingLeft={2} paddingRight={2} flexShrink={0}>
          <text>Error: {error.message}</text>
        </box>
      )}

      <ChatInput
        sendMessage={sendMessage}
        status={status}
      />
    </box>
  );
}