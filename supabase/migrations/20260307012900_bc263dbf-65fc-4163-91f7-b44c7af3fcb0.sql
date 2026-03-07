
-- Create app_role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

-- RLS for user_roles
CREATE POLICY "Users can read own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage roles" ON public.user_roles FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Timestamp function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql SET search_path = public;

-- UNIVERSES
CREATE TABLE public.universes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    era TEXT NOT NULL DEFAULT '',
    image TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.universes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read universes" ON public.universes FOR SELECT USING (true);
CREATE POLICY "Admins manage universes" ON public.universes FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER update_universes_updated_at BEFORE UPDATE ON public.universes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- RACES
CREATE TABLE public.races (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    universe_id UUID REFERENCES public.universes(id) ON DELETE CASCADE NOT NULL,
    traits TEXT[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.races ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read races" ON public.races FOR SELECT USING (true);
CREATE POLICY "Admins manage races" ON public.races FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER update_races_updated_at BEFORE UPDATE ON public.races FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- FACTIONS
CREATE TABLE public.factions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    universe_id UUID REFERENCES public.universes(id) ON DELETE CASCADE NOT NULL,
    member_count INT NOT NULL DEFAULT 0,
    motto TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.factions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read factions" ON public.factions FOR SELECT USING (true);
CREATE POLICY "Admins manage factions" ON public.factions FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER update_factions_updated_at BEFORE UPDATE ON public.factions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- CHARACTERS
CREATE TABLE public.characters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    title TEXT NOT NULL DEFAULT '',
    universe_id UUID REFERENCES public.universes(id) ON DELETE CASCADE NOT NULL,
    race_id UUID REFERENCES public.races(id) ON DELETE SET NULL,
    faction_id UUID REFERENCES public.factions(id) ON DELETE SET NULL,
    backstory TEXT NOT NULL DEFAULT '',
    stats JSONB NOT NULL DEFAULT '{"force":5,"agilite":5,"intelligence":5,"magie":5,"charisme":5}',
    image TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.characters ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read characters" ON public.characters FOR SELECT USING (true);
CREATE POLICY "Admins manage characters" ON public.characters FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER update_characters_updated_at BEFORE UPDATE ON public.characters FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- TIMELINE EVENTS
CREATE TABLE public.timeline_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    year INT NOT NULL,
    era TEXT NOT NULL DEFAULT '',
    title TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    universe_id UUID REFERENCES public.universes(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.timeline_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read events" ON public.timeline_events FOR SELECT USING (true);
CREATE POLICY "Admins manage events" ON public.timeline_events FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON public.timeline_events FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- LOCATIONS
CREATE TABLE public.locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    universe_id UUID REFERENCES public.universes(id) ON DELETE CASCADE NOT NULL,
    type TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read locations" ON public.locations FOR SELECT USING (true);
CREATE POLICY "Admins manage locations" ON public.locations FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER update_locations_updated_at BEFORE UPDATE ON public.locations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- CREATURES
CREATE TABLE public.creatures (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    danger_level INT NOT NULL DEFAULT 1 CHECK (danger_level BETWEEN 1 AND 5),
    universe_id UUID REFERENCES public.universes(id) ON DELETE CASCADE NOT NULL,
    habitat TEXT NOT NULL DEFAULT '',
    abilities TEXT[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.creatures ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read creatures" ON public.creatures FOR SELECT USING (true);
CREATE POLICY "Admins manage creatures" ON public.creatures FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER update_creatures_updated_at BEFORE UPDATE ON public.creatures FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-assign first user as admin
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  IF (SELECT COUNT(*) FROM public.user_roles) = 0 THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
