import { apiClient } from './api-client';
import { tokenStorage } from './token-storage';
import type {
  LoginRequest,
  AuthResponse,
  UserProfileResponse,
  TokenRefreshResponse,
  UserManagementItem,
  CreateUserPayload,
  UpdateUserPayload,
  RoleItem,
} from '@/lib/types/auth';
import type { ApiResponse } from '@/lib/types/api';

export const authService = {
  /**
   * Authenticate admin user with username/email and password.
   */
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const res: ApiResponse<AuthResponse> = await apiClient('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        usernameOrEmail: credentials.usernameOrEmail,
        password: credentials.password,
      }),
      requiresAuth: false,
    });

    if (res.data?.accessToken) {
      tokenStorage.setAccessToken(res.data.accessToken);
    }
    if (res.data?.user) {
      tokenStorage.setUser(res.data.user);
    }

    return res.data;
  },

  /**
   * Refresh access token using HTTP-only refresh token cookie.
   */
  async refreshToken(): Promise<TokenRefreshResponse> {
    const res: ApiResponse<TokenRefreshResponse> = await apiClient('/auth/refresh', {
      method: 'POST',
      requiresAuth: false,
    });

    if (res.data?.accessToken) {
      tokenStorage.setAccessToken(res.data.accessToken);
    }

    return res.data;
  },

  /**
   * Logout current session and clear stored tokens.
   */
  async logout(): Promise<void> {
    try {
      await apiClient('/auth/logout', {
        method: 'POST',
        requiresAuth: true,
      });
    } catch {
      // Ignore API errors on logout to ensure local storage is always cleared
    } finally {
      tokenStorage.clearAll();
    }
  },

  /**
   * Fetch authenticated user profile.
   */
  async getCurrentUser(): Promise<UserProfileResponse> {
    const res: ApiResponse<UserProfileResponse> = await apiClient('/auth/me', {
      method: 'GET',
      requiresAuth: true,
    });

    if (res.data) {
      tokenStorage.setUser(res.data);
    }

    return res.data;
  },

  /**
   * Update current user profile (Avatar, Username, Name, Email, Password).
   */
  async updateProfile(payload: {
    firstName?: string;
    lastName?: string;
    username?: string;
    email?: string;
    avatarUrl?: string;
    currentPassword?: string;
    newPassword?: string;
  }): Promise<UserProfileResponse> {
    const res: ApiResponse<UserProfileResponse> = await apiClient('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(payload),
      requiresAuth: true,
    });

    if (res.data) {
      tokenStorage.setUser(res.data);
    }

    return res.data;
  },
};

export const userService = {
  async getUsersList(query?: string, role?: string): Promise<UserManagementItem[]> {
    const queryParams = new URLSearchParams();
    if (query) queryParams.set('query', query);
    if (role && role !== 'ALL') queryParams.set('role', role);
    queryParams.set('size', '50');

    const endpoint = `/admin/users?${queryParams.toString()}`;
    const res: ApiResponse<any> = await apiClient(endpoint, {
      method: 'GET',
      requiresAuth: true,
    });

    return res.data?.content || res.data || [];
  },

  async createUser(payload: CreateUserPayload): Promise<UserManagementItem> {
    const res: ApiResponse<UserManagementItem> = await apiClient('/admin/users', {
      method: 'POST',
      body: JSON.stringify(payload),
      requiresAuth: true,
    });

    return res.data;
  },

  async updateUser(id: number, payload: UpdateUserPayload): Promise<UserManagementItem> {
    const res: ApiResponse<UserManagementItem> = await apiClient(`/admin/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
      requiresAuth: true,
    });

    return res.data;
  },

  async toggleUserStatus(id: number, enabled: boolean): Promise<UserManagementItem> {
    const res: ApiResponse<UserManagementItem> = await apiClient(
      `/admin/users/${id}/status?enabled=${enabled}`,
      {
        method: 'PATCH',
        requiresAuth: true,
      }
    );

    return res.data;
  },

  async deleteUser(id: number): Promise<void> {
    await apiClient(`/admin/users/${id}`, {
      method: 'DELETE',
      requiresAuth: true,
    });
  },

  async getAllRoles(): Promise<RoleItem[]> {
    try {
      const res: ApiResponse<RoleItem[]> = await apiClient('/admin/users/roles', {
        method: 'GET',
        requiresAuth: true,
        silent: true,
      });

      return res.data || [];
    } catch (err) {
      console.warn('Backend API /admin/users/roles unavailable:', err);
    }

    return [
      { id: 1, name: 'SUPER_ADMIN', description: 'Super Administrator with full permissions' },
      { id: 2, name: 'ADMIN', description: 'System Administrator' },
      { id: 3, name: 'EDITOR', description: 'Content Editor' },
    ];
  },
};
