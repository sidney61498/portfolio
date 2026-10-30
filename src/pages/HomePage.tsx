import { useEffect } from 'react'
import { useLocation } from 'react-router'
import { About } from '@/components/home/About'
import { Contact } from '@/components/home/Contact'
import { DemoShowcase } from '@/components/home/DemoShowcase'
import { Experience } from '@/components/home/Experience'
import { Hero } from '@/components/home/Hero'
import { Skills } from '@/components/home/Skills'
import { WorkGrid } from '@/components/home/WorkGrid'

export function HomePage() {
  const { hash } = useLocation()

  // Router links to "/#work" etc. don't scroll by themselves; do it once the section exists.
  useEffect(() => {
    if (!hash) return
    document.getElementById(hash.slice(1))?.scrollIntoView()
  }, [hash])

  useEffect(() => {
    document.title = 'Sidney Medrano | Senior Software Engineer (Laravel, React)'
  }, [])

  return (
    <>
      <Hero />
      <About />
      <Skills />
      <WorkGrid />
      <DemoShowcase />
      <Experience />
      <Contact />
    </>
  )
}
