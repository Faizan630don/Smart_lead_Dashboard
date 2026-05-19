import React from 'react';
import { usePagination } from '../../hooks/usePagination';
import type { PaginationMeta } from '../../types';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationControlProps {
  meta?: PaginationMeta;
}

export const PaginationControl: React.FC<PaginationControlProps> = ({ meta }) => {
  const { page, limit, goToPage, nextPage, prevPage, setLimit } = usePagination(meta);

  if (!meta || meta.totalPages <= 1) return null;

  const startRecord = (meta.page - 1) * meta.limit + 1;
  const endRecord = Math.min(meta.page * meta.limit, meta.total);

  // Generate page numbers range surrounding the current index
  const pageNumbers: number[] = [];
  const range = 2;
  for (let i = Math.max(1, page - range); i <= Math.min(meta.totalPages, page + range); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border border-gray-200/50 dark:border-slate-800/50 shadow-sm rounded-xl px-6 py-4.5 transition-spring">
      {/* Records Count Range */}
      <div className="text-sm text-slate-500 dark:text-slate-400">
        Showing <span className="font-semibold text-slate-800 dark:text-slate-200">{startRecord}</span> to{' '}
        <span className="font-semibold text-slate-800 dark:text-slate-200">{endRecord}</span> of{' '}
        <span className="font-semibold text-slate-800 dark:text-slate-200">{meta.total}</span> leads
      </div>

      {/* Button Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={prevPage}
          disabled={!meta.hasPrev}
          className="p-2 rounded-lg bg-white hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 border border-gray-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition-spring duration-200 cursor-pointer"
          aria-label="Previous page"
        >
          <ChevronLeft size={16} />
        </button>

        {pageNumbers[0] > 1 && (
          <>
            <button
              onClick={() => goToPage(1)}
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-white hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 border border-gray-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-spring duration-200 cursor-pointer"
            >
              1
            </button>
            {pageNumbers[0] > 2 && <span className="text-slate-405 dark:text-slate-600 text-xs px-1">...</span>}
          </>
        )}

        {pageNumbers.map((num) => (
          <button
            key={num}
            onClick={() => goToPage(num)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-spring duration-200 cursor-pointer ${
              num === page
                ? 'bg-blue-600/10 text-blue-600 dark:text-blue-400 border border-blue-500/30'
                : 'bg-white hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 border border-gray-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            {num}
          </button>
        ))}

        {pageNumbers[pageNumbers.length - 1] < meta.totalPages && (
          <>
            {pageNumbers[pageNumbers.length - 1] < meta.totalPages - 1 && (
              <span className="text-slate-405 dark:text-slate-600 text-xs px-1">...</span>
            )}
            <button
              onClick={() => goToPage(meta.totalPages)}
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-white hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 border border-gray-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-spring duration-200 cursor-pointer"
            >
              {meta.totalPages}
            </button>
          </>
        )}

        <button
          onClick={nextPage}
          disabled={!meta.hasNext}
          className="p-2 rounded-lg bg-white hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 border border-gray-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition-spring duration-200 cursor-pointer"
          aria-label="Next page"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Dropdown Limit Selection */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-slate-500 dark:text-slate-400">Show</span>
        <select
          value={limit}
          onChange={(e) => setLimit(parseInt(e.target.value, 10))}
          className="px-2 py-1 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-lg text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500 cursor-pointer"
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
        <span className="text-xs text-slate-500 dark:text-slate-400">per page</span>
      </div>
    </div>
  );
};

export default PaginationControl;
