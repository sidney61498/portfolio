import { ArrowLeft, ArrowRight, ImageIcon, PlayCircle } from 'lucide-react'
import { useEffect } from 'react'
import { Link, useParams } from 'react-router'
import { projectBySlug, projects } from '@/content/projects'
import { Text } from '@/components/ui/Text'
import { NotFoundPage } from './NotFoundPage'

const withPages = projects.filter((p) => p.page)

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="text-accent mb-3 text-sm font-semibold tracking-widest uppercase">{title}</h2>
      <div className="text-base-content/85 text-lg leading-relaxed">{children}</div>
    </section>
  )
}

export function CaseStudyPage() {
  const { slug = '' } = useParams()
  const project = projectBySlug(slug)

  useEffect(() => {
    if (project) document.title = `${project.title} | Sidney Medrano`
  }, [project])

  if (!project?.page) return <NotFoundPage />
  const { page } = project

  const index = withPages.findIndex((p) => p.slug === slug)
  const prev = withPages[index - 1]
  const next = withPages[index + 1]

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:py-16">
      <Link to={{ pathname: '/', hash: 'work' }} className="btn btn-ghost btn-sm mb-8 -ml-3">
        <ArrowLeft className="size-4" /> All work
      </Link>
      <p className="text-base-content/60 text-sm font-medium tracking-wide uppercase">
        {project.employer} · {project.period}
      </p>
      <h1 className="mt-2 text-3xl leading-tight font-bold sm:text-4xl">{project.title}</h1>
      <div className="mt-4 mb-12 flex flex-wrap gap-2">
        {project.stack.map((s) => (
          <span key={s} className="badge badge-soft badge-primary">
            <Text>{s}</Text>
          </span>
        ))}
      </div>

      <Block title="Context">
        <Text>{page.context}</Text>
      </Block>
      {page.problem && (
        <Block title="Problem">
          <Text>{page.problem}</Text>
        </Block>
      )}
      <Block title="My role">
        <Text>{page.role}</Text>
      </Block>
      <Block title="Approach">
        <ul className="list-disc space-y-2 pl-5">
          {page.approach.map((a) => (
            <li key={a}>
              <Text>{a}</Text>
            </li>
          ))}
        </ul>
      </Block>
      <Block title="Outcome">
        <Text>{page.outcome}</Text>
      </Block>

      {page.visuals.map((v) => (
        <figure key={v} className="border-base-300 bg-base-200 rounded-box mb-10 grid min-h-48 place-items-center border-2 border-dashed p-6 text-center">
          <div>
            <ImageIcon className="text-base-content/40 mx-auto mb-2 size-8" />
            <figcaption className="text-base-content/70">
              <Text>{v}</Text>
            </figcaption>
          </div>
        </figure>
      ))}

      {project.demo && (
        <Link to={project.demo.href} className="btn btn-accent mb-10">
          <PlayCircle className="size-4" /> {project.demo.label}
        </Link>
      )}

      <nav className="border-base-300 flex justify-between gap-4 border-t pt-8" aria-label="More case studies">
        {prev ? (
          <Link to={`/work/${prev.slug}`} className="btn btn-ghost h-auto max-w-[48%] py-2 text-left">
            <ArrowLeft className="size-4 shrink-0" /> <span className="line-clamp-2">{prev.title}</span>
          </Link>
        ) : <span />}
        {next && (
          <Link to={`/work/${next.slug}`} className="btn btn-ghost h-auto max-w-[48%] py-2 text-right">
            <span className="line-clamp-2">{next.title}</span> <ArrowRight className="size-4 shrink-0" />
          </Link>
        )}
      </nav>
    </article>
  )
}
