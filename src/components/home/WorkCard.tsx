import { ArrowRight, ArrowUpRight, PlayCircle } from 'lucide-react'
import { Link } from 'react-router'
import type { Project } from '@/content/projects'
import { SpotlightCard } from '@/components/ui/SpotlightCard'
import { Text } from '@/components/ui/Text'

export function WorkCard({ project }: { project: Project }) {
  const { slug, title, employer, period, summary, stack, page, demo, href, featured } = project
  const link = href ?? (page ? `/work/${slug}` : undefined)
  return (
    <SpotlightCard className="card bg-base-100 border-base-300 group h-full border transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <article className="card-body">
        <div className="flex items-start justify-between gap-2">
          <p className="text-base-content/60 text-xs font-medium tracking-wide uppercase">
            {employer} · {period}
          </p>
          {featured && (
            <span className="badge badge-accent badge-soft badge-sm shrink-0">Featured</span>
          )}
        </div>
        <h3 className="card-title text-lg leading-snug">
          {link ? (
            <Link to={link} className="after:absolute after:inset-0 hover:underline">
              {title}
            </Link>
          ) : (
            title
          )}
        </h3>
        <p className="text-base-content/75">
          <Text>{summary}</Text>
        </p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {stack.map((s) => (
            <span key={s} className="badge badge-ghost badge-sm">
              <Text>{s}</Text>
            </span>
          ))}
        </div>
        {(link || demo) && (
          <div className="card-actions relative z-10 mt-auto pt-4">
            {link && (
              <Link to={link} className="btn btn-sm btn-primary btn-soft">
                {href ? 'Explore' : 'Read case study'}
                {href ? (
                  <ArrowUpRight className="size-4" />
                ) : (
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                )}
              </Link>
            )}
            {demo && (
              <Link to={demo.href} className="btn btn-sm btn-accent btn-soft">
                <PlayCircle className="size-4" /> {demo.label}
              </Link>
            )}
          </div>
        )}
      </article>
    </SpotlightCard>
  )
}
