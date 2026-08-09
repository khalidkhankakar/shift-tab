import type { CliRenderer } from "@opentui/core";

export interface CommandContext {
    /** The opentui renderer — use for exit, clipboard, focus ops */
    renderer: CliRenderer | null;
    /** Clear messages and start a fresh conversation (keeps session) */
    onNewChat: () => void;
    /** Alias for onNewChat — /clear has same behaviour */
    onClearChat: () => void;
    /** Delete entire session permanently and quit */
    onDeleteAndExit: () => void;
    /** Open the model-selector overlay */
    onOpenModelSelector: () => void;
    /** The last assistant message text, for /copy */
    lastAssistantMessage: string;
}

export interface Command {
    name: string;
    description: string;
    execute: (ctx: CommandContext) => void;
}

export const ALL_COMMANDS: Command[] = [
    {
        name: "/new",
        description: "start a new conversation",
        execute: (ctx) => {
            ctx.onNewChat();
        },
    },
    {
        name: "/model",
        description: "select an AI model",
        execute: (ctx) => {
            ctx.onOpenModelSelector();
        },
    },
    {
        name: "/clear",
        description: "clear messages and start a new chat",
        execute: (ctx) => {
            ctx.onClearChat();
        },
    },
    {
        name: "/delete",
        description: "delete this session permanently and exit",
        execute: (ctx) => {
            ctx.onDeleteAndExit();
        },
    },
    {
        name: "/copy",
        description: "copy the last assistant response",
        execute: (ctx) => {
            if (!ctx.lastAssistantMessage) return;
            const copied = ctx.renderer?.copyToClipboardOSC52(ctx.lastAssistantMessage) ?? false;
            if (!copied) {
                // OSC52 not supported — fall back to a no-op (terminal doesn't support it)
                // We still close gracefully; the user will see no feedback but nothing breaks
            }
        },
    },
    {
        name: "/exit",
        description: "exit ShiftTab",
        execute: (ctx) => {
            ctx.renderer?.destroy();
            process.exit(0);
        },
    },
];

/** Flat array of command name strings — used for "is this a completed command?" checks */
export const commandsArr = ALL_COMMANDS.map((c) => c.name);

/** Look up a command by its exact name */
export function findCommand(name: string): Command | undefined {
    return ALL_COMMANDS.find((c) => c.name === name);
}