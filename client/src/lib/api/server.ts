import 'server-only';

/**
 * Server-side (SSR / Server Components) axios instances + SDK collections.
 *
 * Two helpers are exposed:
 * - getServerPublicApi(): no auth, used for public SSR data (menus, CMS, reviews,
 *   footer, operating hours). Plain axios pointed at the backend.
 * - getServerProtectedApi(): reads the httpOnly `refreshToken` cookie via
 *   next/headers, exchanges it for a fresh access token by calling the public
 *   refresh endpoint (which works cookie-only on the new backend), then returns
 *   a ProtectedApi collection authorized with that token. Returns null when the
 *   user is not authenticated (no cookie / refresh failed).
 *
 * All SSR fetches disable caching so dynamic data is never stale.
 */

import axios, { type AxiosInstance } from 'axios';
import { cookies } from 'next/headers';
import {
  getProtectedApiCollection,
  getPublicApiCollection,
} from '@vite-et-gourmand/sdk';

const REFRESH_COOKIE_NAME = 'refreshToken';

const rawBaseURL =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080/api';

// The SDK already prefixes paths with `/api`, so strip a trailing `/api`.
const normalizedBaseURL = rawBaseURL.replace(/\/api\/?$/, '');

const createServerAxios = (headers?: Record<string, string>): AxiosInstance =>
  axios.create({
    baseURL: normalizedBaseURL,
    withCredentials: true,
    headers,
    // Never let the browser/Next data cache hold stale SSR data.
    // (axios doesn't cache, but this keeps intent explicit for fetch adapters.)
  });

export const getServerPublicApi = () => {
  const instance = createServerAxios();
  return getPublicApiCollection(instance);
};

/**
 * Build an authenticated ProtectedApi collection for the current request, or
 * null if the visitor has no valid refresh session.
 */
export const getServerProtectedApi = async () => {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get(REFRESH_COOKIE_NAME)?.value;

  if (!refreshToken) {
    return null;
  }

  // Relay the refresh cookie to the backend to obtain a fresh access token.
  const refreshAxios = createServerAxios({
    Cookie: `${REFRESH_COOKIE_NAME}=${refreshToken}`,
  });

  let accessToken: string;
  try {
    const { data } = await refreshAxios.post<{ accessToken: string }>(
      '/api/public/auth/refresh',
      {},
    );
    accessToken = data.accessToken;
  } catch {
    return null;
  }

  const authedAxios = createServerAxios({
    Authorization: `Bearer ${accessToken}`,
    Cookie: `${REFRESH_COOKIE_NAME}=${refreshToken}`,
  });

  return getProtectedApiCollection(authedAxios);
};
