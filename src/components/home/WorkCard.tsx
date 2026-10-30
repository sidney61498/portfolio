import { ArrowRight, PlayCircle } from 'lucide-react'
import { Link } from 'react-router'
import type { Project } from '@/content/projects'
import { Text } from '@/components/ui/Text'

export function WorkCard({ project }: { project: Project }) {
  const { slug, title, employer, period, summary, stack, page, demo } = project
  return (
    <article className="card bg-base-100 border-base-300 h-full border transition-shadow hover:shadow-md">
      <div className="card-body">
        <p className="text-base-content/60 text-xs font-medium tracking-wide uppercase">
          {employer} · {period}
        </p>
        <h3 className="card-title text-lg leading-snug">
          {page ? (
            <Link to={`/work/${slug}`} className="link-hover">
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
        {(page || demo) && (
          <div className="card-actions mt-4">
            {page && (
              <Link to={`/work/${slug}`} className="btn btn-sm btn-primary btn-soft">
                Read case study <ArrowRight className="size-4" />
              </Link>
            )}
            {demo && (
              <Link to={demo.href} className="btn btn-sm btn-accent btn-soft">
                <PlayCircle className="size-4" /> {demo.label}
              </Link>
            )}
          </div>
        )}
      </div>
    </article>
  )
}
