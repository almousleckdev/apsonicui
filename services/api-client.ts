import { ApiResponse, ApiErrorResponse } from '@/lib/types/api';
import { tokenStorage } from './token-storage';
import { reportError } from '@/lib/error-reporting';

const getBaseUrl = () => {
  if (typeof window === 'undefined') {
    const serverUrl = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';
    return serverUrl.endsWith('/api/v1') ? serverUrl : `${serverUrl}/api/v1`;
  }
  return '/api/v1';
};

const BASE_URL = getBaseUrl();
const DEFAULT_TIMEOUT_MS = 30000;

export const SESSION_EXPIRED_EVENT = 'apsonic:session-expired';

export class ApiError extends Error {
  public status: number;
  public details?: ApiErrorResponse;

  constructor(message: string, status: number, details?: ApiErrorResponse) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

export interface RequestOptions extends RequestInit {
  requiresAuth?: boolean;
  retryCount?: number;
  retryDelay?: number;
  timeoutMs?: number;
  cancelId?: string;
  /** Skip reportError for calls the caller already expects to fail and handles via fallback data. */
  silent?: boolean;
}

// Track active AbortControllers to support request cancellation
const activeRequests = new Map<string, AbortController>();

export const cancelRequest = (cancelId: string) => {
  const controller = activeRequests.get(cancelId);
  if (controller) {
    controller.abort();
    activeRequests.delete(cancelId);
  }
};

interface RefreshWaiter {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}

let isRefreshing = false;
let refreshQueue: RefreshWaiter[] = [];

// Settles every request that queued up behind an in-flight refresh.
function settleRefreshQueue(outcome: { token: string } | { error: unknown }) {
  const waiters = refreshQueue;
  refreshQueue = [];
  for (const waiter of waiters) {
    if ('token' in outcome) {
      waiter.resolve(outcome.token);
    } else {
      waiter.reject(outcome.error);
    }
  }
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function notifySessionExpired() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(SESSION_EXPIRED_EVENT));
  }
}

// The refresh token itself is an httpOnly cookie the browser attaches
// automatically - nothing to read or send from JS here.
async function performRefresh(): Promise<string> {
  const refreshRes = await fetch(`${BASE_URL}/auth/refresh`, {
    method: 'POST',
    credentials: 'include',
    signal: AbortSignal.timeout(DEFAULT_TIMEOUT_MS),
  });

  if (!refreshRes.ok) {
    throw new ApiError('Session expired', 401);
  }

  const refreshData = await refreshRes.json().catch(() => ({}));
  const newToken: string | undefined = refreshData?.data?.accessToken;
  if (!newToken) {
    throw new ApiError('Invalid refresh response payload', 401);
  }
  tokenStorage.setAccessToken(newToken);
  return newToken;
}

export async function apiClient<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  const {
    requiresAuth = true,
    retryCount = 2,
    retryDelay = 1000,
    timeoutMs = DEFAULT_TIMEOUT_MS,
    cancelId,
    silent = false,
    headers: customHeaders,
    ...restOptions
  } = options;

  const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint}`;

  let cancelController: AbortController | undefined;
  if (cancelId) {
    cancelRequest(cancelId);
    cancelController = new AbortController();
    activeRequests.set(cancelId, cancelController);
  }

  const signals: AbortSignal[] = [AbortSignal.timeout(timeoutMs)];
  if (cancelController) signals.push(cancelController.signal);
  if (restOptions.signal) signals.push(restOptions.signal);
  const signal = AbortSignal.any(signals);

  const headers = new Headers(customHeaders);
  if (!headers.has('Content-Type') && !(restOptions.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  if (requiresAuth) {
    const token = tokenStorage.getAccessToken();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
  }

  const doFetch = () =>
    fetch(url, { ...restOptions, headers, credentials: 'include', signal });

  const fetchWithRetry = async (attempt: number): Promise<Response> => {
    try {
      return await doFetch();
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw error;
      }
      if (attempt < retryCount) {
        await sleep(retryDelay * attempt);
        return fetchWithRetry(attempt + 1);
      }
      throw error;
    }
  };

  try {
    let response = await fetchWithRetry(1);

    if (response.status === 401 && requiresAuth) {
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const newToken = await performRefresh();
          isRefreshing = false;
          settleRefreshQueue({ token: newToken });
          headers.set('Authorization', `Bearer ${newToken}`);
          response = await doFetch();
        } catch (refreshError) {
          isRefreshing = false;
          settleRefreshQueue({ error: refreshError });
          tokenStorage.clearAll();
          notifySessionExpired();
          throw refreshError instanceof ApiError
            ? refreshError
            : new ApiError('Session expired', 401);
        }
      } else {
        const newToken = await new Promise<string>((resolve, reject) => {
          refreshQueue.push({ resolve, reject });
        });
        headers.set('Authorization', `Bearer ${newToken}`);
        response = await doFetch();
      }
    }

    if (cancelId) {
      activeRequests.delete(cancelId);
    }

    if (!response.ok) {
      let errorData: ApiErrorResponse | undefined;
      try {
        errorData = await response.json();
      } catch {}

      const errorMessage = errorData?.message || `HTTP error ${response.status}: ${response.statusText}`;
      throw new ApiError(errorMessage, response.status, errorData);
    }

    return (await response.json()) as ApiResponse<T>;
  } catch (error) {
    if (cancelId) {
      activeRequests.delete(cancelId);
    }
    if (error instanceof ApiError) {
      throw error;
    }
    if (error instanceof Error && error.name === 'AbortError') {
      throw new ApiError('Request cancelled', 499);
    }

    if (!silent) {
      reportError(error, { endpoint });
    }
    throw new ApiError(
      error instanceof Error ? error.message : 'Network request failed',
      500
    );
  }
}
