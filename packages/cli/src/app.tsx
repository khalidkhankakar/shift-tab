import { useEffect } from "react";
import { useChat } from "@ai-sdk/react";

import Navbar from "./components/navbar";
import { ChatMessages } from "./components/chat-messages";
import { ChatInput } from "./components/chat-input";
import { DefaultChatTransport } from "ai";

import { fakeMessages } from "./utils/constant";

const SERVER_URL = "http://localhost:3000";

export function App() {
  const {error, messages, setMessages, sendMessage,status} = useChat({
    transport: new DefaultChatTransport({
      api: `${SERVER_URL}/api/chat`,
    }),
  });

  // Toggle this to `true` to populate fake messages for layout testing.
  const USE_FAKE_MESSAGES = true;

  useEffect(() => {
    if (!USE_FAKE_MESSAGES) return;
    setMessages(fakeMessages as any);
  }, [setMessages]);





  return (
    <box flexDirection="column" backgroundColor={'black'} height="100%" width="100%">
      <Navbar  />

      <box flexGrow={1} paddingLeft={1} paddingRight={1}>

      <ChatMessages messages={messages} status={status} />
      </box>

      {error && (
        <box paddingLeft={2} paddingRight={2} flexShrink={0}>
          <text>Error: {error.message}</text>
        </box>
      )}

      <box paddingLeft={1} paddingRight={1} paddingBottom={1}>
        <ChatInput
          sendMessage={sendMessage}
          status={status}
        />
      </box>
    </box>
  );
}