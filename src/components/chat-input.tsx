import { TextAttributes } from '@opentui/core';
import React from 'react'

const ChatInput = ({
  value,
  onValueChange,
  onSubmit,
}: {
  value: string;
  onValueChange: (value: string) => void;
  onSubmit: (value: string) => void;
}) => {
  return (
  <box flexDirection={'row'} alignItems='center' justifyContent='center' >
  <box  borderStyle='heavy' borderColor={'gray'} gap={1} flexDirection="column" justifyContent='center'width={"60%"} marginBottom={`${1}%`} paddingX={1} paddingY={0}>
        <box flexDirection="row" alignItems="center" gap={1}>
          <text>▸</text>
          <input
            placeholder={"Ask anything..."}
            focused
            value={value}
            onInput={onValueChange}
            onSubmit={() => onSubmit(value)}
            flexGrow={1}
          />
          <text attributes={TextAttributes.DIM}>⌘↵</text>
        </box>
  
        <box justifyContent="space-between" paddingTop={0}>
          <text  attributes={TextAttributes.DIM}>@file /command Ctrl+K Shift+Tab Esc</text>
        </box>
      </box>
      </box>
  )
}

export default ChatInput
