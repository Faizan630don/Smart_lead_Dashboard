import React, { useState, useEffect } from 'react';
import { useFilter } from '../../hooks/useFilter';
import { LEAD_STATUS_OPTIONS, LEAD_SOURCE_OPTIONS, SORT_OPTIONS } from '../../constants/config';
import { Search, FilterX, SlidersHorizontal, X, Bookmark, Plus } from 'lucide-react';
import Select from '../common/Select';

export const LeadFilters: React.FC = () => {
  const { filters, setFilter, resetFilters } = useFilter();
  const [localSearch, setLocalSearch] = useState(filters.search);

  // Filter Presets State
  const [presets, setPresets] = useState<Record<string, any>>(() => {
    try {
      return JSON.parse(localStorage.getItem('filter_presets') || '{}');
    } catch {
      return {};
    }
  });
  const [newPresetName, setNewPresetName] = useState('');
  const [showPresetInput, setShowPresetInput] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  // Sync local search when filters.search is changed from outside (e.g. reset)
  useEffect(() => {
    setLocalSearch(filters.search);
  }, [filters.search]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalSearch(value);
    setFilter('search', value);
  };

  const activeFilterCount = [
    filters.status !== null,
    filters.source !== null,
    filters.search !== '',
    filters.sortBy !== 'latest',
  ].filter(Boolean).length;

  const hasActiveFilters = activeFilterCount > 0;

  // Presets Handlers
  const handleSavePreset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPresetName.trim()) return;
    const updated = {
      ...presets,
      [newPresetName.trim()]: {
        status: filters.status,
        source: filters.source,
        search: filters.search,
        sortBy: filters.sortBy,
      },
    };
    setPresets(updated);
    localStorage.setItem('filter_presets', JSON.stringify(updated));
    setNewPresetName('');
    setShowPresetInput(false);
  };

  const handleLoadPreset = (presetName: string) => {
    const preset = presets[presetName];
    if (preset) {
      setFilter('status', preset.status);
      setFilter('source', preset.source);
      setFilter('search', preset.search);
      setFilter('sortBy', preset.sortBy);
    }
  };

  const handleDeletePreset = (presetName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = { ...presets };
    delete updated[presetName];
    setPresets(updated);
    localStorage.setItem('filter_presets', JSON.stringify(updated));
  };

  return (
    <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-md w-full rounded-2xl p-6 flex flex-col gap-5 border border-gray-200/50 dark:border-slate-800/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-spring">
      {/* Filters Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200/50 dark:border-slate-800/60 pb-3">
        <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200">
          <SlidersHorizontal size={16} className="text-blue-500" />
          <h2 className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
            Search Filters
            {activeFilterCount > 0 && (
              <span className="bg-blue-600/30 text-blue-600 dark:text-blue-400 border border-blue-500/20 text-xs px-2.5 py-0.5 rounded-full font-bold animate-pulse">
                {activeFilterCount}
              </span>
            )}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          {/* Preset trigger button */}
          <button
            onClick={() => setShowPresetInput(!showPresetInput)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-250 dark:border-slate-700 transition-all duration-200 cursor-pointer"
          >
            <Bookmark size={13} className="text-amber-500" />
            <span>Save Preset</span>
          </button>

          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-500/10 hover:bg-rose-500 text-rose-600 hover:text-white border border-rose-500/20 transition-all duration-200 cursor-pointer"
            >
              <FilterX size={13} />
              <span>Reset Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Preset Input Form */}
      {showPresetInput && (
        <form
          onSubmit={handleSavePreset}
          className="flex items-end gap-3 bg-slate-50 dark:bg-slate-900/40 p-4 border border-slate-200 dark:border-slate-800/80 rounded-xl max-w-md animate-fade-in"
        >
          <div className="flex-1 flex flex-col gap-1.5 text-left">
            <label
              htmlFor="presetName"
              className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider"
            >
              Preset Name
            </label>
            <input
              id="presetName"
              type="text"
              placeholder="e.g., Qualified Web Leads"
              value={newPresetName}
              onChange={(e) => setNewPresetName(e.target.value)}
              className="w-full px-3 py-1.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-205 rounded-md text-xs placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="flex items-center gap-1 px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-md text-xs cursor-pointer"
          >
            <Plus size={12} />
            <span>Add</span>
          </button>
        </form>
      )}

      {/* Presets List */}
      {Object.keys(presets).length > 0 && (
        <div className={`flex flex-wrap items-center gap-2 text-left transition-spring duration-300 ${searchFocused ? 'opacity-40 blur-[0.2px]' : 'opacity-100'}`}>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            Saved Presets:
          </span>
          {Object.keys(presets).map((name) => (
            <button
              key={name}
              onClick={() => handleLoadPreset(name)}
              className="group flex items-center gap-1.5 pl-2.5 pr-1.5 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-700 dark:text-slate-300 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer transition-all duration-200"
            >
              <span>{name}</span>
              <span
                onClick={(e) => handleDeletePreset(name, e)}
                className="p-0.5 rounded hover:bg-slate-305 dark:hover:bg-slate-700 text-slate-400 dark:text-slate-550 hover:text-slate-600 dark:hover:text-slate-300"
                title="Delete preset"
              >
                <X size={10} />
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Filter Inputs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Search Input Container - expands horizontally */}
        <div className={`w-full flex flex-col gap-1.5 text-left transition-spring duration-300 ${searchFocused ? 'lg:col-span-2' : 'lg:col-span-1'}`}>
          <label
            htmlFor="search"
            className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider"
          >
            Search
          </label>
          <div className="relative">
            <input
              id="search"
              type="text"
              placeholder="Search by name or email..."
              value={localSearch}
              onChange={handleSearchChange}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              className={`w-full pl-9.5 pr-3.5 py-2.5 bg-white dark:bg-slate-900/60 border rounded-lg placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none transition-spring ${
                searchFocused
                  ? 'border-blue-500/80 ring-4 ring-blue-500/10 shadow-[0_0_15px_rgba(59,130,246,0.1)]'
                  : 'border-gray-250/80 dark:border-slate-800'
              }`}
            />
            <Search className={`absolute left-3 top-[13px] transition-spring duration-300 ${searchFocused ? 'translate-x-1 text-blue-500 scale-110' : 'text-slate-400 dark:text-slate-500'}`} size={16} />
          </div>
        </div>

        {/* Other Filters Container - shrinks and dims */}
        <div className={`grid grid-cols-1 sm:grid-cols-3 gap-4 transition-spring duration-300 ${searchFocused ? 'lg:col-span-2 opacity-45 blur-[0.25px]' : 'lg:col-span-3 opacity-100'}`}>
          {/* Status selector */}
          <Select
            label="Lead Status"
            id="filter-status"
            options={[{ value: '', label: 'All Statuses' }, ...LEAD_STATUS_OPTIONS]}
            value={filters.status || ''}
            onChange={(e) => setFilter('status', e.target.value || null)}
          />

          {/* Source selector */}
          <Select
            label="Lead Source"
            id="filter-source"
            options={[{ value: '', label: 'All Sources' }, ...LEAD_SOURCE_OPTIONS]}
            value={filters.source || ''}
            onChange={(e) => setFilter('source', e.target.value || null)}
          />

          {/* Sorting selector */}
          <Select
            label="Sort By"
            id="filter-sortBy"
            options={SORT_OPTIONS}
            value={filters.sortBy}
            onChange={(e) => setFilter('sortBy', e.target.value)}
          />
        </div>
      </div>

      {/* Applied Filter Chips */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 border-t border-slate-200 dark:border-slate-800/40 pt-4 text-left animate-fade-in">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            Active:
          </span>

          {filters.search && (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 dark:bg-blue-600/10 border border-blue-100 dark:border-blue-500/20 rounded-full text-xs text-blue-600 dark:text-blue-400">
              <span>Search: "{filters.search}"</span>
              <button
                onClick={() => setFilter('search', '')}
                className="hover:text-blue-800 dark:hover:text-blue-200 cursor-pointer"
              >
                <X size={12} />
              </button>
            </div>
          )}

          {filters.status && (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 dark:bg-blue-600/10 border border-blue-100 dark:border-blue-500/20 rounded-full text-xs text-blue-600 dark:text-blue-400 capitalize">
              <span>Status: {filters.status}</span>
              <button
                onClick={() => setFilter('status', null)}
                className="hover:text-blue-800 dark:hover:text-blue-200 cursor-pointer"
              >
                <X size={12} />
              </button>
            </div>
          )}

          {filters.source && (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 dark:bg-blue-600/10 border border-blue-100 dark:border-blue-500/20 rounded-full text-xs text-blue-600 dark:text-blue-400 capitalize">
              <span>Source: {filters.source}</span>
              <button
                onClick={() => setFilter('source', null)}
                className="hover:text-blue-800 dark:hover:text-blue-200 cursor-pointer"
              >
                <X size={12} />
              </button>
            </div>
          )}

          {filters.sortBy !== 'latest' && (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 dark:bg-blue-600/10 border border-blue-100 dark:border-blue-500/20 rounded-full text-xs text-blue-600 dark:text-blue-400">
              <span>Sort: {filters.sortBy === 'oldest' ? 'Oldest' : filters.sortBy}</span>
              <button
                onClick={() => setFilter('sortBy', 'latest')}
                className="hover:text-blue-800 dark:hover:text-blue-200 cursor-pointer"
              >
                <X size={12} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LeadFilters;
