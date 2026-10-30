// Same rule as scripts/count-placeholders.mjs: a placeholder is [text] starting with a letter.
export const PLACEHOLDER = /(\[[A-Za-z][^\]\n]*\])/g

export const isPlaceholder = (text: string) => /^\[[A-Za-z][^\]\n]*\]$/.test(text.trim())
