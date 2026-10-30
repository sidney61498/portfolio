/** A card that glows softly under the cursor (see .spotlight in index.css). */
export function SpotlightCard({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--x', `${e.clientX - rect.left}px`)
    e.currentTarget.style.setProperty('--y', `${e.clientY - rect.top}px`)
  }
  return (
    <div onMouseMove={onMove} className={`spotlight ${className}`}>
      {children}
    </div>
  )
}
