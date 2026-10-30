/** Money is always an integer number of centavos (₱1.00 = 100). Never use floats for money. */
export type Centavos = number

export const pesos = (amount: number): Centavos => Math.round(amount * 100)

const phpFormat = new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' })

export const formatPHP = (amount: Centavos): string => phpFormat.format(amount / 100)

/** For number inputs: "123.45" → 12345. Returns NaN for anything that isn't a number. */
export function parsePesos(input: string): Centavos {
  const trimmed = input.trim()
  if (!/^-?\d+(\.\d{1,2})?$/.test(trimmed)) return NaN
  return pesos(Number(trimmed))
}

export const toPesoString = (amount: Centavos): string => (amount / 100).toFixed(2)
