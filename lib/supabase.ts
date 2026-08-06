import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ckyykcinppmjfegcwhgt.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_Y84qGknYy3lEu9aCwAMYKw_5XDiCaqm';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
