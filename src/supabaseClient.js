
// import { createClient } from '@supabase/supabase-js';

// const SUPABASE_URL = "https://jooyvqksiptedgcykrvo.supabase.co";
// const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impvb3l2cWtzaXB0ZWRnY3lrcnZvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEzNDMxODQsImV4cCI6MjA1NjkxOTE4NH0.sBtdAGS0TCs8yGD4usqRM5oUiufHwlLWlGMtJj1y-l8";

// export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gsmnqoiptjdogsyeabfc.supabase.co'; // <-- Pon aquí tu URL
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdzbW5xb2lwdGpkb2dzeWVhYmZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAwNDMwMjYsImV4cCI6MjA1NTYxOTAyNn0.xegJ9w2AgVpGVxaRugxjXZvdqxgkBLWdylNvIT4RvX8';                 // <-- Pon aquí tu API Key


export const supabase = createClient(supabaseUrl, supabaseKey);
