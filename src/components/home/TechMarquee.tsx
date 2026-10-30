const TECH = [
  'Laravel',
  'React',
  'Vue',
  'Angular',
  'CakePHP',
  'TypeScript',
  'MySQL',
  'Tailwind CSS',
  'Docker',
  'AWS',
  'n8n',
  'Playwright',
  'Claude Code',
  'GitHub Actions',
  'jQuery',
  'Nuxt',
]

/** An endless strip of the stack. The list is doubled so the loop is seamless. */
export function TechMarquee() {
  return (
    <div
      className="border-base-300 marquee-mask overflow-hidden border-y py-5"
      aria-label="Technologies I use"
    >
      <ul className="animate-marquee flex w-max gap-10 hover:[animation-play-state:paused]">
        {[...TECH, ...TECH].map((t, i) => (
          <li
            key={i}
            aria-hidden={i >= TECH.length}
            className="text-base-content/50 font-display text-lg font-semibold whitespace-nowrap"
          >
            {t}
          </li>
        ))}
      </ul>
    </div>
  )
}
