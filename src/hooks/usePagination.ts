import { useState, useCallback } from 'react';
import { APP_CONFIG } from '@/src/constants';

interface UsePaginationOptions {
  limit?: number;
  initialPage?: number;
}

interface UsePaginationResult<T> {
  data: T[];
  page: number;
  limit: number;
  loading: boolean;
  hasNextPage: boolean;
  totalCount: number;
  loadNextPage: () => Promise<void>;
  refresh: () => Promise<void>;
  reset: () => void;
}

export const usePagination = <T>(
  fetchFn: (page: number, limit: number) => Promise<{ data: T[]; totalCount: number }>,
  options: UsePaginationOptions = {}
): UsePaginationResult<T> => {
  const { limit = APP_CONFIG.PAGINATION_LIMIT, initialPage = 1 } = options;
  
  const [data, setData] = useState<T[]>([]);
  const [page, setPage] = useState(initialPage);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  const hasNextPage = data.length < totalCount;

  const fetchData = useCallback(async (pageNum: number, append = false) => {
    try {
      setLoading(true);
      const result = await fetchFn(pageNum, limit);
      
      setData(prev => append ? [...prev, ...result.data] : result.data);
      setTotalCount(result.totalCount);
      
      if (!append) {
        setPage(pageNum);
      }
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  }, [fetchFn, limit]);

  const loadNextPage = useCallback(async () => {
    if (!hasNextPage || loading) return;
    
    const nextPage = page + 1;
    await fetchData(nextPage, true);
    setPage(nextPage);
  }, [page, hasNextPage, loading, fetchData]);

  const refresh = useCallback(async () => {
    await fetchData(initialPage, false);
  }, [fetchData, initialPage]);

  const reset = useCallback(() => {
    setData([]);
    setPage(initialPage);
    setTotalCount(0);
    setLoading(false);
  }, [initialPage]);

  return {
    data,
    page,
    limit,
    loading,
    hasNextPage,
    totalCount,
    loadNextPage,
    refresh,
    reset,
  };
};