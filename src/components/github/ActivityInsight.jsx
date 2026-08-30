import React from 'react';

/**
 * ActivityInsight component
 * Displays calculated metrics: most active day of week, weekday %, 30-day activity delta.
 * Never displays fabricated or hardcoded claims.
 */
export default function ActivityInsight({ insights, loading }) {
  if (loading) {
    return (
      <div className="w-full p-4 rounded-2xl bg-white/70 dark:bg-[#0e131f]/75 border border-slate-200/80 dark:border-slate-800/90 animate-pulse my-6">
        <div className="h-4 w-32 bg-slate-200 dark:bg-slate-800 rounded mb-2"></div>
        <div className="h-4 w-3/4 bg-slate-200 dark:bg-slate-800 rounded"></div>
      </div>
    );
  }

  if (!insights) return null;

  return (
    <div className="w-full my-6 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-500/[0.06] via-transparent to-primary/[0.04] dark:from-emerald-500/[0.08] dark:to-primary/[0.05] border border-emerald-500/20 dark:border-emerald-500/20 shadow-sm backdrop-blur-md">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 dark:bg-emerald-400/10 border border-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5">
            <span className="material-symbols-outlined text-emerald-600 dark:text-emerald-400 text-lg">
              psychology
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white tracking-tight uppercase">
                Development Insight
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                Calculated
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              {insights.summary}
            </p>
          </div>
        </div>

        {/* 30-Day Trend Indicator */}
        <div className="shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80">
          <span className="material-symbols-outlined text-base text-emerald-500">
            {insights.trendPercentage !== null && insights.trendPercentage < 0
              ? 'trending_down'
              : 'trending_up'}
          </span>
          <div className="text-right">
            <div className="text-[11px] font-bold text-slate-900 dark:text-white">
              {insights.trendText}
            </div>
            <div className="text-[9px] text-slate-400 dark:text-slate-500">
              Activity momentum
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
