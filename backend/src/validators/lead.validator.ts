import { z } from 'zod';
import { LEAD_STATUSES, LEAD_SOURCES, SORT_BY } from '../constants';

export const createLeadSchema = z.object({
  body: z.object({
    name: z
      .string({ required_error: 'Lead name is required' })
      .min(2, 'Lead name must be at least 2 characters long')
      .trim(),
    email: z
      .string({ required_error: 'Lead email is required' })
      .email('Invalid email address')
      .trim()
      .toLowerCase(),
    status: z
      .enum(Object.values(LEAD_STATUSES) as [string, ...string[]], {
        invalid_type_error: 'Invalid lead status',
      })
      .default(LEAD_STATUSES.NEW),
    source: z
      .enum(Object.values(LEAD_SOURCES) as [string, ...string[]], {
        required_error: 'Lead source is required',
        invalid_type_error: 'Invalid lead source',
      }),
    notes: z.string().trim().optional(),
  }),
});

export const updateLeadSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(2, 'Lead name must be at least 2 characters long')
      .trim()
      .optional(),
    email: z
      .string()
      .email('Invalid email address')
      .trim()
      .toLowerCase()
      .optional(),
    status: z
      .enum(Object.values(LEAD_STATUSES) as [string, ...string[]], {
        invalid_type_error: 'Invalid lead status',
      })
      .optional(),
    source: z
      .enum(Object.values(LEAD_SOURCES) as [string, ...string[]], {
        invalid_type_error: 'Invalid lead source',
      })
      .optional(),
    notes: z.string().trim().optional(),
  }),
});

export const queryLeadSchema = z.object({
  query: z.object({
    status: z.preprocess((val) => {
      if (typeof val === 'string' && Object.values(LEAD_STATUSES).includes(val as any)) {
        return val;
      }
      return undefined;
    }, z.string().optional()),
    source: z.preprocess((val) => {
      if (typeof val === 'string' && Object.values(LEAD_SOURCES).includes(val as any)) {
        return val;
      }
      return undefined;
    }, z.string().optional()),
    search: z.string().optional(),
    sortBy: z
      .enum(Object.values(SORT_BY) as [string, ...string[]])
      .default(SORT_BY.LATEST),
    page: z.preprocess((val) => {
      if (val === undefined || val === null) return 1;
      const parsed = parseInt(String(val), 10);
      return isNaN(parsed) || parsed <= 0 ? 1 : parsed;
    }, z.number().default(1)),
    limit: z.preprocess((val) => {
      if (val === undefined || val === null) return 10;
      const parsed = parseInt(String(val), 10);
      if (isNaN(parsed) || parsed <= 0) return 10;
      return parsed > 100 ? 50 : parsed;
    }, z.number().default(10)),
  }),
});
