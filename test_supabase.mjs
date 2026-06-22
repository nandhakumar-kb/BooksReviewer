import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qlsekawmodpynohbjlum.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFsc2VrYXdtb2RweW5vaGJqbHVtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgxMTQ0MDgsImV4cCI6MjA4MzY5MDQwOH0.UuzlnlUToCYkeUG3hvUmtlFjS56ZGquh4TLIxMTmGK8';
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const { data: books, error: booksError } = await supabase.from('books').select('*');
  console.log('Books Error:', booksError);
  console.log('Books Data:', books);

  const { data: combos, error: combosError } = await supabase.from('combos').select('*');
  console.log('Combos Error:', combosError);
  console.log('Combos Data:', combos);
}

test();
