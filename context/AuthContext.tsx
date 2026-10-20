"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { authService } from "@/services/auth-service";
import { tokenStorage } from "@/services/token-storage";
import { SESSION_EXPIRED_EVENT, refreshSession } from "@/services/api-client";
import type { LoginRequest, UserProfileResponse } from "@/lib/types/auth";

interface AuthContextType {
  user: UserProfileResponse | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  setUser: React.Dispatch<React.SetStateAction<UserProfileResponse | null>>;
  updateUser: (updatedProfile: UserProfileResponse) => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUserState] = useState<UserProfileResponse | null>(() => tokenStorage.getUser());
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const setUser = useCallback((userOrUpdater: React.SetStateAction<UserProfileResponse | null>) => {
    setUserState((prev) => {
      const nextUser = typeof userOrUpdater === 'function' ? userOrUpdater(prev) : userOrUpdater;
      if (nextUser) {
        tokenStorage.setUser(nextUser);
      } else {
        tokenStorage.clearAll();
      }
      return nextUser;
    });
  }, []);

  const updateUser = useCallback((updatedProfile: UserProfileResponse) => {
    setUserState(updatedProfile);
    tokenStorage.setUser(updatedProfile);
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const profile = await authService.getCurrentUser();
      setUserState(profile);
      tokenStorage.setUser(profile);
    } catch (err) {
      console.warn("Could not refresh user profile:", err);
    }
  }, []);

  // Initialize auth state on page load or refresh
  useEffect(() => {
    let isMounted = true;

    const runInitAuth = async () => {
      let token = tokenStorage.getAccessToken();

      if (!token) {
        try {
          token = await refreshSession();
        } catch {
          // Refresh cookie absent or expired: the visitor is simply signed out.
        }
      }

      if (token) {
        try {
          const profile = await authService.getCurrentUser();
          if (isMounted) {
            setUserState(profile);
            tokenStorage.setUser(profile);
          }
        } catch (err) {
          console.warn("Failed to validate token profile on init:", err);
          try {
            if (await refreshSession()) {
              const profile = await authService.getCurrentUser();
              if (isMounted) {
                setUserState(profile);
                tokenStorage.setUser(profile);
              }
            } else if (isMounted) {
              setUserState(null);
              tokenStorage.clearAll();
            }
          } catch {
            if (isMounted) {
              setUserState(null);
              tokenStorage.clearAll();
            }
          }
        }
      } else if (isMounted) {
        setUserState(null);
      }

      if (isMounted) {
        setIsLoading(false);
      }
    };

    runInitAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  // Listen for global session expired event from apiClient
  useEffect(() => {
    const handleSessionExpired = () => {
      setUserState(null);
      tokenStorage.clearAll();
    };

    window.addEventListener(SESSION_EXPIRED_EVENT, handleSessionExpired);
    return () => {
      window.removeEventListener(SESSION_EXPIRED_EVENT, handleSessionExpired);
    };
  }, []);

  const login = async (credentials: LoginRequest) => {
    const authData = await authService.login(credentials);
    if (authData?.user) {
      setUserState(authData.user);
      tokenStorage.setUser(authData.user);
    }
    if (authData?.accessToken) {
      tokenStorage.setAccessToken(authData.accessToken);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch {
      // Ignore API errors on logout
    } finally {
      setUserState(null);
      tokenStorage.clearAll();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        setUser,
        updateUser,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
