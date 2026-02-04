import { createServerClient as createSSRClient, type CookieMethods } from '@supabase/ssr';
import type { Database } from './database.types';

export function createServerClient(cookies: CookieMethods) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables');
  }

  return createSSRClient<Database>(supabaseUrl, supabaseAnonKey, { cookies });
}
