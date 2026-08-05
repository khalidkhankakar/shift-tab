import {  TextAttributes } from '@opentui/core'
const EmptyState = () => {
  return (
    <box
      flexGrow={1}
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
      gap={2}
      paddingX={2}
      borderColor={'cyan'}
      borderStyle="heavy"
    >
      <ascii-font font="tiny" text='How can I help you today?' />
      <text attributes={TextAttributes.DIM} >
        Ask coding questions, debug projects, explain concepts, or write code.
      </text>
    </box>
  )
}

export default EmptyState