# AI Agent Instructions for shift-tab

## Project overview
- This repository is a terminal-first React/TypeScript app built with OpenTUI.
- It currently renders a simple CLI layout via `src/main.tsx` and `src/app.tsx`.
- The intended direction is a terminal AI chat application, not a browser-based chat UI.

## Key technologies
- `@opentui/core`, `@opentui/react` for terminal UI rendering
- `react` / `react-dom` for component structure
- `bun` for local development (via `bun run --watch src/main.tsx`)
- `vite` for build tooling
- `ai` package is already installed and likely intended for AI/chat integration
- `zod` and `@hono/zod-validator` are available for validation and future input handling

## Important files
- `src/main.tsx` — creates the CLI renderer and renders the root `<App />`
- `src/app.tsx` — main terminal UI component and the entry point for chat UI
- `package.json` — project scripts and dependencies
- `README.md` — template boilerplate documentation

## Agent guidance
- Focus on terminal UI patterns using OpenTUI components and layout props.
- Avoid introducing browser DOM APIs or browser-only libraries.
- Prefer building chat flow, message history, and user input handling inside the existing terminal component tree.
- Use the installed `ai` package for AI interaction logic and keep it aligned with a CLI experience.
- Keep the app minimal and terminal-native, with clear separation between UI and AI/chat state.

## Development commands
- `bun run --watch src/main.tsx` — run the app in development mode
- `bun run build` / `vite build` — build the project
- `bun run lint` / `eslint .` — lint code

## Notes for future improvements
- Add terminal input handling, chat message rendering, and conversational state in `src/app.tsx`.
- Use `@opentui/core` and `@opentui/react` idioms for text, boxes, and keyboard interaction.
- If backend-style behavior is needed, prefer lightweight in-app logic rather than browser APIs.
