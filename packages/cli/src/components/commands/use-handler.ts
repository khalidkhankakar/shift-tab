import { useCallback } from "react";
import { useAppContext } from "@opentui/react";
import { findCommand, type CommandContext } from "./commands";

interface UseCommandHandlerOptions {
    onNewChat: () => void;
    onClearChat: () => void;
    onDeleteAndExit: () => void;
    onOpenModelSelector: () => void;
    lastAssistantMessage: string;
}

/**
 * Returns an `executeCommand(name)` function that runs a command against
 * the live renderer context.  Call it from ChatInput after the user selects
 * or types a slash-command.
 */
export function useCommandHandler({
    onNewChat,
    onClearChat,
    onDeleteAndExit,
    onOpenModelSelector,
    lastAssistantMessage,
}: UseCommandHandlerOptions) {
    const { renderer } = useAppContext();

    const executeCommand = useCallback(
        (commandName: string) => {
            const command = findCommand(commandName);
            if (!command) return;

            const ctx: CommandContext = {
                renderer,
                onNewChat,
                onClearChat,
                onDeleteAndExit,
                onOpenModelSelector,
                lastAssistantMessage,
            };

            command.execute(ctx);
        },
        [renderer, onNewChat, onClearChat, onDeleteAndExit, onOpenModelSelector, lastAssistantMessage]
    );

    return { executeCommand };
}