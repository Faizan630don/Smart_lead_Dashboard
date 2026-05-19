import { useSearchParams } from 'react-router-dom';
import type { FilterState, Lead } from '../types';

export function useFilter() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Re-read current filter state from URL search params
  const getFilters = (): FilterState => {
    const status = searchParams.get('status') as Lead['status'] | null;
    const source = searchParams.get('source') as Lead['source'] | null;
    const search = searchParams.get('search') || '';
    const sortBy = (searchParams.get('sortBy') as FilterState['sortBy']) || 'latest';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);

    return {
      status: ['new', 'contacted', 'qualified', 'lost'].includes(status || '') ? status : null,
      source: ['website', 'instagram', 'referral'].includes(source || '') ? source : null,
      search,
      sortBy: sortBy === 'oldest' ? 'oldest' : 'latest',
      page: isNaN(page) || page <= 0 ? 1 : page,
      limit: isNaN(limit) || limit <= 0 ? 10 : limit,
    };
  };

  const filters = getFilters();

  /**
   * Set a specific filter field and sync with URL search params.
   */
  const setFilter = (key: keyof FilterState, value: any) => {
    const currentParams = new URLSearchParams(searchParams);

    if (value === null || value === undefined || value === '') {
      currentParams.delete(key);
    } else {
      currentParams.set(key, String(value));
    }

    // Reset to page 1 on filter/search change to prevent out-of-bounds pagination
    if (key !== 'page') {
      currentParams.set('page', '1');
    }

    setSearchParams(currentParams);
  };

  /**
   * Clear all filters and query parameters.
   */
  const resetFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  return {
    filters,
    setFilter,
    resetFilters,
  };
}

export default useFilter;
