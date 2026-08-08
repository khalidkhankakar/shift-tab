export const fakeMessages = [
    { id: "m1", role: "system", parts: [{ type: "text", text: "Conversation started" }] },
    { id: "m2", role: "user", parts: [{ type: "text", text: `# Markdown Heading  ` }] },
    { id: "m3", role: "assistant", parts: [{ type: "text", text: "# BoxRenderable\n\nA container component with borders, background colors, and layout capabilities. Use it to create panels, frames, and organized sections.\n\n## Basic usage\n\n### Renderable API\n\n```typescript\nimport { BoxRenderable, createCliRenderer } from \"@opentui/core\"\n\nconst renderer = await createCliRenderer()\n\nconst panel = new BoxRenderable(renderer, {\n  id: \"panel\",\n  width: 30,\n  height: 10,\n  backgroundColor: \"#333366\",\n  borderStyle: \"double\",\n  borderColor: \"#FFFFFF\",\n})\n\nrenderer.root.add(panel)\n```\n\n### JSX API\n\n```tsx\n<box \n  width={30} \n  height={10} \n  backgroundColor=\"#333366\" \n  borderStyle=\"double\" \n  borderColor=\"#FFFFFF\"\n/>\n```\n" }] },
    { id: "m4", role: "user", parts: [{ type: "text", text: "It's long and has nested loops; I want it faster and clearer." }] },
    { id: "m5", role: "assistant", parts: [{ type: "text", text: "Consider splitting responsibilities into helpers, and avoid repeated work inside loops. Also please provide input sizes so we can focus on complexity." }] },
    { id: "m6", role: "user", parts: [{ type: "text", text: "Example input: array of 10k items, each item is an object with 3 fields." }] },
    { id: "m7", role: "assistant", parts: [{ type: "text", text: "Great — for that size, aim for O(n) passes only and prefer maps over nested scans where possible." }] },
    { id: "m8", role: "user", parts: [{ type: "text", text: "Thanks! Can you show a refactor example with comments?" }] },
    { id: "m9", role: "assistant", parts: [{ type: "text", text: "Here's a short example:\n1) Extract helper\n2) Use a single pass\n3) Avoid extra allocations." }] },
];