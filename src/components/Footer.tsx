import { ArrowUpRight } from 'lucide-react'

const links = [
  { label: 'GITHUB', href: 'https://github.com/Joojinsung1017' },
  { label: 'EMAIL', href: 'mailto:contact@example.com' },
] as const

export function Footer() {
  return (
    <footer className="border-t border-border bg-bg pt-16 pb-12">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="font-serif text-[clamp(2rem,4vw,3rem)] leading-[1.1] text-text-primary mb-6">
              Let's build something<br/>meaningful.
            </h2>
            <p className="text-[15px] text-text-secondary max-w-md leading-relaxed">
              Open to new opportunities, technical writing collaborations, and backend engineering discussions.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-6">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 border-b border-transparent pb-1 text-[12px] font-semibold tracking-[0.15em] text-text-primary transition-colors hover:border-text-primary"
              >
                {link.label}
                <ArrowUpRight className="h-3 w-3 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            ))}
          </div>
        </div>
        
        <div className="mt-20 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[12px] font-semibold tracking-[0.1em] text-text-muted">
            &copy; {new Date().getFullYear()} JINSUNG JOO.
          </p>
          <div className="text-[12px] font-semibold tracking-[0.1em] text-text-muted uppercase">
            Seoul, South Korea
          </div>
        </div>
      </div>
    </footer>
  )
}
