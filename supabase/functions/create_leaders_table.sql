CREATE OR REPLACE FUNCTION create_leaders_table()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
    -- Create the leaders table if it doesn't exist
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

    -- Enable Row Level Security (RLS)
    ALTER TABLE public.leaders ENABLE ROW LEVEL SECURITY;

    -- Create policy to allow all operations for authenticated users
    DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON public.leaders;
    CREATE POLICY "Allow all operations for authenticated users" ON public.leaders
        FOR ALL
        TO authenticated
        USING (true)
        WITH CHECK (true);

    -- Create policy to allow read-only access for anonymous users
    DROP POLICY IF EXISTS "Allow read-only access for anonymous users" ON public.leaders;
    CREATE POLICY "Allow read-only access for anonymous users" ON public.leaders
        FOR SELECT
        TO anon
        USING (true);
END;
$$;
