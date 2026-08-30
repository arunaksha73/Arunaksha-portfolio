import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchFullGitHubData } from '../services/githubApi';

/**
 * Custom React hook for live GitHub Data management
 * Supports automatic initial fetch, smart background revalidation,
 * window visibility change listeners, manual sync, and relative time formatting.
 */
export function useGitHubData() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [lastSyncText, setLastSyncText] = useState('Checking...');

  const lastSyncTimestampRef = useRef(null);

  const loadData = useCallback(async (forced = false) => {
    try {
      if (forced) {
        setRefreshing(true);
      } else if (!data) {
        setLoading(true);
      }
      setError(null);

      const result = await fetchFullGitHubData(forced);
      setData(result);
      lastSyncTimestampRef.current = result.syncedAt || Date.now();
    } catch (err) {
      console.error('Failed to load GitHub Command Center data:', err);
      setError(err.message || 'Unable to sync with GitHub');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [data]);

  // Initial load
  useEffect(() => {
    loadData(false);
  }, []);

  // Window visibility listener to refresh when tab becomes active
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        const now = Date.now();
        // If last sync was more than 10 minutes ago, revalidate silently
        if (!lastSyncTimestampRef.current || now - lastSyncTimestampRef.current > 10 * 60 * 1000) {
          loadData(true);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [loadData]);

  // Relative time updater for "Synced X min ago"
  useEffect(() => {
    const updateTime = () => {
      if (refreshing) {
        setLastSyncText('Syncing...');
        return;
      }
      if (!lastSyncTimestampRef.current) {
        setLastSyncText('Syncing with GitHub');
        return;
      }
      const diffSec = Math.floor((Date.now() - lastSyncTimestampRef.current) / 1000);
      if (diffSec < 15) {
        setLastSyncText('Synced just now');
      } else if (diffSec < 60) {
        setLastSyncText(`Synced ${diffSec}s ago`);
      } else {
        const mins = Math.floor(diffSec / 60);
        setLastSyncText(`Synced ${mins} min${mins > 1 ? 's' : ''} ago`);
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, [refreshing, data]);

  const handleManualRefresh = () => {
    if (!refreshing) {
      loadData(true);
    }
  };

  return {
    data,
    loading,
    refreshing,
    error,
    lastSyncText,
    refresh: handleManualRefresh,
  };
}
