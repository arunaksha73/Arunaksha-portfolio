import React, { useState, useMemo } from 'react';
import { useGitHubData } from '../../hooks/useGitHubData';
import GitHubStats from './GitHubStats';
import ContributionGraph from './ContributionGraph';
import ActivityInsight from './ActivityInsight';
import RepositoryCard from './RepositoryCard';
import RepositoryFilters from './RepositoryFilters';
import GitHubCTA from './GitHubCTA';

/**
 * GitHubCommandCenter: Master React Component
 * Encapsulates the entire GitHub Command Center functionality with real data,
 * filters, streak metrics, heatmap, and live sync.
 */
export default function GitHubCommandCenter() {
  const { data, loading, refreshing, error, lastSyncText, refresh } = useGitHubData();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');

  // Extract unique languages from real repositories
  const availableLanguages = useMemo(() => {
    if (!data?.repositories) return [];
    const langs = new Set();
    data.repositories.forEach((repo) => {
      if (repo.language && repo.language !== 'Other') {
        langs.add(repo.language);
      }
    });
    return Array.from(langs);
  }, [data?.repositories]);

  // Filter repositories based on search and language selection
  const filteredRepos = useMemo(() => {
    if (!data?.repositories) return [];
    return data.repositories.filter((repo) => {
      const matchesSearch =
        searchQuery === '' ||
        repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (repo.description && repo.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (repo.language && repo.language.toLowerCase().includes(searchQuery.toLowerCase()));

      let matchesFilter = true;
      if (selectedFilter === 'Featured') {
        // Featured criteria: has stars, or recently updated non-fork
        matchesFilter = repo.stars > 0 || (!repo.isFork && repo.description);
      } else if (selectedFilter !== 'All') {
        matchesFilter = repo.language === selectedFilter;
      }

      return matchesSearch && matchesFilter;
    });
  }, [data?.repositories, searchQuery, selectedFilter]);

  return (
    <section className="reveal py-12 sm:py-20 border-t border-slate-200 dark:border-slate-800" id="github">
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl w-full max-w-6xl mx-auto p-4 sm:p-8
                      bg-white/60 dark:bg-[#070b14]/75
                      border border-slate-200/80 dark:border-slate-800/80
                      shadow-[0_12px_48px_rgba(34,197,94,0.06),inset_0_1px_0_rgba(255,255,255,0.9)]
                      dark:shadow-[0_12px_48px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.03)]
                      backdrop-blur-2xl">

        {/* Ambient Top Glow */}
        <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-emerald-500/[0.04] to-transparent pointer-events-none rounded-t-3xl" />
        <div className="absolute -top-10 -right-10 w-56 h-56 rounded-full bg-emerald-500/[0.08] blur-3xl pointer-events-none" />

        {/* ══ HEADER ROW ══ */}
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center flex-shrink-0
                            bg-gradient-to-br from-slate-800 to-slate-950 text-white
                            shadow-md border border-slate-700/50">
              <svg className="w-5 h-5 fill-white" viewBox="0 0 16 16">
                <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black tracking-tight text-slate-900 dark:text-white">
                  GitHub Command Center
                </h2>
                {data?.profile?.username && (
                  <span className="hidden sm:inline-block text-[11px] font-mono px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                    @{data.profile.username}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                An overview of my open-source activity, repositories, and development consistency.
              </p>
            </div>
          </div>

          {/* Right Status Controls */}
          <div className="flex items-center gap-2.5">
            {/* Live Indicator */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl
                            bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400
                            text-xs font-semibold tracking-wide">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span>LIVE</span>
              <span className="text-[11px] text-slate-400 dark:text-slate-400 font-normal pl-1 border-l border-emerald-500/20">
                {lastSyncText}
              </span>
            </div>

            {/* Manual Sync Button */}
            <button
              type="button"
              onClick={refresh}
              disabled={refreshing}
              title="Refresh GitHub Activity"
              className="p-1.5 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 text-slate-600 dark:text-slate-300 hover:text-emerald-500 dark:hover:text-emerald-400 hover:border-emerald-500/30 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              aria-label="Synchronize data from GitHub"
            >
              <span className={`material-symbols-outlined text-base block ${refreshing ? 'animate-spin text-emerald-500' : ''}`}>
                sync
              </span>
            </button>
          </div>
        </div>

        {/* ══ ERROR ALERT IF ANY ══ */}
        {error && (
          <div className="mb-6 p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-amber-500 text-base">warning</span>
              <span><strong>GitHub Sync:</strong> {error}. Showing last available data.</span>
            </div>
            <button
              onClick={refresh}
              className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-900 dark:text-amber-200 font-semibold transition"
            >
              Retry
            </button>
          </div>
        )}

        {/* ══ REAL STATS ══ */}
        <GitHubStats stats={data?.stats} loading={loading && !data} />

        {/* ══ REAL CONTRIBUTION HEATMAP ══ */}
        <ContributionGraph contributions={data?.contributions} loading={loading && !data} />

        {/* ══ DYNAMIC INSIGHT ══ */}
        <ActivityInsight insights={data?.insights} loading={loading && !data} />

        {/* ══ REPOSITORIES SECTION ══ */}
        <div className="mt-8">
          <div className="flex items-center justify-between gap-2 mb-4">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white tracking-tight">
                Public Repositories
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Directly synchronized from my GitHub profile
              </p>
            </div>
            {data?.repositories && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                {filteredRepos.length} {filteredRepos.length === 1 ? 'repo' : 'repos'}
              </span>
            )}
          </div>

          {/* Search & Filters */}
          <RepositoryFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedFilter={selectedFilter}
            onFilterChange={setSelectedFilter}
            availableLanguages={availableLanguages}
          />

          {/* Repositories Grid */}
          {loading && !data ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="p-5 rounded-2xl bg-white/70 dark:bg-[#0e131f]/75 border border-slate-200/80 dark:border-slate-800/90 animate-pulse h-36"
                >
                  <div className="h-4 w-32 bg-slate-200 dark:bg-slate-800 rounded mb-3"></div>
                  <div className="h-3 w-48 bg-slate-200 dark:bg-slate-800 rounded mb-2"></div>
                  <div className="h-3 w-40 bg-slate-200 dark:bg-slate-800 rounded"></div>
                </div>
              ))}
            </div>
          ) : filteredRepos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredRepos.slice(0, 6).map((repo) => (
                <RepositoryCard key={repo.id} repo={repo} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-dashed border-slate-200 dark:border-slate-800">
              <span className="material-symbols-outlined text-3xl text-slate-400 mb-1">search_off</span>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                No repositories matched "{searchQuery}"
              </p>
            </div>
          )}
        </div>

        {/* ══ GITHUB CTA ══ */}
        <GitHubCTA profileUrl={data?.profile?.profileUrl} username={data?.profile?.username} />
      </div>
    </section>
  );
}
