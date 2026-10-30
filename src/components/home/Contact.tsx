import { Check, Copy, Download, Mail } from 'lucide-react'
import { useState } from 'react'
import { profile } from '@/content/profile'
import { isPlaceholder } from '@/lib/placeholders'
import { GithubIcon, LinkedinIcon } from '@/components/ui/BrandIcons'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Text } from '@/components/ui/Text'

function SocialLink({ href, label, icon }: { href: string; label: string; icon: React.ReactNode }) {
  if (isPlaceholder(href)) {
    return (
      <span className="btn btn-ghost btn-disabled gap-2">
        {icon} <Text>{href}</Text>
      </span>
    )
  }
  return (
    <a href={href} target="_blank" rel="noreferrer" className="btn btn-ghost gap-2">
      {icon} {label}
    </a>
  )
}

export function Contact() {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* clipboard blocked: the mailto link still works */
    }
  }

  return (
    <section id="contact" className="py-20">
      <div className="mx-auto max-w-3xl px-4 text-center">
        <SectionHeading eyebrow="Contact" title="Let’s talk" />
        <p className="text-base-content/70 -mt-6 mb-8 text-lg">
          Have a role or a project in mind? Email is the fastest way to reach me.
        </p>
        <div className="join">
          <a href={`mailto:${profile.email}`} className="btn btn-primary join-item">
            <Mail className="size-4" /> {profile.email}
          </a>
          <button type="button" className="btn btn-primary btn-soft join-item" onClick={copy} aria-label="Copy email address">
            {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
          </button>
        </div>
        <span className="sr-only" aria-live="polite">{copied ? 'Email copied' : ''}</span>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <SocialLink href={profile.links.linkedin} label="LinkedIn" icon={<LinkedinIcon />} />
          <SocialLink href={profile.links.github} label="GitHub" icon={<GithubIcon />} />
          {profile.resumeUrl && (
            <a href={profile.resumeUrl} className="btn btn-ghost gap-2" download>
              <Download className="size-5" /> Resume
            </a>
          )}
        </div>
        <p className="text-base-content/60 mt-8 text-sm">References available on request.</p>
      </div>
    </section>
  )
}
