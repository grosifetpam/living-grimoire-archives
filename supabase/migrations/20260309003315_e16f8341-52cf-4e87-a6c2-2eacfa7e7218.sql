
-- 1. Drop the handle_new_user function (trigger already removed)
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

-- 2. Fix all content tables: drop RESTRICTIVE public read, add PERMISSIVE public read
-- universes
DROP POLICY IF EXISTS "Public read universes" ON public.universes;
CREATE POLICY "Public read universes" ON public.universes FOR SELECT TO anon, authenticated USING (true);

-- characters
DROP POLICY IF EXISTS "Public read characters" ON public.characters;
CREATE POLICY "Public read characters" ON public.characters FOR SELECT TO anon, authenticated USING (true);

-- races
DROP POLICY IF EXISTS "Public read races" ON public.races;
CREATE POLICY "Public read races" ON public.races FOR SELECT TO anon, authenticated USING (true);

-- factions
DROP POLICY IF EXISTS "Public read factions" ON public.factions;
CREATE POLICY "Public read factions" ON public.factions FOR SELECT TO anon, authenticated USING (true);

-- creatures
DROP POLICY IF EXISTS "Public read creatures" ON public.creatures;
CREATE POLICY "Public read creatures" ON public.creatures FOR SELECT TO anon, authenticated USING (true);

-- locations
DROP POLICY IF EXISTS "Public read locations" ON public.locations;
CREATE POLICY "Public read locations" ON public.locations FOR SELECT TO anon, authenticated USING (true);

-- timeline_events
DROP POLICY IF EXISTS "Public read events" ON public.timeline_events;
CREATE POLICY "Public read events" ON public.timeline_events FOR SELECT TO anon, authenticated USING (true);

-- site_settings
DROP POLICY IF EXISTS "Public read site_settings" ON public.site_settings;
CREATE POLICY "Public read site_settings" ON public.site_settings FOR SELECT TO anon, authenticated USING (true);

-- character_factions
DROP POLICY IF EXISTS "Public read character_factions" ON public.character_factions;
CREATE POLICY "Public read character_factions" ON public.character_factions FOR SELECT TO anon, authenticated USING (true);

-- character_races
DROP POLICY IF EXISTS "Public read character_races" ON public.character_races;
CREATE POLICY "Public read character_races" ON public.character_races FOR SELECT TO anon, authenticated USING (true);

-- 3. Fix user_roles: add PERMISSIVE policies
DROP POLICY IF EXISTS "Users can read own roles" ON public.user_roles;
CREATE POLICY "Users can read own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can manage roles" ON public.user_roles;
CREATE POLICY "Admins can manage roles" ON public.user_roles FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
