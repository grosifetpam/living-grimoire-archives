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

const fetchAll = <T,>(table: string) => async (): Promise<T[]> => {
  const { data, error } = await supabase.from(table).select("*");
  if (error) throw error;
  return (data ?? []) as T[];
};

export const useUniverses = () => useQuery({ queryKey: ["universes"], queryFn: fetchAll<Universe>("universes") });
export const useCharacters = () => useQuery({ queryKey: ["characters"], queryFn: fetchAll<Character>("characters") });
export const useRaces = () => useQuery({ queryKey: ["races"], queryFn: fetchAll<Race>("races") });
export const useFactions = () => useQuery({ queryKey: ["factions"], queryFn: fetchAll<Faction>("factions") });
export const useTimelineEvents = () => useQuery({ queryKey: ["timeline_events"], queryFn: fetchAll<TimelineEvent>("timeline_events") });
export const useLocations = () => useQuery({ queryKey: ["locations"], queryFn: fetchAll<Location>("locations") });
export const useCreatures = () => useQuery({ queryKey: ["creatures"], queryFn: fetchAll<Creature>("creatures") });

export const useUpsert = (table: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (record: Record<string, unknown>) => {
      const { error } = await supabase.from(table).upsert(record as any);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: [table] }),
  });
};

export const useDelete = (table: string) => {
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
