import { ArrowRight, Info } from 'lucide-react'
import { Link } from 'react-router'
import { posPlatform } from '@/content/posPlatform'
import { Reveal } from '@/components/motion/Reveal'
import { PlatformDiagram } from '@/components/platform/PlatformDiagram'
import { SectionHeading } from '@/components/ui/SectionHeading'

export function SideProjectFeature() {
  return (
    <section id="projects" className="bg-base-200 py-20">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 lg:grid-cols-2">
        <Reveal>
          <SectionHeading
            eyebrow="Side project"
            title={`${posPlatform.title}: one API, three apps`}
            intro={posPlatform.tagline}
          />
          <p className="text-base-content/60 -mt-4 mb-6 flex gap-2 text-sm">
            <Info className="mt-0.5 size-4 shrink-0" /> Self-taught. Electron and React Native are
            not part of my professional experience.
          </p>
          <ul className="text-base-content/80 mb-8 space-y-2">
            <li>• 85-endpoint Laravel 13 API with Sanctum auth and branch scoping</li>
            <li>• Offline-first desktop and mobile apps with safe retries</li>
            <li>• Multi-branch stock transfers with an approval workflow</li>
          </ul>
          <Link to="/projects/pos-platform" className="btn btn-primary group">
            See the architecture and API{' '}
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Reveal>
        <Reveal delay={0.1}>
          <PlatformDiagram />
        </Reveal>
      </div>
    </section>
  )
}
