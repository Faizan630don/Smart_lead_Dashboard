export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'sales_user';
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  status: 'new' | 'contacted' | 'qualified' | 'lost';
  source: 'website' | 'instagram' | 'referral';
  notes?: string;
  createdAt: string;
  createdBy: string;
}

export interface FilterState {
  status: Lead['status'] | null;
  source: Lead['source'] | null;
  search: string;
  sortBy: 'latest' | 'oldest';
  page: number;
  limit: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error: {
    code: string;
    message: string;
    details?: any;
  } | null;
  meta?: {
    timestamp: string;
    path: string;
    pagination?: PaginationMeta;
    filters?: {
      status: string | null;
      source: string | null;
      search: string;
    };
  };
}
