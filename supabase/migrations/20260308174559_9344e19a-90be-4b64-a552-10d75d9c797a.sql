
-- Junction table for many-to-many characters <-> factions
CREATE TABLE public.character_factions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  character_id uuid NOT NULL REFERENCES public.characters(id) ON DELETE CASCADE,
  faction_id uuid NOT NULL REFERENCES public.factions(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(character_id, faction_id)
);

ALTER TABLE public.character_factions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read character_factions" ON public.character_factions FOR SELECT USING (true);
CREATE POLICY "Admins manage character_factions" ON public.character_factions FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Migrate existing faction_id data
INSERT INTO public.character_factions (character_id, faction_id)
SELECT id, faction_id FROM public.characters WHERE faction_id IS NOT NULL
ON CONFLICT DO NOTHING;
