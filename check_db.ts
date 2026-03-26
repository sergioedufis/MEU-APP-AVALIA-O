import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://kgjxxjgcdjjbjgnvbtcy.supabase.co';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_mFPwlGlLZbEMeC9VlOCt-w_ySZz-KWd';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function check() {
  const { data, error } = await supabase.from('students').select('id').limit(1);
  console.log("Students check:", { data, error });
}
check();
