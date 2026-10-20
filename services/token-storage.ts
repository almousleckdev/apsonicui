import { UserProfileResponse } from '@/lib/types/auth';

/**
 * The access token and profile live in memory only. Nothing is persisted to localStorage/sessionStorage,
 * so an XSS cannot read a long-lived credential from storage. Sessions survive a reload through the
 * httpOnly refresh cookie (see AuthContext, which restores the session on load).
 */
const LEGACY_STORAGE_KEYS = ['apsonic_access_token', 'apsonic_user_profile'];

let memoryAccessToken: string | null = null;
let memoryCurrentUser: UserProfileResponse | null = null;

// Earlier versions persisted the token and profile; remove them from browsers that still hold them.
function purgeLegacyStorage(): void {
  if (typeof window === 'undefined') return;
  try {
    LEGACY_STORAGE_KEYS.forEach((key) => window.localStorage.removeItem(key));
  } catch {
    // Storage may be unavailable (private mode / blocked); nothing to purge then.
  }
}
purgeLegacyStorage();

export const tokenStorage = {
  getAccessToken(): string | null {
    return memoryAccessToken;
  },

  setAccessToken(token: string): void {
    memoryAccessToken = token;
  },

  getUser(): UserProfileResponse | null {
    return memoryCurrentUser;
  },

  setUser(user: UserProfileResponse): void {
    memoryCurrentUser = user;
  },

  clearAll(): void {
    memoryAccessToken = null;
    memoryCurrentUser = null;
  },
};
