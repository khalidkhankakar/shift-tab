import { TextAttributes } from "@opentui/core";
import { useEffect, useState } from "react";
import type { ToolUIPart, UITools, DynamicToolUIPart } from "ai";

// ─── spinner ────────────────────────────────────────────────────────────────
const SPINNER_FRAMES = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"] as const;

function useSpinner(active: boolean): string {
  const [frame, setFrame] = useState(0);
  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => setFrame((f) => (f + 1) % SPINNER_FRAMES.length), 80);
    return () => clearInterval(id);
  }, [active]);
  return SPINNER_FRAMES[frame];
}

// ─── icon / colour maps ──────────────────────────────────────────────────────
type ToolState =
  | "input-streaming"
  | "input-available"
  | "approval-requested"
  | "approval-responded"
  | "output-available"
  | "output-error"
  | "output-denied";

const STATE_COLOR: Record<ToolState, string> = {
  "input-streaming": "#fabd2f",   // yellow – working
  "input-available": "#fabd2f",   // yellow – working
  "approval-requested": "#fe8019", // orange – waiting
  "approval-responded": "#83a598", // muted blue
  "output-available": "#b8bb26",  // green – done
  "output-error": "#fb4934",      // red – error
  "output-denied": "#928374",     // grey – denied
};

const STATE_ICON: Record<ToolState, string> = {
  "input-streaming": "…",   // replaced by spinner component
  "input-available": "…",
  "approval-requested": "⚠",
  "approval-responded": "↩",
  "output-available": "✓",
  "output-error": "✗",
  "output-denied": "⊘",
};

const STATE_LABEL: Record<ToolState, string> = {
  "input-streaming": "Calling",
  "input-available": "Running",
  "approval-requested": "Needs approval",
  "approval-responded": "Approval given",
  "output-available": "Done",
  "output-error": "Failed",
  "output-denied": "Denied",
};

// ─── pretty-print helper ─────────────────────────────────────────────────────
function stringify(value: unknown): string {
  if (value === undefined || value === null) return "";
  if (typeof value === "string") return value;
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}

// ─── human-readable tool name ────────────────────────────────────────────────
// "writeFile" → "Write File",  "listDirectory" → "List Directory"
function humanizeName(name: string): string {
  return name
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (c) => c.toUpperCase())
    .trim();
}

// ─── ToolCallCard ─────────────────────────────────────────────────────────────
export interface ToolCallCardProps<TOOLS extends UITools = UITools> {
  /** The raw ToolUIPart or DynamicToolUIPart from message.parts */
  part: ToolUIPart<TOOLS> | DynamicToolUIPart;
  /** Override the display name (defaults to humanizing the tool name) */
  displayName?: string;
}

export function ToolCallCard<TOOLS extends UITools = UITools>({
  part,
  displayName,
}: ToolCallCardProps<TOOLS>) {
  const state = part.state as ToolState;
  const isSpinning = state === "input-streaming" || state === "input-available";
  const spinner = useSpinner(isSpinning);

  // Derive tool name: ToolUIPart has `type` = "tool-<name>", DynamicToolUIPart has `toolName`
  const rawName =
    "toolName" in part
      ? (part as DynamicToolUIPart).toolName
      : (part.type as string).replace(/^tool-/, "");

  const label = displayName ?? humanizeName(rawName);
  const color = STATE_COLOR[state] ?? "#83a598";
  const icon = isSpinning ? spinner : (STATE_ICON[state] ?? "·");
  const stateLabel = STATE_LABEL[state] ?? state;

  // Input summary (show for all states that have input)
  const inputStr =
    "input" in part && part.input !== undefined ? stringify(part.input) : null;

  // Output / error text
  const outputStr =
    state === "output-available" && "output" in part
      ? stringify(part.output)
      : null;
  const errorStr =
    state === "output-error" && "errorText" in part ? (part.errorText as string) : null;

  return (
    <box
      flexDirection="column"
      borderStyle="round"
      borderColor={color}
      marginTop={0}
      marginBottom={1}
      paddingLeft={1}
      paddingRight={1}
      maxWidth="90%"
    >
      {/* ── header row ── */}
      <box flexDirection="row" gap={1}>
        <text fg={color}>{icon}</text>
        <text attributes={TextAttributes.BOLD} fg={color}>
          {label}
        </text>
        <text fg="#665c54">·</text>
        <text fg={color}>{stateLabel}</text>
      </box>

      {/* ── input summary (when available and not yet done) ── */}
      {inputStr && state !== "output-available" && (
        <box paddingLeft={1} marginTop={0}>
          <text fg="#a89984" wrapMode="word">
            {inputStr}
          </text>
        </box>
      )}

      {/* ── output (on success) ── */}
      {outputStr && (
        <box
          paddingLeft={1}
          marginTop={0}
          borderStyle="single"
          borderColor="#504945"
        >
          <text fg="#bdae93" wrapMode="word">
            {outputStr}
          </text>
        </box>
      )}

      {/* ── error text ── */}
      {errorStr && (
        <box paddingLeft={1} marginTop={0}>
          <text fg="#fb4934" wrapMode="word">
            {errorStr}
          </text>
        </box>
      )}

      {/* ── approval reason (on denied) ── */}
      {state === "output-denied" &&
        "approval" in part &&
        part.approval &&
        "reason" in part.approval &&
        part.approval.reason && (
          <box paddingLeft={1} marginTop={0}>
            <text fg="#928374" wrapMode="word">
              {part.approval.reason}
            </text>
          </box>
        )}
    </box>
  );
}