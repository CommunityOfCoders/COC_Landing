// This file is for server-side Supabase operations only
import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Lazy initialization to avoid build-time errors
// Environment variables are validated at runtime when the client is first used
let supabaseAdminInstance: SupabaseClient | null = null

function initSupabaseAdmin(): SupabaseClient {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing required Supabase environment variables. Please check your .env file.')
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}

// Export a proxy that lazily initializes the client on first access
export const supabaseAdmin = new Proxy({} as SupabaseClient, {
  get: (_, prop) => {
    if (!supabaseAdminInstance) {
      supabaseAdminInstance = initSupabaseAdmin()
    }
    return (supabaseAdminInstance as any)[prop]
  }
})

// Also export the getter function for explicit initialization
export { initSupabaseAdmin as getSupabaseAdmin }
