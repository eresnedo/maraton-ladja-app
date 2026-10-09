import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Dok .env.local nije postavljen (vidi .env.local.example), klijent ostaje null —
// stranice koje čitaju iz baze padaju natrag na ugrađeni (seed) sadržaj umjesto da ruše build.
export const supabase: SupabaseClient | null =
  supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;
