import { useMemo } from "react"
import {  SyntaxStyle, RGBA } from "@opentui/core"

// ─── Syntax style ──────────────────────────────────────────────────────────

const MARKDOWN_SYNTAX_STYLE = SyntaxStyle.fromStyles({
  // Headings
  "markup.heading":   { fg: RGBA.fromHex("#58A6FF"), bold: true },
  "markup.heading.1": { fg: RGBA.fromHex("#79C0FF"), bold: true },
  "markup.heading.2": { fg: RGBA.fromHex("#58A6FF"), bold: true },
  "markup.heading.3": { fg: RGBA.fromHex("#388BFD"), bold: true },

  // Inline formatting
  "markup.bold":   { fg: RGBA.fromHex("#F0F6FC"), bold: true },
  "markup.strong": { fg: RGBA.fromHex("#F0F6FC"), bold: true },
  "markup.italic": { fg: RGBA.fromHex("#E6EDF3"), italic: true },

  // Lists
  "markup.list": { fg: RGBA.fromHex("#FF7B72") },

  // Inline code & code blocks
  "markup.raw":       { fg: RGBA.fromHex("#A5D6FF") },
  "markup.raw.block": { fg: RGBA.fromHex("#A5D6FF") },

  // Links
  "markup.link":     { fg: RGBA.fromHex("#58A6FF"), underline: true },
  "markup.link.url": { fg: RGBA.fromHex("#58A6FF"), underline: true },

  // Blockquotes
  "markup.quote": { fg: RGBA.fromHex("#8B949E"), italic: true },

  // Code block syntax tokens
  keyword:              { fg: RGBA.fromHex("#FF7B72"), bold: true },
  "keyword.import":     { fg: RGBA.fromHex("#FF7B72") },
  "keyword.operator":   { fg: RGBA.fromHex("#FF7B72") },
  string:               { fg: RGBA.fromHex("#A5D6FF") },
  comment:              { fg: RGBA.fromHex("#8B949E"), italic: true },
  number:               { fg: RGBA.fromHex("#79C0FF") },
  boolean:              { fg: RGBA.fromHex("#79C0FF") },
  constant:             { fg: RGBA.fromHex("#79C0FF") },
  function:             { fg: RGBA.fromHex("#D2A8FF") },
  "function.call":      { fg: RGBA.fromHex("#D2A8FF") },
  type:                 { fg: RGBA.fromHex("#FFA657") },
  variable:             { fg: RGBA.fromHex("#E6EDF3") },
  "variable.member":    { fg: RGBA.fromHex("#79C0FF") },
  operator:             { fg: RGBA.fromHex("#FF7B72") },
  punctuation:          { fg: RGBA.fromHex("#F0F6FC") },

  // Fallback
  default: { fg: RGBA.fromHex("#E6EDF3") },
})

// ─── Component ─────────────────────────────────────────────────────────────

interface MarkdownMessageProps {
  content: string
}

 function Markdown({
  content,
}: MarkdownMessageProps) {
  // SyntaxStyle is stable across renders — defined once at module level.
  // We still memoize props to avoid unnecessary vnode churn.
  const markdownProps = useMemo(
    () => ({
      content,
      syntaxStyle: MARKDOWN_SYNTAX_STYLE,
      conceal: true,
      concealCode: false,
    }),
    [content],
  )

  // MarkdownRenderable has no construct helper, so we use JSX with the class
  // directly — the opentui reconciler accepts RenderableConstructors as JSX
  // element types via the h() vnode system.
  return <markdown syntaxStyle={MARKDOWN_SYNTAX_STYLE} content={content}/>
}

export default Markdown