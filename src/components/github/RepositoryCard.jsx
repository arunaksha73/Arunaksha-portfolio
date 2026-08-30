import React from 'react';

/**
 * Maps programming languages to brand dot colors
 */
const LANGUAGE_COLORS = {
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Python: '#3572A5',
  Java: '#b07219',
  'C++': '#f34b7d',
  C: '#555555',
  Rust: '#dea584',
  Go: '#00ADD8',
  PHP: '#4F5D95',
  Shell: '#89e051',
  Vue: '#41b883',
  Ruby: '#701516',
  Other: '#8b949e',
};

/**
 * Format relative date (e.g., "Updated 2 days ago")
 */
function formatRelativeTime(dateStr) {
  if (!dateStr) return '';
  const now = Date.now();
  const past = new Date(dateStr).getTime();
  const diffSec = Math.floor((now - past) / 1000);

  if (diffSec < 60) return 'Updated just now';
  const mins = Math.floor(diffSec / 60);
  if (mins < 60) return `Updated ${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `Updated ${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `Updated ${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `Updated ${months}mo ago`;
  const years = Math.floor(months / 12);
  return `Updated ${years}y ago`;
}

/**
 * RepositoryCard component displaying real repository data
 */
export default function RepositoryCard({ repo }) {
  const langColor = LANGUAGE_COLORS[repo.language] || LANGUAGE_COLORS.Other;

  return (
    <a
      href={repo.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex flex-col justify-between p-4 sm:p-5 rounded-2xl
                 bg-white/80 dark:bg-[#0e131f]/75
                 border border-slate-200/80 dark:border-slate-800/90
                 shadow-sm hover:shadow-xl dark:hover:shadow-2xl dark:hover:shadow-emerald-950/20
                 hover:border-emerald-500/40 dark:hover:border-emerald-500/30
                 hover:-translate-y-1 transition-all duration-300 backdrop-blur-md"
    >
      {/* Top Header */}
      <div>
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="material-symbols-outlined text-slate-400 dark:text-slate-500 text-lg group-hover:text-emerald-500 transition-colors shrink-0">
              book
            </span>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
              {repo.name}
            </h4>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {repo.isFork && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700">
                Fork
              </span>
            )}
            <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 capitalize">
              {repo.visibility}
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-4">
          {repo.description || 'No description available for this repository.'}
        </p>
      </div>

      {/* Footer Meta */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800/60 text-[11px] text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-3">
          {/* Language */}
          {repo.language && (
            <div className="flex items-center gap-1.5">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: langColor }}
              />
              <span className="font-medium text-slate-700 dark:text-slate-300">
                {repo.language}
              </span>
            </div>
          )}

          {/* Stars */}
          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[13px] text-amber-500">star</span>
            <span>{repo.stars}</span>
          </div>

          {/* Forks */}
          {repo.forks > 0 && (
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[13px] text-slate-400">fork_right</span>
              <span>{repo.forks}</span>
            </div>
          )}
        </div>

        {/* Updated timestamp + arrow */}
        <div className="flex items-center gap-1 text-[10px] text-slate-400 group-hover:text-emerald-500 transition-colors">
          <span>{formatRelativeTime(repo.pushedAt || repo.updatedAt)}</span>
          <span className="material-symbols-outlined text-xs transform group-hover:translate-x-0.5 transition-transform">
            arrow_forward
          </span>
        </div>
      </div>
    </a>
  );
}
