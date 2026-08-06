import { TextAttributes } from '@opentui/core'

const SUGGESTIONS = [
  "Explain what this function does",
  "Refactor this for readability",
  "Help me fix a failing test",
  "Write unit tests for this module",
]

const EmptyState = () => {
  return (
    <box
      flexGrow={1}
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
      gap={1}
      paddingX={2}

    >
      <text attributes={TextAttributes.DIM}>
        Ask coding questions, debug projects, explain concepts, or write code.
      </text>

      <box flexDirection="column" marginTop={1} gap={0}>
        {SUGGESTIONS.map((suggestion) => (
          <box key={suggestion} flexDirection="row" gap={1}>
            <text fg="#565f89">›</text>
            <text attributes={TextAttributes.DIM}>{suggestion}</text>
          </box>
        ))}
      </box>

      <box marginTop={1}>
        <text attributes={TextAttributes.DIM} fg="#565f89">
          Type below and press Enter to send
        </text>
      </box>
    </box>
  )
}

export default EmptyState