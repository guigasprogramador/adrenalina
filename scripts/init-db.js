import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
config({ path: join(__dirname, '..', '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const leaders = [
  { leader_id: 'Ad', name: 'Bps. Marcos e Laura', meta: 0, completed: 2, percentage: 100, active: true },
  { leader_id: 'Ad01', name: 'Dc Arthur e Priscilla', meta: 2, completed: 3, percentage: 150, active: true },
  { leader_id: 'Ad02', name: 'Miss Fábio e Patricia', meta: 6, completed: 0, percentage: 0, active: true },
  { leader_id: 'Ad03', name: 'Dc Estevão e Thais', meta: 2, completed: 2, percentage: 100, active: true },
  { leader_id: 'Ad04', name: 'Dc Carlos e Leila', meta: 2, completed: 0, percentage: 0, active: true },
  { leader_id: 'Ad05', name: 'Ob Gabriel e Carla', meta: 2, completed: 0, percentage: 0, active: true },
  { leader_id: 'Ad06', name: 'Ob Guilherme e Elizabete', meta: 2, completed: 0, percentage: 0, active: true },
  { leader_id: 'Ad07', name: 'Miss Gabriel e Monisy', meta: 70, completed: 44, percentage: 63, active: true },
  { leader_id: 'Ad08', name: 'Dc Gabriel e Ana Beatriz', meta: 14, completed: 5, percentage: 36, active: true },
  { leader_id: 'Ad09', name: 'João Gabriel e Julyana', meta: 5, completed: 4, percentage: 80, active: true },
  { leader_id: 'Ad10', name: 'Elias e Andressa', meta: 2, completed: 0, percentage: 0, active: true },
  { leader_id: 'Ad11', name: 'Joel e Joice', meta: 2, completed: 0, percentage: 0, active: true },
  { leader_id: 'Ad12', name: 'Pr Didacio', meta: 0, completed: 0, percentage: 0, active: true },
  { leader_id: 'Ad14', name: 'Dc Israel e Priscylla', meta: 2, completed: 0, percentage: 0, active: true },
  { leader_id: 'Ad15', name: 'Miss Marcus e Giselle', meta: 83, completed: 30, percentage: 36, active: true },
  { leader_id: 'Ad16', name: 'Diac Wagmar e Simone', meta: 2, completed: 0, percentage: 0, active: true },
  { leader_id: 'Ad17', name: 'Ob. Michael e Pri Sene', meta: 0, completed: 0, percentage: 0, active: true },
  { leader_id: 'Ad18', name: 'Ob Nilton e Ana', meta: 7, completed: 7, percentage: 100, active: true },
  { leader_id: 'Ad19', name: 'Dc Paula Gaston', meta: 10, completed: 6, percentage: 60, active: true },
  { leader_id: 'Ad20', name: 'Ob. Adelton e Flávia', meta: 2, completed: 0, percentage: 0, active: true },
  { leader_id: 'Ad21', name: 'Dc. Israel e Paula', meta: 2, completed: 0, percentage: 0, active: true },
  { leader_id: 'Ad22', name: 'Ob Júnior e Madhara', meta: 6, completed: 5, percentage: 83, active: true },
  { leader_id: 'Ad23', name: 'João e Eloiza', meta: 2, completed: 2, percentage: 100, active: true },
  { leader_id: 'Ad24', name: 'Ob. Flávio e Gisely', meta: 8, completed: 8, percentage: 100, active: true },
  { leader_id: 'Ad25', name: 'Prs Alessandro e Kamila', meta: 2, completed: 2, percentage: 100, active: true },
  { leader_id: 'Ad26', name: 'Prs Rafael e Ananda', meta: 0, completed: 2, percentage: 100, active: true }
];

async function initDatabase() {
  try {
    console.log('Creating leaders table...');
    
    // Create the table using raw SQL through the REST API
    const { error: tableError } = await supabase
      .from('leaders')
      .select('*')
      .limit(1);

    if (tableError && tableError.code === '42P01') { // Table doesn't exist
      const { error: createError } = await supabase
        .from('leaders')
        .create({
          columns: [
            { name: 'leader_id', type: 'text', is_primary_key: true },
            { name: 'name', type: 'text' },
            { name: 'meta', type: 'integer' },
            { name: 'completed', type: 'integer' },
            { name: 'percentage', type: 'integer' },
            { name: 'active', type: 'boolean' }
          ]
        });

      if (createError) {
        console.error('Error creating table:', createError);
        return;
      }
    }

    console.log('Table exists or was created successfully');
    console.log('Inserting leader data...');

    // First, let's clear any existing data
    const { error: deleteError } = await supabase
      .from('leaders')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all rows

    if (deleteError) {
      console.error('Error clearing existing data:', deleteError);
      return;
    }

    // Insert the data in batches to avoid rate limits
    for (let i = 0; i < leaders.length; i += 10) {
      const batch = leaders.slice(i, i + 10);
      const { error: insertError } = await supabase
        .from('leaders')
        .upsert(batch, { 
          onConflict: 'leader_id',
          ignoreDuplicates: false
        });
      
      if (insertError) {
        console.error('Error inserting batch:', insertError);
        return;
      }
      
      console.log(`Inserted batch ${Math.floor(i / 10) + 1} of ${Math.ceil(leaders.length / 10)}`);
    }

    // Verify the data was inserted
    const { data: insertedData, error: verifyError } = await supabase
      .from('leaders')
      .select('*')
      .order('leader_id');

    if (verifyError) {
      console.error('Error verifying data:', verifyError);
      return;
    }

    console.log(`Successfully inserted ${insertedData.length} leaders`);

  } catch (error) {
    console.error('Error initializing database:', error);
  } finally {
    process.exit();
  }
}

initDatabase();
