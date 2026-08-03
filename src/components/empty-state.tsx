import { fonts, TextAttributes } from '@opentui/core'
import React from 'react'

const EmptyState = () => {
  return (
    <box
      flexGrow={1}
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
      gap={2}
      paddingX={2}
    >
      <ascii-font font="tiny" text='How can I help you today?' />
      <text  attributes={TextAttributes.DIM}>
        Ask coding questions, debug projects, explain concepts, or write code.
      </text>
    </box>
  )
}

export default EmptyState