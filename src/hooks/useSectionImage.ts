import { useSiteSettings } from "./useSiteSettings";

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
  const { data: settings } = useSiteSettings();
  const key = SECTION_KEYS[section];
  if (!key || !settings) return null;
  return settings[key] || null;
}
