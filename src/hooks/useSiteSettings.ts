import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useSiteSettings() {
  return useQuery({
    queryKey: ["site_settings"],
    queryFn: async () => {
      const { data, error } = await supabase.from("site_settings").select("key, value");
      if (error) throw error;
      const map: Record<string, string> = {};
      for (const r of data || []) {
        if (r.key && r.value) map[r.key] = r.value;
      }
      return map;
    },
  });
}

export function useSaveSiteSetting() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ key, value }: { key: string; value: string }) => {
      const { data: existing } = await supabase.from("site_settings").select("id").eq("key", key).single();
      if (existing) {
        const { error } = await supabase.from("site_settings").update({ value }).eq("key", key);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("site_settings").insert({ key, value } as any);
        if (error) throw error;
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["site_settings"] }),
  });
}
