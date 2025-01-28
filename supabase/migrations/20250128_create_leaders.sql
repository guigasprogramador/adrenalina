-- Create the leaders table
CREATE TABLE IF NOT EXISTS public.leaders (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    leader_id TEXT NOT NULL,
    name TEXT NOT NULL,
    meta INTEGER NOT NULL DEFAULT 0,
    completed INTEGER NOT NULL DEFAULT 0,
    percentage INTEGER NOT NULL DEFAULT 0,
    active BOOLEAN NOT NULL DEFAULT true
);

-- Create an index on leader_id for faster lookups
CREATE INDEX IF NOT EXISTS leaders_leader_id_idx ON public.leaders(leader_id);

-- Insert initial data
INSERT INTO public.leaders (leader_id, name, meta, completed, percentage, active)
VALUES
    ('Ad', 'Bps. Marcos e Laura', 0, 2, 100, true),
    ('Ad01', 'Dc Arthur e Priscilla', 2, 3, 150, true),
    ('Ad02', 'Miss Fábio e Patricia', 6, 0, 0, true),
    ('Ad03', 'Dc Estevão e Thais', 2, 2, 100, true),
    ('Ad04', 'Dc Carlos e Leila', 2, 0, 0, true),
    ('Ad05', 'Ob Gabriel e Carla', 2, 0, 0, true),
    ('Ad06', 'Ob Guilherme e Elizabete', 2, 0, 0, true),
    ('Ad07', 'Miss Gabriel e Monisy', 70, 44, 63, true),
    ('Ad08', 'Dc Gabriel e Ana Beatriz', 14, 5, 36, true),
    ('Ad09', 'João Gabriel e Julyana', 5, 4, 80, true),
    ('Ad10', 'Elias e Andressa', 2, 0, 0, true),
    ('Ad11', 'Joel e Joice', 2, 0, 0, true),
    ('Ad12', 'Pr Didacio', 0, 0, 0, true),
    ('Ad14', 'Dc Israel e Priscylla', 2, 0, 0, true),
    ('Ad15', 'Miss Marcus e Giselle', 83, 30, 36, true),
    ('Ad16', 'Diac Wagmar e Simone', 2, 0, 0, true),
    ('Ad17', 'Ob. Michael e Pri Sene', 0, 0, 0, true),
    ('Ad18', 'Ob Nilton e Ana', 7, 7, 100, true),
    ('Ad19', 'Dc Paula Gaston', 10, 6, 60, true),
    ('Ad20', 'Ob. Adelton e Flávia', 2, 0, 0, true),
    ('Ad21', 'Dc. Israel e Paula', 2, 0, 0, true),
    ('Ad22', 'Ob Júnior e Madhara', 6, 5, 83, true),
    ('Ad23', 'João e Eloiza', 2, 2, 100, true),
    ('Ad24', 'Ob. Flávio e Gisely', 8, 8, 100, true),
    ('Ad25', 'Prs Alessandro e Kamila', 2, 2, 100, true),
    ('Ad26', 'Prs Rafael e Ananda', 0, 2, 100, true);

-- Create Row Level Security (RLS) policies
ALTER TABLE public.leaders ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations for authenticated users
CREATE POLICY "Allow all operations for authenticated users" ON public.leaders
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Create policy to allow read-only access for anonymous users
CREATE POLICY "Allow read-only access for anonymous users" ON public.leaders
    FOR SELECT
    TO anon
    USING (true);
