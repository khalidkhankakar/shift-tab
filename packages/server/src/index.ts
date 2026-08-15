import { Hono } from "hono";
import { cors } from "hono/cors";
import { convertToModelMessages, InferUITools, stepCountIs, streamText, tool, UIMessage } from "ai";
import { google } from "@ai-sdk/google";
import * as fsTools from './file-system';
import { z } from 'zod';

const app = new Hono()

app.use("*", cors());

app.get('/', (c) => {
  return c.text('Hello Hono!')
})
export type MyUIMessage = UIMessage<
  never,
  never,
  InferUITools<typeof tools>
>;



const tools = {
  writeFile: tool({
    description: 'Write to a file',
    inputSchema: z.object({
      path: z
        .string()
        .describe('The path to the file to create'),
      content: z
        .string()
        .describe('The content of the file to create'),
    }),
    execute: async ({ path, content }) => {
      return fsTools.writeFile(path, content);
    },
  }),
  readFile: tool({
    description: 'Read a file',
    inputSchema: z.object({
      path: z.string().describe('The path to the file to read'),
    }),
    execute: async ({ path }) => {
      return fsTools.readFile(path);
    },
  }),
  deletePath: tool({
    description: 'Delete a file or directory',
    inputSchema: z.object({
      path: z
        .string()
        .describe('The path to the file or directory to delete'),
    }),
    execute: async ({ path }) => {
      return fsTools.deletePath(path);
    },
  }),
  listDirectory: tool({
    description: 'List a directory',
    inputSchema: z.object({
      path: z
        .string()
        .describe('The path to the directory to list'),
    }),
    execute: async ({ path }) => {
      return fsTools.listDirectory(path);
    },
  }),
  createDirectory: tool({
    description: 'Create a directory',
    inputSchema: z.object({
      path: z
        .string()
        .describe('The path to the directory to create'),
    }),
    execute: async ({ path }) => {
      return fsTools.createDirectory(path);
    },
  }),
  exists: tool({
    description: 'Check if a file or directory exists',
    inputSchema: z.object({
      path: z
        .string()
        .describe('The path to the file or directory to check'),
    }),
    execute: async ({ path }) => {
      return fsTools.exists(path);
    },
  }),
  searchFiles: tool({
    description: 'Search for files',
    inputSchema: z.object({
      pattern: z.string().describe('The pattern to search for'),
    }),
    execute: async ({ pattern }) => {
      return fsTools.searchFiles(pattern);
    },
  }),
};

app.post("/api/chat", async (c) => {

  console.log(process.env.GOOGLE_GENERATIVE_AI_API_KEY)

  const { messages }: { messages: UIMessage[] } = await c.req.json();


  const result = streamText({
    model: google("gemini-3.5-flash"),
    system:
      "You are ShiftTab, a helpful AI assistant living inside a terminal. Be concise and clear.",
    messages: await convertToModelMessages(messages),
    tools,
    stopWhen: [stepCountIs(10)],
  });

  // toDataStreamResponse() produces a standard Response — return it directly from Hono

  return result.toUIMessageStreamResponse();
});

const PORT = Number(process.env.PORT ?? 3000);

export default {
  port: PORT,
  fetch: app.fetch,
};


