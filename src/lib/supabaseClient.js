import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
        '❌ Missing Supabase environment variables!\n\n' +
        'Please create a .env file in the root directory with:\n' +
        'VITE_SUPABASE_URL=your_supabase_url\n' +
        'VITE_SUPABASE_ANON_KEY=your_anon_key\n\n' +
        'See .env.example for more details.'
    )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
