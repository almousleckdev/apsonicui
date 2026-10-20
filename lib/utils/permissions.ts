import type { UserProfileResponse } from '@/lib/types/auth';

/**
 * Checks if a user has any of the given roles.
 */
export function hasRole(user: UserProfileResponse | null | undefined, ...roles: string[]): boolean {
  if (!user || !user.roles) return false;
  return user.roles.some((r) => {
    const normalized = r.startsWith('ROLE_') ? r : `ROLE_${r}`;
    return roles.some((target) => {
      const targetNorm = target.startsWith('ROLE_') ? target : `ROLE_${target}`;
      return normalized === targetNorm;
    });
  });
}

/**
 * Checks if a user has a specific permission or is a Super Admin.
 */
export function hasPermission(
  user: UserProfileResponse | null | undefined,
  permission: string
): boolean {
  if (!user) return false;
  if (hasRole(user, 'ROLE_SUPER_ADMIN')) return true;
  if (!user.permissions) return false;
  return user.permissions.includes(permission);
}

/**
 * Check if the user can delete catalog items (products, categories, news).
 */
export function canDeleteCatalog(user: UserProfileResponse | null | undefined): boolean {
  return hasRole(user, 'ROLE_SUPER_ADMIN', 'ROLE_ADMIN');
}

/**
 * Check if the user can manage users.
 */
export function canManageUsers(user: UserProfileResponse | null | undefined): boolean {
  return hasRole(user, 'ROLE_SUPER_ADMIN');
}
