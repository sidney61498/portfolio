export function SectionHeading({
  eyebrow,
  title,
  intro,
}: {
  eyebrow: string
  title: string
  intro?: string
}) {
  return (
    <div className="mb-10 max-w-2xl">
      <p className="text-accent mb-2 text-sm font-semibold tracking-widest uppercase">{eyebrow}</p>
      <h2 className="text-3xl font-bold sm:text-4xl">{title}</h2>
      {intro && <p className="text-base-content/70 mt-4 text-lg">{intro}</p>}
    </div>
  )
}
