import { useState, useEffect, useCallback } from 'react';
import { leadService } from '../services/leadService';
import type { Lead, PaginationMeta } from '../types';
import { useFilter } from './useFilter';
import { useDebounce } from './useDebounce';

export function useLeads() {
  const { filters } = useFilter();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationMeta | undefined>(undefined);

  // Debounce the search term by 400ms to throttle keystroke queries
  const debouncedSearch = useDebounce(filters.search, 400);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await leadService.getLeads({
        ...filters,
        search: debouncedSearch,
      });

      if (response.success) {
        setLeads(response.data);
        setPagination(response.meta?.pagination);
      } else {
        setError(response.error?.message || 'Failed to fetch leads');
      }
    } catch (err: any) {
      setError(err?.message || 'An error occurred while fetching leads');
    } finally {
      setLoading(false);
    }
  }, [filters.status, filters.source, filters.sortBy, filters.page, filters.limit, debouncedSearch]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  return {
    leads,
    loading,
    error,
    pagination,
    refetch: fetchLeads,
  };
}

export default useLeads;
