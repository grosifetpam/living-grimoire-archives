import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const SECTION_KEYS: Record<string, string> = {
  univers: "section_image_univers",
  personnages: "section_image_personnages",
  races: "section_image_races",
  factions: "section_image_factions",
  chronologie: "section_image_chronologie",
  lieux: "section_image_lieux",
  bestiaire: "section_image_bestiaire",
  cartes: "section_image_cartes",
};

export const SECTION_IMAGE_KEYS = SECTION_KEYS;

export function useSectionImage(section: string) {
  const [image, setImage] = useState<string | null>(null);

  useEffect(() => {
    const key = SECTION_KEYS[section];
    if (!key) return;
    supabase
      .from("site_settings")
      .select("value")
      .eq("key", key)
      .single()
      .then(({ data }) => {
        if (data?.value) setImage(data.value);
      });
  }, [section]);

  return image;
}
