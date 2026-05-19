export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5005/api';
export const APP_NAME = import.meta.env.VITE_APP_NAME || 'Smart Leads Dashboard';

export const LEAD_STATUS_OPTIONS = [
  { value: 'new', label: 'New', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  { value: 'contacted', label: 'Contacted', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  { value: 'qualified', label: 'Qualified', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  { value: 'lost', label: 'Lost', color: 'bg-rose-500/10 text-rose-400 border-rose-500/20' },
];

export const LEAD_SOURCE_OPTIONS = [
  { value: 'website', label: 'Website' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'referral', label: 'Referral' },
];

export const SORT_OPTIONS = [
  { value: 'latest', label: 'Latest Created' },
  { value: 'oldest', label: 'Oldest Created' },
];
