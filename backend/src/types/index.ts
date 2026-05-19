import { UserRole, LeadStatus, LeadSource } from '../constants';

/**
 * Interface representing a User in the system
 */
export interface IUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Interface representing JWT Auth Payload
 */
export interface IAuthPayload {
  id: string;
  email: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

/**
 * Interface representing a Lead
 */
export interface ILead {
  id: string;
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  createdBy: string; // User ID reference
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Pagination metadata format
 */
export interface IPaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

/**
 * Global standardized API Response wrapper
 */
export interface IApiResponse<T> {
  success: boolean;
  data: T | null;
  error: {
    code: string;
    message: string;
    details?: any;
  } | null;
  meta: {
    timestamp: string;
    path: string;
    pagination?: IPaginationMeta;
  };
}

export interface FilterQuery {
  status?: LeadStatus;
  source?: LeadSource;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: 'latest' | 'oldest';
}

export interface ListLeadsResponse {
  success: boolean;
  data: ILead[];
  meta: {
    timestamp: string;
    path: string;
    pagination: IPaginationMeta;
    filters: Partial<FilterQuery>;
  };
}

