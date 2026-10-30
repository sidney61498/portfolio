import { formatPHP } from '../domain/money'
import type { Sale, Settings } from '../domain/types'
import { fmtDateTime, statusLabel } from './format'

/** The printable receipt. The print stylesheet in index.css prints only #receipt-print at 80mm. */
export function Receipt({ sale, settings }: { sale: Sale; settings: Settings }) {
  return (
    <div id="receipt-print" className="bg-base-100 font-mono text-sm">
      <div className="text-center">
        <p className="font-bold">{settings.storeName}</p>
        <p className="text-xs">{settings.address}</p>
        <p className="text-xs">VAT REG TIN {settings.tin}</p>
        <p className="mt-2 text-xs">DEMO RECEIPT · NOT AN OFFICIAL RECEIPT</p>
      </div>
      <div className="border-base-content/30 my-2 border-t border-dashed" />
      <div className="flex justify-between text-xs">
        <span>{sale.orNumber}</span>
        <span>{fmtDateTime(sale.at)}</span>
      </div>
      <div className="text-xs">Cashier: {sale.role === 'manager' ? 'Manager' : 'Cashier'}</div>
      <div className="border-base-content/30 my-2 border-t border-dashed" />
      {sale.lines.map((l) => (
        <div key={l.productId} className="mb-1">
          <div>{l.name}</div>
          <div className="flex justify-between text-xs">
            <span>
              {l.qty} × {formatPHP(l.unitPrice)}
              {l.discount > 0 && ` (−${formatPHP(l.discount)})`}
            </span>
            <span>{formatPHP(l.qty * l.unitPrice - l.discount)}</span>
          </div>
        </div>
      ))}
      <div className="border-base-content/30 my-2 border-t border-dashed" />
      {sale.orderDiscount > 0 && <Row label="Order discount" value={`−${formatPHP(sale.orderDiscount)}`} />}
      <Row label="TOTAL" value={formatPHP(sale.total)} bold />
      <Row label={sale.payment.method === 'cash' ? 'Cash' : `E-wallet ${sale.payment.reference ?? ''}`} value={formatPHP(sale.payment.tendered ?? sale.payment.amount)} />
      {sale.payment.method === 'cash' && <Row label="Change" value={formatPHP(sale.change)} />}
      <div className="border-base-content/30 my-2 border-t border-dashed" />
      <Row label={`VATable sales`} value={formatPHP(sale.vatableSales)} />
      <Row label={`VAT (${Math.round(settings.vatRate * 100)}%)`} value={formatPHP(sale.vat)} />
      {sale.status !== 'completed' && <p className="mt-2 text-center font-bold uppercase">*** {statusLabel(sale.status)} ***</p>}
      <p className="mt-3 text-center text-xs">Salamat po! Come again.</p>
    </div>
  )
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className={`flex justify-between ${bold ? 'font-bold' : 'text-xs'}`}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  )
}
