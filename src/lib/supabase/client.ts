/**
 * @file This file is responsible for creating a Supabase client for the browser.
 * It uses the createBrowserClient function from the @supabase/ssr package.
 */

'use client';

import { createBrowserClient as _createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/lib/database.types';

// =================================================================================
// IMPORTANT: Add your Supabase Project Credentials here!
// =================================================================================
// 1. Go to your Supabase project dashboard.
// 2. Navigate to Settings > API.
// 3. Under "Project URL", copy the URL and paste it here.
// 4. Under "Project API Keys", copy the "anon" public key and paste it here.
// =================================================================================
const supabaseUrl = 'https://your-project-url.supabase.co'; // Replace with your Project URL
const supabaseAnonKey = 'your-anon-key'; // Replace with your "anon" public key

// =================================================================================

// Note: The client is created as a singleton pattern.
// This ensures that the same client instance is used across the application.
let client: ReturnType<typeof _createBrowserClient<Database>> | undefined;

/**
 * Creates a Supabase client for the browser.
 *
 * If a client instance already exists, it returns the existing instance.
 * Otherwise, it creates a new client instance and returns it.
 *
 * @returns {SupabaseClient<Database>} A Supabase client instance.
 */
export function createBrowserClient() {
  if (client) {
    return client;
  }

  if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('your-project-url')) {
    throw new Error(
      'Supabase URL and anonymous key must be provided in src/lib/supabase/client.ts. Please update the placeholder values.'
    );
  }

  // Create, store, and return the client instance.
  client = _createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
  return client;
}
