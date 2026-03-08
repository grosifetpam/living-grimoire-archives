import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

type Universe = Tables<"universes">;
type Character = Tables<"characters">;
type Race = Tables<"races">;
type Faction = Tables<"factions">;
type TimelineEvent = Tables<"timeline_events">;
type Location = Tables<"locations">;
type Creature = Tables<"creatures">;

export const useUniverses = () => useQuery({ queryKey: ["universes"], queryFn: async () => {
  const { data, error } = await supabase.from("universes").select("*");
  if (error) throw error; return data;
}});

export const useCharacters = () => useQuery({ queryKey: ["characters"], queryFn: async () => {
  const { data, error } = await supabase.from("characters").select("*");
  if (error) throw error; return data;
}});

export const useRaces = () => useQuery({ queryKey: ["races"], queryFn: async () => {
  const { data, error } = await supabase.from("races").select("*");
  if (error) throw error; return data;
}});

export const useFactions = () => useQuery({ queryKey: ["factions"], queryFn: async () => {
  const { data, error } = await supabase.from("factions").select("*");
  if (error) throw error; return data;
}});

export const useTimelineEvents = () => useQuery({ queryKey: ["timeline_events"], queryFn: async () => {
  const { data, error } = await supabase.from("timeline_events").select("*");
  if (error) throw error; return data;
}});

export const useLocations = () => useQuery({ queryKey: ["locations"], queryFn: async () => {
  const { data, error } = await supabase.from("locations").select("*");
  if (error) throw error; return data;
}});

export const useCreatures = () => useQuery({ queryKey: ["creatures"], queryFn: async () => {
  const { data, error } = await supabase.from("creatures").select("*");
  if (error) throw error; return data;
}});

// Many-to-many: character <-> factions
export const useCharacterFactions = () => useQuery({ queryKey: ["character_factions"], queryFn: async () => {
  const { data, error } = await supabase.from("character_factions").select("*");
  if (error) throw error; return data as { id: string; character_id: string; faction_id: string }[];
}});

export const useSetCharacterFactions = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ characterId, factionIds }: { characterId: string; factionIds: string[] }) => {
      // Delete existing
      const { error: delErr } = await supabase.from("character_factions").delete().eq("character_id", characterId);
      if (delErr) throw delErr;
      // Insert new
      if (factionIds.length > 0) {
        const rows = factionIds.map(fid => ({ character_id: characterId, faction_id: fid }));
        const { error: insErr } = await supabase.from("character_factions").insert(rows);
        if (insErr) throw insErr;
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["character_factions"] }),
  });
};

export const useUpsert = (table: "universes" | "characters" | "races" | "factions" | "timeline_events" | "locations" | "creatures") => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (record: Record<string, unknown>) => {
      const { error } = await supabase.from(table).upsert(record as any);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: [table] }),
  });
};

export const useDelete = (table: "universes" | "characters" | "races" | "factions" | "timeline_events" | "locations" | "creatures") => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from(table).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: [table] }),
  });
};

export type { Universe, Character, Race, Faction, TimelineEvent, Location, Creature };
