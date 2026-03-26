import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL || 'https://kgjxxjgcdjjbjgnvbtcy.supabase.co';
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_mFPwlGlLZbEMeC9VlOCt-w_ySZz-KWd';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
