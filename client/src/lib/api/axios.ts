'use client';

/**
 * Browser-side axios instance + SDK collections.
 *
 * Auth model (matches the back-office pattern in back-office/src/configs/api.ts):
 * - The backend issues an `accessToken` (JWT) in the login response body, and a
 *   refresh token in an httpOnly cookie named `refreshToken`. `withCredentials`
 *   makes the browser send/receive that cookie automatically.
 * - We keep the access token in a module-level variable, mirrored to
 *   localStorage so it survives a full page reload. On 401 we transparently call
 *   the refresh endpoint (cookie-only is enough on the new backend, but we also
 *   send the stored access token in the body which the endpoint accepts) and
 *   replay the original request once.
 */

import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { toast } from 'sonner';
import {
  getProtectedApiCollection,
  getPublicApiCollection,
} from '@vite-et-gourmand/sdk';

const rawBaseURL =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080/api';

/**
 * The SDK collections already prefix every path with `/api/...`, so the axios
 * baseURL must NOT include `/api`. We strip a trailing `/api` to keep the env
 * var human-friendly (it can point at `.../api`).
 */
const normalizedBaseURL = rawBaseURL.replace(/\/api\/?$/, '');

const ACCESS_TOKEN_STORAGE_KEY = 'veg_client_access_token';

const readStoredToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
  } catch {
    return null;
  }
};

let accessToken: string | null = readStoredToken();

export const setAccessToken = (token: string | null): void => {
  accessToken = token;
  if (typeof window === 'undefined') return;
  try {
    if (token) {
      window.localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, token);
    } else {
      window.localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
    }
  } catch {
    // localStorage unavailable (private mode) - in-memory token still works.
  }
};

export const getAccessToken = (): string | null => accessToken;

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
 * Bare axios instance (no interceptors) used to call the refresh endpoint,
 * avoiding an infinite 401 loop when the refresh request itself returns 401.
 */
const refreshClient = axios.create({
  baseURL: normalizedBaseURL,
  withCredentials: true,
});

/**
 * Exchange the httpOnly refresh cookie (+ optional stored access token) for a
 * fresh access token. Returns null when not logged in / the cookie expired.
 */
export const refreshAccessToken = async (): Promise<string | null> => {
  try {
    const { data } = await refreshClient.post<{ accessToken: string }>(
      '/api/public/auth/refresh',
      accessToken ? { accessToken } : {},
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

    const isRefreshCall = original?.url?.includes('/public/auth/refresh');
    if (status === 401 && original && !original._retry && !isRefreshCall) {
      original._retry = true;
      const newToken = await refreshAccessToken();
      if (newToken) {
        original.headers.set('Authorization', `Bearer ${newToken}`);
        return axiosInstance(original);
      }
    }

    // Surface the (FR-translated) backend message via a toast, except on 401
    // which is handled by the calling component (redirect to login etc.).
    const message = error.response?.data?.message;
    if (message && status !== 401) {
      toast.error(message);
    }

    return Promise.reject(error);
  },
);

export const PublicApi = getPublicApiCollection(axiosInstance);
export const ProtectedApi = getProtectedApiCollection(axiosInstance);
