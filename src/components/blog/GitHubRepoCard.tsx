import { FiGithub, FiExternalLink } from "react-icons/fi"

interface GitHubRepoCardProps {
  owner: string
  repo: string
  href: string
}

export function GitHubRepoCard({ owner, repo, href }: GitHubRepoCardProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group block no-underline my-6"
    >
      <div className="flex items-center gap-4 p-5 rounded-xl border border-slate-200 dark:border-slate-700 bg-gradient-to-r from-slate-50 to-white dark:from-slate-800/60 dark:to-slate-800/30 hover:border-brand-400 dark:hover:border-brand-500 hover:shadow-lg hover:shadow-brand-500/10 transition-all duration-300">
        <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-slate-900 dark:bg-white/10 flex items-center justify-center">
          <FiGithub className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-500 dark:text-slate-400">{owner}</span>
            <span className="text-slate-300 dark:text-slate-600">/</span>
            <span className="text-base font-semibold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
              {repo}
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5 truncate">
            github.com/{owner}/{repo}
          </p>
        </div>
        <FiExternalLink className="w-5 h-5 text-slate-400 dark:text-slate-500 group-hover:text-brand-500 transition-colors flex-shrink-0" />
      </div>
    </a>
  )
}
