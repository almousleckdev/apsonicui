import { UserProfileResponse } from '@/lib/types/auth';

const TOKEN_KEY = 'apsonic_access_token';
const USER_KEY = 'apsonic_user_profile';

let memoryAccessToken: string | null = null;
let memoryCurrentUser: UserProfileResponse | null = null;

export const tokenStorage = {
  getAccessToken(): string | null {
    if (memoryAccessToken) return memoryAccessToken;
    if (typeof window !== 'undefined') {
      try {
        memoryAccessToken = localStorage.getItem(TOKEN_KEY);
      } catch {
        // Fallback
      }
    }
    return memoryAccessToken;
  },

  setAccessToken(token: string): void {
    memoryAccessToken = token;
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(TOKEN_KEY, token);
      } catch {
        // Fallback
      }
    }
  },

  getUser(): UserProfileResponse | null {
    if (memoryCurrentUser) return memoryCurrentUser;
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(USER_KEY);
        if (stored) {
          memoryCurrentUser = JSON.parse(stored);
        }
      } catch {
        // Fallback
      }
    }
    return memoryCurrentUser;
  },

  setUser(user: UserProfileResponse): void {
    memoryCurrentUser = user;
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(USER_KEY, JSON.stringify(user));
      } catch {
        // Fallback
      }
    }
  },

  clearAll(): void {
    memoryAccessToken = null;
    memoryCurrentUser = null;
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
      } catch {
        // Fallback
      }
    }
  },
};
