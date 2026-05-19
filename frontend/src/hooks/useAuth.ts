import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { authService } from '../services/authService';

export function useAuth() {
  const store = useAuthStore();
  const [error, setError] = useState<string | null>(null);

  /**
   * Log in a user.
   */
  const login = async (credentials: Record<string, string>): Promise<boolean> => {
    store.setLoading(true);
    setError(null);
    try {
      const response = await authService.login(credentials);
      if (response.success && response.data) {
        store.setAuth(response.data.user, response.data.token);
        return true;
      } else {
        setError(response.error?.message || 'Invalid credentials');
        return false;
      }
    } catch (err: any) {
      if (err?.code === 'VALIDATION_ERROR' && Array.isArray(err.details)) {
        const detailMessages = err.details.map((d: any) => `${d.path}: ${d.message}`).join(', ');
        setError(`Validation failed: ${detailMessages}`);
      } else {
        setError(err?.message || 'Login failed. Please try again.');
      }
      return false;
    } finally {
      store.setLoading(false);
    }
  };

  /**
   * Register a new user account.
   */
  const register = async (details: Record<string, string>): Promise<boolean> => {
    store.setLoading(true);
    setError(null);
    try {
      const response = await authService.register(details);
      if (response.success) {
        const loginResponse = await authService.login({
          email: details.email,
          password: details.password,
        });
        if (loginResponse.success && loginResponse.data) {
          store.setAuth(loginResponse.data.user, loginResponse.data.token);
          return true;
        } else {
          setError('Account created, but automatic sign in failed. Please sign in manually.');
          return false;
        }
      } else {
        setError(response.error?.message || 'Registration failed');
        return false;
      }
    } catch (err: any) {
      if (err?.code === 'VALIDATION_ERROR' && Array.isArray(err.details)) {
        const detailMessages = err.details.map((d: any) => `${d.path}: ${d.message}`).join(', ');
        setError(`Validation failed: ${detailMessages}`);
      } else {
        setError(err?.message || 'Registration failed. Please try again.');
      }
      return false;
    } finally {
      store.setLoading(false);
    }
  };

  /**
   * Clear credentials and sign out.
   */
  const logout = () => {
    store.clearAuth();
  };

  return {
    user: store.user,
    isAuthenticated: store.isAuthenticated,
    isLoading: store.isLoading,
    error,
    login,
    register,
    logout,
    initialize: store.initialize,
  };
}

export default useAuth;
