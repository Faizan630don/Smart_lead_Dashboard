/**
 * User roles
 */
export const USER_ROLES = {
  ADMIN: 'admin',
  SALES_USER: 'sales_user',
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

/**
 * Lead statuses
 */
export const LEAD_STATUSES = {
  NEW: 'new',
  CONTACTED: 'contacted',
  QUALIFIED: 'qualified',
  LOST: 'lost',
} as const;

export type LeadStatus = typeof LEAD_STATUSES[keyof typeof LEAD_STATUSES];

/**
 * Lead sources
 */
export const LEAD_SOURCES = {
  WEBSITE: 'website',
  INSTAGRAM: 'instagram',
  REFERRAL: 'referral',
} as const;

export type LeadSource = typeof LEAD_SOURCES[keyof typeof LEAD_SOURCES];

/**
 * Pagination defaults
 */
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
} as const;

/**
 * Sorting constants
 */
export const SORT_BY = {
  LATEST: 'latest',
  OLDEST: 'oldest',
} as const;

export type SortByType = typeof SORT_BY[keyof typeof SORT_BY];
