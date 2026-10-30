const dateTime = new Intl.DateTimeFormat('en-PH', { dateStyle: 'medium', timeStyle: 'short' })
const dateOnly = new Intl.DateTimeFormat('en-PH', { month: 'short', day: 'numeric' })
const weekday = new Intl.DateTimeFormat('en-PH', { weekday: 'short' })

export const fmtDateTime = (iso: string) => dateTime.format(new Date(iso))
export const fmtDay = (key: string) => dateOnly.format(new Date(`${key}T00:00:00`))
export const fmtWeekday = (key: string) => weekday.format(new Date(`${key}T00:00:00`))

export const STATUS_BADGE: Record<string, string> = {
  completed: 'badge-success',
  voided: 'badge-error',
  partially_refunded: 'badge-warning',
  refunded: 'badge-warning',
}

export const statusLabel = (s: string) => s.replace('_', ' ')

export function downloadCsv(filename: string, csv: string) {
  // BOM so Excel opens UTF-8 (the ₱ sign) correctly.
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
