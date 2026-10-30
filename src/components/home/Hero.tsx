import { ArrowRight, Download, MapPin } from 'lucide-react'
import { Link } from 'react-router'
import { profile } from '@/content/profile'
import photo from '@/assets/sidney.webp'

export function Hero() {
  return (
    <section id="top" className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:py-24 md:grid-cols-[1fr_auto]">
      <div>
        <p className="text-accent mb-3 text-sm font-semibold tracking-widest uppercase">{profile.stackLine}</p>
        <h1 className="text-4xl leading-tight font-bold sm:text-6xl">{profile.name}</h1>
        <p className="text-base-content/80 mt-2 text-xl sm:text-2xl">{profile.title}</p>
        <p className="text-base-content/70 mt-6 max-w-2xl text-lg">{profile.pitch}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to={{ pathname: '/', hash: 'work' }} className="btn btn-primary">
            View my work <ArrowRight className="size-4" />
          </Link>
          <Link to="/demo/pos" className="btn btn-outline">
            Try the POS demo
          </Link>
          {profile.resumeUrl && (
            <a href={profile.resumeUrl} className="btn btn-ghost" download>
              <Download className="size-4" /> Resume
            </a>
          )}
        </div>
        <p className="text-base-content/60 mt-6 flex items-center gap-2 text-sm">
          <MapPin className="size-4" /> {profile.location} · {profile.availability}
        </p>
      </div>
      <div className="justify-self-center">
        <div className="avatar">
          <div className="ring-primary ring-offset-base-100 w-44 rounded-full ring-2 ring-offset-4 sm:w-64">
            <img src={photo} alt={`Portrait of ${profile.name}`} width={256} height={256} />
          </div>
        </div>
      </div>
    </section>
  )
}
