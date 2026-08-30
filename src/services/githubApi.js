/**
 * GitHub API Service Layer
 * Fetches real profile, repository, and contribution data directly from GitHub.
 * Handles streak calculations, statistical insights, and fallback mechanisms.
 */

export const GITHUB_CONFIG = {
  getUsername: () => {
    if (typeof window !== 'undefined') {
      return (
        window.VITE_GITHUB_USERNAME ||
        window.GITHUB_USERNAME ||
        (window.__ENV__ && window.__ENV__.VITE_GITHUB_USERNAME) ||
        'arunaksha73'
      );
    }
    return 'arunaksha73';
  },
  CACHE_TTL_MS: 15 * 60 * 1000, // 15 minutes cache
  CACHE_KEY_PREFIX: 'github_command_center_',
};

/**
 * Calculates current streak, longest streak, and total contributions from a 365-day array.
 * @param {Array<{date: string, count: number, level: number}>} contributions
 */
export function calculateContributionStats(contributions = []) {
  if (!contributions || contributions.length === 0) {
    return {
      totalContributions: 0,
      currentStreak: 0,
      longestStreak: 0,
      insights: null,
    };
  }

  let total = 0;
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;

  // Tally totals and calculate longest streak
  for (let i = 0; i < contributions.length; i++) {
    const day = contributions[i];
    total += day.count || 0;

    if (day.count > 0) {
      tempStreak++;
      if (tempStreak > longestStreak) {
        longestStreak = tempStreak;
      }
    } else {
      tempStreak = 0;
    }
  }

  // Calculate current streak counting backwards from today or yesterday
  // (In case user hasn't committed yet today)
  const today = new Date().toISOString().split('T')[0];
  let startIndex = contributions.length - 1;

  // Find the day corresponding to today or most recent
  if (startIndex >= 0) {
    const lastDay = contributions[startIndex];
    // If today has 0, but yesterday had >0, streak is still active from yesterday
    if (lastDay.count === 0 && lastDay.date === today) {
      startIndex--;
    }

    while (startIndex >= 0 && contributions[startIndex].count > 0) {
      currentStreak++;
      startIndex--;
    }
  }

  // Generate dynamic statistical insights
  const weekdayTotals = [0, 0, 0, 0, 0, 0, 0]; // 0 = Sun, 1 = Mon ...
  const monthTotals = {};
  const weekdayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  let last30DaysCount = 0;
  let prev30DaysCount = 0;
  const len = contributions.length;

  for (let i = 0; i < len; i++) {
    const day = contributions[i];
    const dateObj = new Date(day.date + 'T00:00:00Z');
    const dayOfWeek = dateObj.getUTCDay();
    const monthKey = dateObj.getUTCMonth();

    weekdayTotals[dayOfWeek] += day.count;
    monthTotals[monthKey] = (monthTotals[monthKey] || 0) + day.count;

    // Track 30-day windows for trend
    if (i >= len - 30) {
      last30DaysCount += day.count;
    } else if (i >= len - 60) {
      prev30DaysCount += day.count;
    }
  }

  // Find most active weekday
  let maxWeekdayIndex = 0;
  let maxWeekdayCount = 0;
  weekdayTotals.forEach((count, idx) => {
    if (count > maxWeekdayCount) {
      maxWeekdayCount = count;
      maxWeekdayIndex = idx;
    }
  });

  const totalWeekdayCommits = weekdayTotals.slice(1, 6).reduce((a, b) => a + b, 0);
  const weekdayPercentage = total > 0 ? Math.round((totalWeekdayCommits / total) * 100) : 0;
  const topDayPercentage = total > 0 ? Math.round((maxWeekdayCount / total) * 100) : 0;

  // 30-day activity trend calculation
  let trendPercentage = null;
  let trendText = 'Not enough historical data to calculate a trend.';
  if (prev30DaysCount > 0) {
    const delta = ((last30DaysCount - prev30DaysCount) / prev30DaysCount) * 100;
    trendPercentage = Math.round(delta);
    trendText = `${trendPercentage >= 0 ? '+' : ''}${trendPercentage}% vs previous 30 days`;
  } else if (last30DaysCount > 0) {
    trendText = `${last30DaysCount} contributions in the last 30 days`;
  }

  const insights = {
    mostActiveWeekday: weekdayNames[maxWeekdayIndex],
    topDayPercentage,
    weekdayPercentage,
    last30DaysCount,
    prev30DaysCount,
    trendPercentage,
    trendText,
    summary:
      total > 0
        ? `Most active on ${weekdayNames[maxWeekdayIndex]}s, with ${weekdayPercentage}% of all contributions occurring during weekdays.`
        : 'GitHub activity is dynamically tracked and visualized below.',
  };

  return {
    totalContributions: total,
    currentStreak,
    longestStreak,
    insights,
  };
}

/**
 * Fetch GitHub User Profile
 */
