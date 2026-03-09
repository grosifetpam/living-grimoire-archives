
-- Fix: Recreate all public read policies as PERMISSIVE (not RESTRICTIVE)

-- site_settings
DROP POLICY IF EXISTS "Public read site_settings" ON public.site_settings;
CREATE POLICY "Public read site_settings" ON public.site_settings AS PERMISSIVE FOR SELECT TO anon, authenticated USING (true);

-- universes
DROP POLICY IF EXISTS "Public read universes" ON public.universes;
CREATE POLICY "Public read universes" ON public.universes AS PERMISSIVE FOR SELECT TO anon, authenticated USING (true);

-- characters
DROP POLICY IF EXISTS "Public read characters" ON public.characters;
CREATE POLICY "Public read characters" ON public.characters AS PERMISSIVE FOR SELECT TO anon, authenticated USING (true);

-- races
DROP POLICY IF EXISTS "Public read races" ON public.races;
CREATE POLICY "Public read races" ON public.races AS PERMISSIVE FOR SELECT TO anon, authenticated USING (true);

-- factions
DROP POLICY IF EXISTS "Public read factions" ON public.factions;
CREATE POLICY "Public read factions" ON public.factions AS PERMISSIVE FOR SELECT TO anon, authenticated USING (true);

-- timeline_events
DROP POLICY IF EXISTS "Public read events" ON public.timeline_events;
CREATE POLICY "Public read events" ON public.timeline_events AS PERMISSIVE FOR SELECT TO anon, authenticated USING (true);

-- creatures
DROP POLICY IF EXISTS "Public read creatures" ON public.creatures;
CREATE POLICY "Public read creatures" ON public.creatures AS PERMISSIVE FOR SELECT TO anon, authenticated USING (true);

-- locations
DROP POLICY IF EXISTS "Public read locations" ON public.locations;
CREATE POLICY "Public read locations" ON public.locations AS PERMISSIVE FOR SELECT TO anon, authenticated USING (true);

-- character_factions
DROP POLICY IF EXISTS "Public read character_factions" ON public.character_factions;
CREATE POLICY "Public read character_factions" ON public.character_factions AS PERMISSIVE FOR SELECT TO anon, authenticated USING (true);

-- character_races
DROP POLICY IF EXISTS "Public read character_races" ON public.character_races;
CREATE POLICY "Public read character_races" ON public.character_races AS PERMISSIVE FOR SELECT TO anon, authenticated USING (true);
