import React from 'react';

/**
 * GitHubCTA component
 * Clean developer call-to-action linking to the user's real GitHub profile.
 */
export default function GitHubCTA({ profileUrl, username }) {
  const url = profileUrl || `https://github.com/${username || 'arunaksha73'}`;

  return (
    <div className="mt-8 pt-6 border-t border-slate-200/80 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="text-center sm:text-left">
        <h4 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
          Explore my GitHub
        </h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          See what I'm building, contributing to, and experimenting with.
        </p>
      </div>

      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative inline-flex items-center gap-2.5 px-6 py-2.5 rounded-xl overflow-hidden
                   bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-semibold text-xs
                   shadow-sm hover:shadow-lg hover:shadow-emerald-500/10
                   hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
      >
        <svg className="w-4 h-4 fill-current" viewBox="0 0 16 16">
          <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z" />
        </svg>
        <span>View GitHub Profile</span>
        <span className="material-symbols-outlined text-sm transform group-hover:translate-x-1 transition-transform">
          arrow_forward
        </span>
      </a>
    </div>
  );
}
