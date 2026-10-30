import { Fragment } from 'react'
import { PLACEHOLDER } from '@/lib/placeholders'

/** Renders content text, highlighting any unfilled [placeholder] so it is easy to spot. */
export function Text({ children }: { children: string }) {
  const parts = children.split(PLACEHOLDER)
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <mark key={i} className="placeholder-text" title="Placeholder: fill in docs/CONTENT.md">
            {part}
          </mark>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        ),
      )}
    </>
  )
}
