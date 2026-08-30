import React, { useState, useRef, useEffect } from 'react';

/**
 * ContributionGraph component displaying the real 52-week GitHub contribution heatmap.
 * Color intensity scales dynamically based on contribution count:
 * Level 0: 0 commits
 * Level 1: 1-2 commits
 * Level 2: 3-5 commits
 * Level 3: 6-9 commits
 * Level 4: 10+ commits
 */
export default function ContributionGraph({ contributions = [], loading }) {
  const [tooltip, setTooltip] = useState(null);
  const containerRef = useRef(null);

  // Group contributions into 7-day columns (weeks)
  const weeks = [];
  if (contributions && contributions.length > 0) {
    let currentWeek = [];
    contributions.forEach((day, index) => {
      currentWeek.push(day);
      if (currentWeek.length === 7 || index === contributions.length - 1) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    });
  }

  // Scroll to recent activity on mount
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollLeft = containerRef.current.scrollWidth;
    }
  }, [contributions]);

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthHeaders = [];
  let lastMonth = -1;

  weeks.forEach((week, weekIndex) => {
    if (week[0]) {
      const d = new Date(week[0].date + 'T00:00:00Z');
      const m = d.getUTCMonth();
      if (m !== lastMonth) {
        monthHeaders.push({
          month: monthNames[m],
          weekIndex,
        });
        lastMonth = m;
      }
    }
  });

  const getCellColor = (count, level) => {
    if (!count || count === 0) {
      return 'bg-slate-100 dark:bg-slate-800/80 border-slate-200/40 dark:border-slate-800/60';
    }
    if (count <= 2 || level === 1) {
      return 'bg-[#9be9a8] dark:bg-[#0e4429] border-[#7bc96f]/40 dark:border-[#006d32]/40';
    }
    if (count <= 5 || level === 2) {
      return 'bg-[#40c463] dark:bg-[#006d32] border-[#30a14e]/40 dark:border-[#26a641]/40';
    }
    if (count <= 9 || level === 3) {
      return 'bg-[#30a14e] dark:bg-[#26a641] border-[#216e39]/40 dark:border-[#39d353]/40';
    }
    return 'bg-[#216e39] dark:bg-[#39d353] border-emerald-600 dark:border-emerald-300';
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr + 'T00:00:00Z');
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      timeZone: 'UTC',
    });
  };

  if (loading) {
    return (
      <div className="w-full p-6 rounded-2xl bg-white/70 dark:bg-[#0e131f]/75 border border-slate-200/80 dark:border-slate-800/90 animate-pulse">
        <div className="h-4 w-40 bg-slate-200 dark:bg-slate-800 rounded mb-4"></div>
        <div className="h-28 w-full bg-slate-200/60 dark:bg-slate-800/60 rounded"></div>
      </div>
    );
  }

  return (
    <div className="relative w-full rounded-2xl bg-white/80 dark:bg-[#0e131f]/75 border border-slate-200/80 dark:border-slate-800/90 p-4 sm:p-5 shadow-sm backdrop-blur-md">
      {/* Header info */}
      <div className="flex items-center justify-between gap-2 mb-3 pb-2 border-b border-slate-100 dark:border-slate-800/60">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-emerald-500 text-lg">calendar_month</span>
          <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 tracking-tight">
            Contribution Heatmap
          </span>
          <span className="text-[10px] text-slate-400 dark:text-slate-500 hidden sm:inline">
            (Last 12 Months)
          </span>
        </div>

        {/* Heatmap Legend */}
        <div className="flex items-center gap-1.5 text-[10px] text-slate-500 dark:text-slate-400">
          <span>Less</span>
          <span className="w-2.5 h-2.5 rounded-sm bg-slate-100 dark:bg-slate-800/80 border border-slate-200/40 dark:border-slate-800/60"></span>
          <span className="w-2.5 h-2.5 rounded-sm bg-[#9be9a8] dark:bg-[#0e4429]"></span>
          <span className="w-2.5 h-2.5 rounded-sm bg-[#40c463] dark:bg-[#006d32]"></span>
          <span className="w-2.5 h-2.5 rounded-sm bg-[#30a14e] dark:bg-[#26a641]"></span>
          <span className="w-2.5 h-2.5 rounded-sm bg-[#216e39] dark:bg-[#39d353]"></span>
          <span>More</span>
        </div>
      </div>

      {/* Heatmap Grid with horizontal scroll */}
      <div
        ref={containerRef}
        className="w-full overflow-x-auto overflow-y-hidden pb-2 pt-1 select-none focus:outline-none"
        tabIndex={0}
        aria-label="GitHub Contributions Heatmap"
      >
        <div className="inline-block min-w-[700px] sm:min-w-full">
          {/* Month labels row */}
          <div className="relative h-4 mb-1.5 ml-7 text-[10px] font-medium text-slate-400 dark:text-slate-500">
            {monthHeaders.map((header, idx) => (
              <span
                key={idx}
                className="absolute transform -translate-x-1/2"
                style={{ left: `${header.weekIndex * 13}px` }}
              >
                {header.month}
              </span>
            ))}
          </div>

          <div className="flex gap-1.5 items-start">
            {/* Weekday labels */}
            <div className="flex flex-col justify-between h-[86px] pr-1.5 text-[9px] font-medium text-slate-400 dark:text-slate-500 shrink-0">
              <span className="h-[10px] leading-[10px]">Sun</span>
              <span className="h-[10px] leading-[10px]">Tue</span>
              <span className="h-[10px] leading-[10px]">Thu</span>
              <span className="h-[10px] leading-[10px]">Sat</span>
            </div>

            {/* Weeks columns */}
            <div className="flex gap-[3px]">
              {weeks.map((week, wIdx) => (
                <div key={wIdx} className="flex flex-col gap-[3px]">
                  {week.map((day, dIdx) => {
                    const colorClass = getCellColor(day.count, day.level);
                    return (
                      <button
                        key={`${wIdx}-${dIdx}`}
                        type="button"
                        className={`w-[10px] h-[10px] rounded-[2px] border transition-transform duration-100 hover:scale-125 hover:z-20 focus:scale-125 focus:ring-1 focus:ring-emerald-400 focus:outline-none cursor-pointer ${colorClass}`}
                        onMouseEnter={(e) => {
                          const rect = e.currentTarget.getBoundingClientRect();
                          setTooltip({
                            date: day.date,
                            count: day.count,
                            x: rect.left + rect.width / 2,
                            y: rect.top - 8,
                          });
                        }}
                        onMouseLeave={() => setTooltip(null)}
                        onFocus={(e) => {
                          const rect = e.currentTarget.getBoundingClientRect();
                          setTooltip({
                            date: day.date,
                            count: day.count,
                            x: rect.left + rect.width / 2,
                            y: rect.top - 8,
                          });
                        }}
                        onBlur={() => setTooltip(null)}
                        aria-label={`${day.count} contributions on ${formatDate(day.date)}`}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Tooltip */}
      {tooltip && (
        <div
          className="fixed z-50 px-2.5 py-1.5 text-xs rounded-lg shadow-xl font-medium pointer-events-none transform -translate-x-1/2 -translate-y-full
                     bg-slate-900 text-white dark:bg-slate-800 dark:text-slate-100 border border-slate-700/80 backdrop-blur-md transition-opacity duration-150 animate-fade-up"
          style={{ left: `${tooltip.x}px`, top: `${tooltip.y}px` }}
        >
          <div className="font-bold text-emerald-400">
            {tooltip.count} {tooltip.count === 1 ? 'contribution' : 'contributions'}
          </div>
          <div className="text-[10px] text-slate-300">
            {formatDate(tooltip.date)}
          </div>
        </div>
      )}
    </div>
  );
}
