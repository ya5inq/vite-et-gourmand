import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { toast } from 'sonner';
import {
  getAdminApiCollection,
  getProtectedApiCollection,
  getPublicApiCollection,
} from '@vite-et-gourmand/sdk';

const baseURL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api';

const ACCESS_TOKEN_STORAGE_KEY = 'veg_bo_access_token';

/**
 * The access token is persisted in localStorage. This is required because the
 * backend's refresh endpoint expects the (possibly expired) access token in the
 * request body in addition to the httpOnly refresh cookie. Keeping the last
 * token around lets us recover the session after a full page reload by passing
 * it to /public/auth/refresh, which ignores its expiration.
 */
let accessToken: string | null =
  typeof localStorage !== 'undefined' ? localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY) : null;

export const setAccessToken = (token: string | null): void => {
  accessToken = token;
  if (typeof localStorage === 'undefined') return;
  if (token) {
    localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, token);
  } else {
    localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
  }
};

export const getAccessToken = (): string | null => accessToken;

/**
 * The SDK collections already prefix every path with `/api/...`, so the axios
 * baseURL must NOT include `/api`. We strip a trailing `/api` from VITE_API_URL
 * to keep the env var human-friendly (it can point at `.../api`).
 */
const normalizedBaseURL = baseURL.replace(/\/api\/?$/, '');

export const axiosInstance = axios.create({
  baseURL: normalizedBaseURL,
  withCredentials: true,
});

axiosInstance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (accessToken) {
    config.headers.set('Authorization', `Bearer ${accessToken}`);
  }
  return config;
});

/**
 * A bare axios instance (no interceptors) used to call the refresh endpoint,
 * avoiding an infinite 401 loop when the refresh request itself returns 401.
 */
const refreshClient = axios.create({
  baseURL: normalizedBaseURL,
  withCredentials: true,
});

/**
 * Exchange the current (possibly expired) access token + httpOnly refresh cookie
 * for a fresh access token. Returns null if no token is available or the refresh
 * fails (e.g. the cookie expired / the user is not logged in).
 */
const refreshAccessToken = async (): Promise<string | null> => {
  if (!accessToken) {
    return null;
  }
  try {
    const { data } = await refreshClient.post<{ accessToken: string }>(
      '/api/public/auth/refresh',
      { accessToken },
    );
    setAccessToken(data.accessToken);
    return data.accessToken;
  } catch {
    setAccessToken(null);
    return null;
  }
};

type RetriableConfig = InternalAxiosRequestConfig & { _retry?: boolean };

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<{ message?: string }>) => {
    const original = error.config as RetriableConfig | undefined;
    const status = error.response?.status;

    // On 401, attempt a single refresh (old token in body + cookie) then replay.
    const isRefreshCall = original?.url?.includes('/public/auth/refresh');
    if (status === 401 && original && !original._retry && !isRefreshCall) {
      original._retry = true;
      const newToken = await refreshAccessToken();
      if (newToken) {
        original.headers.set('Authorization', `Bearer ${newToken}`);
        return axiosInstance(original);
      }
    }

    // Surface the (FR-translated) backend message via a toast.
    const message = error.response?.data?.message;
    if (message && status !== 401) {
      toast.error(message);
    }

    return Promise.reject(error);
  },
);

export { refreshAccessToken };

export const PublicApi = getPublicApiCollection(axiosInstance);
export const ProtectedApi = getProtectedApiCollection(axiosInstance);
export const AdminApi = getAdminApiCollection(axiosInstance);
