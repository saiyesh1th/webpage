
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://qfdheunuuuvgyzztzwjd.supabase.co'
const supabaseKey = 'sb_publishable_6O1fSM-pl6HNpJU7Axjhdw_7mQO3X2U'

export const supabase = createClient(supabaseUrl, supabaseKey)
