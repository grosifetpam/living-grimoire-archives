import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Non autorisé" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabaseAnon = Deno.env.get("SUPABASE_ANON_KEY")!;

    // Verify user is admin
    const userClient = createClient(supabaseUrl, supabaseAnon, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user }, error: userErr } = await userClient.auth.getUser();
    if (userErr || !user) {
      return new Response(JSON.stringify({ error: "Non autorisé" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const adminClient = createClient(supabaseUrl, supabaseServiceKey);
    const { data: roleData } = await adminClient.from("user_roles").select("role").eq("user_id", user.id).eq("role", "admin").single();
    if (!roleData) {
      return new Response(JSON.stringify({ error: "Admin requis" }), { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Export all tables
    const tables = ["universes", "characters", "races", "factions", "timeline_events", "locations", "creatures", "site_settings", "character_races", "character_factions"];
    const exportData: Record<string, unknown[]> = {};

    for (const table of tables) {
      const { data, error } = await adminClient.from(table).select("*");
      if (error) throw new Error(`Erreur table ${table}: ${error.message}`);
      exportData[table] = data || [];
    }

    // List all files in storage bucket "images"
    const imageFiles: { path: string; url: string }[] = [];
    const folders = ["universes", "covers", "maps", "oracle-cards", "oracle-cards-universes", "music", "section-covers", "characters", "creatures", "races", "factions"];
    
    for (const folder of folders) {
      const { data: files } = await adminClient.storage.from("images").list(folder, { limit: 1000 });
      if (files) {
        for (const file of files) {
          if (file.name) {
            const path = `${folder}/${file.name}`;
            const { data: urlData } = adminClient.storage.from("images").getPublicUrl(path);
            imageFiles.push({ path, url: urlData.publicUrl });
          }
        }
      }
    }

    const result = {
      version: "1.0",
      exported_at: new Date().toISOString(),
      data: exportData,
      storage_files: imageFiles,
    };

    return new Response(JSON.stringify(result, null, 2), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
