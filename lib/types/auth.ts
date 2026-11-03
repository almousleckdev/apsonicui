// Authentication domain type contracts
export interface LoginRequest {
  usernameOrEmail: string;
  password: string;
  rememberMe?: boolean;
}

export interface UserProfileResponse {
  id: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  enabled: boolean;
  roles: string[];
  permissions: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  user: UserProfileResponse;
}

export interface TokenRefreshResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
}

export interface AuthUser {
  id: number;
  username: string;
  email: string;
  name: string;
  avatarUrl?: string;
  roles: string[];
  permissions: string[];
}

export interface UserManagementItem {
  id: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  enabled: boolean;
  roles: string[];
  createdAt?: string;
  updatedAt?: string;
  /** Only on a just-created account without a password: whether its invitation email was sent. */
  invitationSent?: boolean;
}

export interface CreateUserPayload {
  username: string;
  email: string;
  /** Leave out to email the person an invitation to choose their own password. */
  password?: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  enabled?: boolean;
  roles: string[];
}

export interface UpdateUserPayload {
  username?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  password?: string;
  enabled?: boolean;
  roles?: string[];
}

export interface RoleItem {
  id: number;
  name: string;
  description?: string;
  permissions?: string[];
}
