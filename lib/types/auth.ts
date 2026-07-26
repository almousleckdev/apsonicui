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
  enabled: boolean;
  roles: string[];
  permissions: string[];
  createdAt?: string;
  updatedAt?: string;
}

// Neither response carries a refreshToken field - it travels exclusively as an
// httpOnly cookie set by the backend (see services/api-client.ts), matching the
// backend's AuthResponse/TokenRefreshResponse DTOs.
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
  roles: string[];
  permissions: string[];
}
