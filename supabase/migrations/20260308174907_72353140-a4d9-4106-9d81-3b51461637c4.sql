
-- Junction table for many-to-many characters <-> races
CREATE TABLE public.character_races (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  character_id uuid NOT NULL REFERENCES public.characters(id) ON DELETE CASCADE,
  race_id uuid NOT NULL REFERENCES public.races(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(character_id, race_id)
);

ALTER TABLE public.character_races ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read character_races" ON public.character_races FOR SELECT USING (true);
CREATE POLICY "Admins manage character_races" ON public.character_races FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Migrate existing race_id data
INSERT INTO public.character_races (character_id, race_id)
SELECT id, race_id FROM public.characters WHERE race_id IS NOT NULL
ON CONFLICT DO NOTHING;
