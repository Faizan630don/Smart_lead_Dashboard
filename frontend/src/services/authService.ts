import api from './api';
import type { ApiResponse, User } from '../types';

export interface LoginResponseData {
  user: User;
  token: string;
}

export const authService = {
  /**
   * Log in user using credentials.
   */
  login: async (credentials: Record<string, string>): Promise<ApiResponse<LoginResponseData>> => {
    return api.post('/auth/login', credentials);
  },

  /**
   * Register a new user account.
   */
  register: async (details: Record<string, string>): Promise<ApiResponse<null>> => {
    return api.post('/auth/register', details);
  },

  /**
   * Fetch details of currently logged-in user session.
   */
  getMe: async (): Promise<ApiResponse<User>> => {
    return api.get('/auth/me');
  },
};

export default authService;
