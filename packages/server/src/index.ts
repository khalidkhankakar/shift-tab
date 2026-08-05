import { Hono } from "hono";
import { cors } from "hono/cors";
import { convertToModelMessages, streamText, UIMessage } from "ai";
import { google } from "@ai-sdk/google";

const app = new Hono()

app.use("*", cors());

app.get('/', (c) => {
  return c.text('Hello Hono!')
})


app.post("/api/chat", async (c) => {

  const { messages }: { messages: UIMessage[] } = await c.req.json();


  const result = streamText({
    model: google("gemini-3.5-flash"),
    system:
      "You are ShiftTab, a helpful AI assistant living inside a terminal. Be concise and clear.",
    messages: await convertToModelMessages(messages),
  });

  // toDataStreamResponse() produces a standard Response — return it directly from Hono
  return result.toTextStreamResponse();
});

const PORT = Number(process.env.PORT ?? 3000);

export default {
  port: PORT,
  fetch: app.fetch,
};


