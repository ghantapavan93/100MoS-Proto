import { createClient } from '@supabase/supabase-js';

// Live Supabase Workspace Credentials
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mycvfspdxtsweqjzwbrm.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_1aXgJ2is2RzHe7AFjT0YbQ_I8turw6z';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default supabase;
