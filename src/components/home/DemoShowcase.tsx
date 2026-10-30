import { ArrowRight, Boxes, Receipt, ScanBarcode, ShieldCheck } from 'lucide-react'
import { motion } from 'motion/react'
import { Link } from 'react-router'
import { Reveal, Stagger } from '@/components/motion/Reveal'
import { staggerItem } from '@/components/motion/variants'
import { SectionHeading } from '@/components/ui/SectionHeading'

const FEATURES = [
  { icon: ScanBarcode, text: 'Barcode-ready register with VAT-inclusive receipts' },
  { icon: Boxes, text: 'Stock ledger: every change is traceable, before and after' },
  { icon: ShieldCheck, text: 'Cashier and Manager roles, voids and refunds' },
  { icon: Receipt, text: 'Dashboard, reports and CSV export' },
]

/** A small HTML mock of the register screen, so the card needs no screenshot file. */
function RegisterPreview() {
  const items = [
    'Iced Coffee',
    'Pandesal',
    'Corned Beef',
    'Banana Chips',
    'Bottled Water',
    'Ube Latte',
  ]
  return (
    <div
      aria-hidden="true"
      className="bg-base-100 border-base-300 rounded-box grid grid-cols-[3fr_2fr] gap-3 border p-3 shadow-2xl transition-transform duration-500 hover:[transform:perspective(900px)_rotateY(-4deg)_rotateX(2deg)_scale(1.02)]"
    >
      <div className="grid grid-cols-3 gap-2">
        {items.map((name, i) => (
          <div key={name} className="bg-base-200 rounded-field p-2 text-[10px] sm:text-xs">
            <div className="bg-primary/15 text-primary mb-1 grid h-8 place-items-center rounded font-bold">
              {name.slice(0, 2).toUpperCase()}
            </div>
            <div className="truncate">{name}</div>
            <div className="text-base-content/60">₱{[85, 30, 58, 45, 15, 120][i]}.00</div>
          </div>
        ))}
      </div>
      <div className="bg-base-200 rounded-field flex flex-col p-2 text-[10px] sm:text-xs">
        <div className="mb-1 font-semibold">Cart</div>
        <div className="flex justify-between">
          <span>2 × Iced Coffee</span>
          <span>₱170.00</span>
        </div>
        <div className="flex justify-between">
          <span>1 × Pandesal</span>
          <span>₱30.00</span>
        </div>
        <div className="border-base-300 mt-auto border-t pt-1">
          <div className="text-base-content/60 flex justify-between">
            <span>VAT 12%</span>
            <span>₱21.43</span>
          </div>
          <div className="flex justify-between font-bold">
            <span>Total</span>
            <span>₱200.00</span>
          </div>
          <div className="bg-primary text-primary-content mt-1 rounded py-1 text-center font-semibold">
            Pay
          </div>
        </div>
      </div>
    </div>
  )
}

export function DemoShowcase() {
  return (
    <section id="demo" className="py-20">
      <div className="mx-auto max-w-6xl px-4">
        <Reveal>
          <SectionHeading
            eyebrow="Live demo"
            title="Tindahan POS: a point-of-sale and inventory system you can try"
            intro="I built POS and inventory systems at Mariano Marcos State University, and inventory for a hospital. Those are private, so this is a clean-room version you can click through: ring up a sale, watch stock update in the ledger, switch to Manager and void it."
          />
        </Reveal>
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <Stagger className="space-y-3">
              {FEATURES.map(({ icon: Icon, text }) => (
                <motion.p key={text} variants={staggerItem} className="flex items-start gap-3">
                  <span className="bg-accent/15 text-accent grid size-8 shrink-0 place-items-center rounded-lg">
                    <Icon className="size-4" />
                  </span>
                  <span className="pt-1">{text}</span>
                </motion.p>
              ))}
            </Stagger>
            <p className="text-base-content/60 mt-6 text-sm">
              React · TypeScript · Tailwind CSS · daisyUI · Zustand · Recharts · tested with Vitest
              and Playwright. Runs entirely in your browser; nothing is sent anywhere.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/demo/pos" className="btn btn-primary">
                Open the demo <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
          <Reveal delay={0.1}>
            <RegisterPreview />
          </Reveal>
        </div>
      </div>
    </section>
  )
}
