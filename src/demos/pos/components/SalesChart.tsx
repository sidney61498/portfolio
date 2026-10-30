import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useCssVar } from '@/lib/theme'
import { formatPHP } from '../domain/money'
import type { DayRow } from '../domain/reports'
import { fmtDay } from './format'

interface TipProps {
  active?: boolean
  payload?: { payload: DayRow }[]
}

function ChartTooltip({ active, payload }: TipProps) {
  if (!active || !payload?.length) return null
  const row = payload[0].payload
  return (
    <div className="bg-base-100 border-base-300 rounded-box border px-3 py-2 text-sm shadow-md">
      <p className="font-semibold">{fmtDay(row.date)}</p>
      <p>Sales: {formatPHP(row.sales)}</p>
      <p className="text-base-content/70">{row.transactions} transactions</p>
    </div>
  )
}

const pesoTick = (v: number) => (v >= 100000 ? `₱${Math.round(v / 100000)}k` : `₱${Math.round(v / 100)}`)

/**
 * One series, so no legend: the card title names it. Thin bars with rounded tops, a recessive
 * grid, and a hover tooltip. Colors come from the theme tokens so dark mode gets its own steps.
 */
export function SalesChart({ rows, height = 240 }: { rows: DayRow[]; height?: number }) {
  const bar = useCssVar('--color-primary')
  const ink = useCssVar('--color-base-content')
  const grid = useCssVar('--color-base-300')

  return (
    <div style={{ height }} role="img" aria-label={`Daily sales chart, ${rows.length} days. The table below has the same data.`}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={rows} margin={{ top: 8, right: 8, bottom: 0, left: 0 }} barCategoryGap="30%">
          <CartesianGrid vertical={false} stroke={grid} />
          <XAxis
            dataKey="date"
            tickFormatter={fmtDay}
            tick={{ fill: ink, fillOpacity: 0.6, fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            interval="preserveStartEnd"
            minTickGap={16}
          />
          <YAxis tickFormatter={pesoTick} tick={{ fill: ink, fillOpacity: 0.6, fontSize: 12 }} axisLine={false} tickLine={false} width={56} />
          <Tooltip content={<ChartTooltip />} cursor={{ fill: grid, fillOpacity: 0.4 }} />
          <Bar dataKey="sales" fill={bar} radius={[4, 4, 0, 0]} maxBarSize={36} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
