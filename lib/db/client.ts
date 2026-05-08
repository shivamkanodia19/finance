import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let _client: SupabaseClient | null = null

export function getSupabase(): SupabaseClient {
  if (_client) return _client
  const supabaseUrl = process.env.SUPABASE_URL ?? ''
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_ANON_KEY ?? ''
  _client = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { persistSession: false },
  })
  return _client
}

// Convenience proxy — works the same as before in route handlers,
// but defers createClient() until first property access (runtime only).
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    return (getSupabase() as unknown as Record<string | symbol, unknown>)[prop]
  },
})
