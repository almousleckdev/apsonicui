import { AuthUser } from '@/lib/types/auth';

// Access token and user profile live in memory only - never localStorage/sessionStorage.
// The refresh token never reaches this module at all: it travels exclusively as an
// httpOnly cookie set by the backend, invisible to and unmanaged by JS. On a fresh
// page load these are empty until AuthContext performs a silent refresh.
let accessToken: string | null = null;
let currentUser: AuthUser | null = null;

export const tokenStorage = {
  getAccessToken(): string | null {
    return accessToken;
  },

  setAccessToken(token: string): void {
    accessToken = token;
  },

  getUser(): AuthUser | null {
    return currentUser;
  },

  setUser(user: AuthUser): void {
    currentUser = user;
  },

  clearAll(): void {
    accessToken = null;
    currentUser = null;
  },
};
