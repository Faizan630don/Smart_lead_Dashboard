import { useFilter } from './useFilter';
import type { PaginationMeta } from '../types';

export function usePagination(meta?: PaginationMeta) {
  const { filters, setFilter } = useFilter();

  /**
   * Jump to a specific page index.
   */
  const goToPage = (pageNumber: number) => {
    if (meta && (pageNumber < 1 || pageNumber > meta.totalPages)) return;
    setFilter('page', pageNumber);
  };

  /**
   * Navigate forward to the next page.
   */
  const nextPage = () => {
    if (meta && meta.hasNext) {
      goToPage(filters.page + 1);
    }
  };

  /**
   * Navigate backward to the previous page.
   */
  const prevPage = () => {
    if (meta && meta.hasPrev) {
      goToPage(filters.page - 1);
    }
  };

  return {
    page: filters.page,
    limit: filters.limit,
    goToPage,
    nextPage,
    prevPage,
    setLimit: (limit: number) => setFilter('limit', limit),
  };
}

export default usePagination;
