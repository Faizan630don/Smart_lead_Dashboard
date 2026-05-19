import api from './api';
import type { ApiResponse, Lead, FilterState } from '../types';
import axios from 'axios';
import { API_BASE_URL } from '../constants/config';

export const leadService = {
  /**
   * Fetch paginated and filtered leads list.
   */
  getLeads: async (params: Partial<FilterState>): Promise<ApiResponse<Lead[]>> => {
    const cleanParams: Record<string, any> = {};
    if (params.status) cleanParams.status = params.status;
    if (params.source) cleanParams.source = params.source;
    if (params.search) cleanParams.search = params.search;
    if (params.sortBy) cleanParams.sortBy = params.sortBy;
    if (params.page) cleanParams.page = params.page;
    if (params.limit) cleanParams.limit = params.limit;

    return api.get('/leads', { params: cleanParams });
  },

  /**
   * Fetch single lead details by ID.
   */
  getLeadById: async (id: string): Promise<ApiResponse<Lead>> => {
    return api.get(`/leads/${id}`);
  },

  /**
   * Create a new lead.
   */
  createLead: async (data: Partial<Lead>): Promise<ApiResponse<Lead>> => {
    return api.post('/leads', data);
  },

  /**
   * Update an existing lead.
   */
  updateLead: async (id: string, data: Partial<Lead>): Promise<ApiResponse<Lead>> => {
    return api.put(`/leads/${id}`, data);
  },

  /**
   * Delete a lead by ID.
   */
  deleteLead: async (id: string): Promise<ApiResponse<{ message: string }>> => {
    return api.delete(`/leads/${id}`);
  },

  /**
   * Request matching leads exported in CSV format.
   */
  exportCSV: async (params: Partial<FilterState>): Promise<Blob> => {
    const token = localStorage.getItem('token');

    // Utilize raw axios to configure binary stream response type
    const response = await axios.post(`${API_BASE_URL}/leads/export/csv`, null, {
      params: {
        status: params.status || undefined,
        source: params.source || undefined,
        search: params.search || undefined,
        sortBy: params.sortBy || undefined,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
      responseType: 'blob',
    });

    return response.data;
  },
};

export default leadService;
