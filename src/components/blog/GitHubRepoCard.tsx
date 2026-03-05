import { FiGithub, FiExternalLink } from "react-icons/fi"

interface Props {
  owner: string
  repo: string
  href: string
}

export function GitHubRepoCard({ owner, repo, href }: Props) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="group block no-underline my-6">
      <div className="flex items-center gap-4 p-5 rounded-xl glass-panel transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover">
        <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-anime-dark border border-anime-gold/20 flex items-center justify-center">
          <FiGithub className="w-6 h-6 text-anime-gold" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">{owner}</span>
            <span className="text-muted-foreground/30">/</span>
            <span className="text-base font-semibold text-foreground group-hover:text-anime-gold transition-colors">{repo}</span>
          </div>
          <p className="text-sm text-muted-foreground mt-0.5 truncate">github.com/{owner}/{repo}</p>
        </div>
        <FiExternalLink className="w-5 h-5 text-muted-foreground group-hover:text-anime-gold transition-colors flex-shrink-0" />
      </div>
    </a>
  )
}
