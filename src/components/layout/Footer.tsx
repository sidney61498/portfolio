import { profile } from '@/content/profile'

export function Footer() {
  return (
    <footer className="border-base-300 text-base-content/60 border-t py-8 text-center text-sm">
      <p>
        © {new Date().getFullYear()} {profile.name}. Built with React, Tailwind CSS and daisyUI.
      </p>
    </footer>
  )
}
