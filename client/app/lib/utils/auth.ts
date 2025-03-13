/**
 * Authentication utility functions for handling JWT tokens and user authentication
 */

// Get the JWT token from localStorage
export const getToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
};

// Set the JWT token in localStorage
export const setToken = (token: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('token', token);
};

// Remove the JWT token from localStorage
export const removeToken = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('token');
};

// Check if the user is authenticated
export const isAuthenticated = (): boolean => {
  return !!getToken();
};

// Get the authorization header for API requests
export const getAuthHeader = (): { Authorization: string } | Record<string, never> => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Logout the user
export const logout = (): void => {
  removeToken();
  // You can add additional logout logic here if needed
  // For example, redirecting to the login page
  window.location.href = '/login';
}; 