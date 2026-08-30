import React from 'react';

/**
 * RepositoryFilters component
 * Provides instant search input and language filter pill selectors.
 */
export default function RepositoryFilters({
  searchQuery,
  onSearchChange,
  selectedFilter,
  onFilterChange,
  availableLanguages = [],
}) {
  const filterOptions = ['All', 'Featured', ...availableLanguages];

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-4">
      {/* Search Input */}
      <div className="relative flex-1 max-w-sm">
        <span className="material-symbols-outlined absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 text-base pointer-events-none">
          search
        </span>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search repositories..."
          className="w-full pl-9 pr-8 py-2 text-xs rounded-xl
                     bg-white/80 dark:bg-slate-900/80
                     border border-slate-200/80 dark:border-slate-800/80
                     text-slate-900 dark:text-white placeholder-slate-400
                     focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500
                     transition-all"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            className="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs"
          >
            ✕
          </button>
        )}
      </div>

      {/* Language / Category Pill Filters */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
        {filterOptions.map((filter) => {
          const isActive = selectedFilter === filter;
          return (
            <button
              key={filter}
              type="button"
              onClick={() => onFilterChange(filter)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                isActive
                  ? 'bg-slate-900 text-white dark:bg-emerald-500 dark:text-slate-950 shadow-sm shadow-emerald-500/20'
                  : 'bg-white/70 dark:bg-slate-900/60 text-slate-600 dark:text-slate-400 border border-slate-200/60 dark:border-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              {filter}
            </button>
          );
        })}
      </div>
    </div>
  );
}
