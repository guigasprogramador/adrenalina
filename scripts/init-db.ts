import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseKey = process.env.VITE_SUPABASE_KEY!;

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
    // Create the table
    const { error: createError } = await supabase.rpc('create_leaders_table');
    if (createError) throw createError;
    console.log('Table created successfully');

    // Insert the data
    const { error: insertError } = await supabase
      .from('leaders')
      .insert(leaders);
    
    if (insertError) throw insertError;
    console.log('Data inserted successfully');

  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

initDatabase();
