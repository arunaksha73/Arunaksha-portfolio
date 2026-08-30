import React from 'react';

/**
 * GitHubStats component displaying real computed statistics:
 * Total Contributions, Current Streak, Longest Streak, Public Repos, Followers
 */
export default function GitHubStats({ stats, loading }) {
  const statItems = [
    {
      label: 'Total Contributions',
      value: stats?.totalContributions?.toLocaleString() ?? 0,
      icon: 'insights',
      accent: 'text-emerald-500 dark:text-emerald-400',
      badge: '12 Months',
      subtext: 'Across all public repositories',
    },
    {
      label: 'Current Streak',
      value: `${stats?.currentStreak ?? 0} ${stats?.currentStreak === 1 ? 'day' : 'days'}`,
      icon: 'local_fire_department',
      accent: 'text-amber-500 dark:text-amber-400',
      badge: stats?.currentStreak > 0 ? 'Active' : 'Resting',
      subtext: 'Consecutive commit days',
    },
    {
      label: 'Longest Streak',
      value: `${stats?.longestStreak ?? 0} ${stats?.longestStreak === 1 ? 'day' : 'days'}`,
      icon: 'workspace_premium',
      accent: 'text-sky-500 dark:text-sky-400',
      badge: 'Best',
      subtext: 'Peak historical consistency',
    },
    {
      label: 'Public Repositories',
      value: stats?.publicRepos?.toLocaleString() ?? 0,
      icon: 'folder_open',
      accent: 'text-purple-500 dark:text-purple-400',
      badge: 'Verified',
      subtext: 'Open-source projects',
    },
    {
      label: 'Followers',
      value: stats?.followers?.toLocaleString() ?? 0,
      icon: 'group',
      accent: 'text-blue-500 dark:text-blue-400',
      badge: 'Network',
      subtext: 'Community connections',
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-6">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="p-4 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 animate-pulse"
          >
            <div className="h-4 w-20 bg-slate-200 dark:bg-slate-800 rounded mb-3"></div>
            <div className="h-7 w-16 bg-slate-200 dark:bg-slate-800 rounded mb-2"></div>
            <div className="h-3 w-28 bg-slate-200 dark:bg-slate-800 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-6">
      {statItems.map((item, idx) => (
        <div
          key={idx}
          className="group relative overflow-hidden p-3.5 sm:p-4 rounded-2xl
                     bg-white/80 dark:bg-[#0e131f]/75
                     border border-slate-200/80 dark:border-slate-800/90
                     shadow-sm hover:shadow-md dark:shadow-none
                     hover:border-emerald-500/40 dark:hover:border-emerald-500/30
                     hover:-translate-y-0.5 transition-all duration-300 backdrop-blur-md"
        >
          {/* Subtle hover gradient glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/[0.04] to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] sm:text-xs font-semibold tracking-tight text-slate-500 dark:text-slate-400">
                {item.label}
              </span>
              <span className={`material-symbols-outlined text-base ${item.accent}`}>
                {item.icon}
              </span>
            </div>

            <div className="flex items-baseline gap-1.5 mb-1">
              <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                {item.value}
              </span>
            </div>

            <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate">
              {item.subtext}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