export async function fetchGitHubProfile(username) {
  const res = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}`, {
    headers: { Accept: 'application/vnd.github.v3+json' },
  });
  if (!res.ok) {
    throw new Error(`GitHub Profile API error: ${res.status} ${res.statusText}`);
  }
  const data = await res.json();
  return {
    username: data.login,
    name: data.name || data.login,
    avatarUrl: data.avatar_url,
    profileUrl: data.html_url,
    bio: data.bio || '',
    publicRepos: data.public_repos || 0,
    followers: data.followers || 0,
    following: data.following || 0,
    location: data.location || '',
    createdAt: data.created_at,
  };
}

/**
 * Fetch GitHub Repositories (Public, sorted by updated)
 */
export async function fetchGitHubRepositories(username) {
  const res = await fetch(
    `https://api.github.com/users/${encodeURIComponent(username)}/repos?sort=updated&per_page=100`,
    {
      headers: { Accept: 'application/vnd.github.v3+json' },
    }
  );
  if (!res.ok) {
    throw new Error(`GitHub Repos API error: ${res.status} ${res.statusText}`);
  }
  const rawRepos = await res.json();
  if (!Array.isArray(rawRepos)) return [];

  // Filter out forks if preferred, or keep all real public repos and sort thoughtfully
  const repos = rawRepos
    .map(repo => ({
      id: repo.id,
      name: repo.name,
      fullName: repo.full_name,
      description: repo.description || 'No description provided.',
      url: repo.html_url,
      homepage: repo.homepage,
      language: repo.language || 'Other',
      stars: repo.stargazers_count || 0,
      forks: repo.forks_count || 0,
      isFork: repo.fork,
      isArchived: repo.archived,
      updatedAt: repo.updated_at,
      pushedAt: repo.pushed_at,
      visibility: repo.visibility || 'public',
      topics: repo.topics || [],
    }))
    .sort((a, b) => {
      // Prioritize non-forks with stars/recent activity
      if (a.isFork !== b.isFork) return a.isFork ? 1 : -1;
      if (b.stars !== a.stars) return b.stars - a.stars;
      return new Date(b.pushedAt).getTime() - new Date(a.pushedAt).getTime();
    });

  return repos;
}

/**
 * Fetch Real Contribution Heatmap Data
 * Uses high-reliability public contributions API with fallback.
 */
export async function fetchGitHubContributions(username) {
  try {
    const res = await fetch(`https://github-contributions-api.jogruber.de/v4/${encodeURIComponent(username)}?y=last`);
    if (!res.ok) throw new Error(`Contributions API error: ${res.status}`);
    const data = await res.json();
    if (data && Array.isArray(data.contributions)) {
      return data.contributions;
    }
  } catch (err) {
    console.warn('Primary contributions endpoint failed, attempting fallback...', err);
  }

  // Fallback to vercel contributions mirror if needed
  try {
    const res2 = await fetch(`https://github-contributions.vercel.app/api/v1/${encodeURIComponent(username)}`);
    if (res2.ok) {
      const data2 = await res2.json();
      if (data2 && Array.isArray(data2.contributions)) {
        return data2.contributions;
      }
    }
  } catch (err2) {
    console.warn('Fallback contributions endpoint failed:', err2);
  }

  throw new Error('Unable to retrieve GitHub contribution heatmap.');
}

/**
 * Master function to fetch all GitHub Command Center data with local caching
 */
export async function fetchFullGitHubData(forced = false) {
  const username = GITHUB_CONFIG.getUsername();
  const cacheKey = `${GITHUB_CONFIG.CACHE_KEY_PREFIX}${username}`;

  // Check localStorage cache if not forced
  if (!forced && typeof window !== 'undefined' && window.localStorage) {
    try {
      const cachedStr = localStorage.getItem(cacheKey);
      if (cachedStr) {
        const cached = JSON.parse(cachedStr);
        const age = Date.now() - (cached.timestamp || 0);
        if (age < GITHUB_CONFIG.CACHE_TTL_MS && cached.data) {
          return {
            ...cached.data,
            isCached: true,
            syncedAt: cached.timestamp,
          };
        }
      }
    } catch (e) {
      console.warn('Cache read error:', e);
    }
  }

  // Fetch in parallel
  const [profileRes, reposRes, contributionsRes] = await Promise.allSettled([
    fetchGitHubProfile(username),
    fetchGitHubRepositories(username),
    fetchGitHubContributions(username),
  ]);

  const profile = profileRes.status === 'fulfilled' ? profileRes.value : null;
  const repos = reposRes.status === 'fulfilled' ? reposRes.value : [];
  const contributions = contributionsRes.status === 'fulfilled' ? contributionsRes.value : [];

  if (!profile && repos.length === 0 && contributions.length === 0) {
    throw new Error('Failed to load GitHub data. Please check connection.');
  }

  const calculatedStats = calculateContributionStats(contributions);

  const fullData = {
    username,
    profile: profile || {
      username,
      name: username,
      avatarUrl: `https://github.com/${username}.png`,
      profileUrl: `https://github.com/${username}`,
      publicRepos: repos.length,
      followers: 0,
      following: 0,
      bio: '',
    },
    repositories: repos,
    contributions,
    stats: {
      totalContributions: calculatedStats.totalContributions,
      currentStreak: calculatedStats.currentStreak,
      longestStreak: calculatedStats.longestStreak,
      publicRepos: profile?.publicRepos ?? repos.length,
      followers: profile?.followers ?? 0,
    },
    insights: calculatedStats.insights,
    syncedAt: Date.now(),
    isCached: false,
  };

  // Save to cache
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      localStorage.setItem(
        cacheKey,
        JSON.stringify({
          timestamp: Date.now(),
          data: fullData,
        })
      );
    } catch (e) {
      console.warn('Cache write error:', e);
    }
  }

  return fullData;
}
