/**
 * Authentication utility functions for handling JWT tokens and user authentication
 */

import { Session } from "../types/session";

// Token storage key in localStorage
export const TOKEN_KEY = 'auth_token';
export const USER_KEY = 'auth_user';
/**
 * Check if the user is authenticated by verifying a token exists
 */
export function isAuthenticated(): boolean {
  return !!getToken();
}

/**
 * Get the authentication token from localStorage
 */
export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

/**
 * Set the authentication token in localStorage
 */
export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

/**
 * Set the user in localStorage
 */
export function setUser(user: Session['user']): void {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

/**
 * Get the user from localStorage
 */
export function getUser(): Session['user'] | null {
  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
}

/**
 * Remove the authentication token from localStorage
 */
export function removeToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

/**
 * Log the user out by removing the token
 */
export function logout(): void {
  removeToken();
  window.location.href = '/login';
}

/**
 * Get authentication headers for API requests
 */
export function getAuthHeaders(): Record<string, string> {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
} 