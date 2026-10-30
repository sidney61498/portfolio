import { Link } from 'react-router'

export function NotFoundPage() {
  return (
    <div className="mx-auto grid min-h-[60vh] max-w-xl place-items-center px-4 text-center">
      <div>
        <p className="text-primary font-display text-6xl font-bold">404</p>
        <h1 className="mt-4 text-2xl font-bold">This page doesn’t exist</h1>
        <p className="text-base-content/70 mt-2">The link may be old or mistyped.</p>
        <Link to="/" className="btn btn-primary mt-6">
          Back to home
        </Link>
      </div>
    </div>
  )
}
