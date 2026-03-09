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

    // Verify admin
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

    const body = await req.json();
    const { data: importData, storage_files, clear_before_import } = body;

    if (!importData) {
      return new Response(JSON.stringify({ error: "Données manquantes" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const log: string[] = [];

    // Order matters for foreign keys - delete in reverse, insert in order
    const orderedTables = ["universes", "races", "factions", "characters", "timeline_events", "locations", "creatures", "site_settings", "character_races", "character_factions"];
    const deleteOrder = ["character_races", "character_factions", "characters", "creatures", "timeline_events", "locations", "factions", "races", "site_settings", "universes"];

    // Clear existing data if requested
    if (clear_before_import) {
      for (const table of deleteOrder) {
        const { error } = await adminClient.from(table).delete().neq("id", "00000000-0000-0000-0000-000000000000");
        if (error) {
          log.push(`⚠️ Erreur suppression ${table}: ${error.message}`);
        } else {
          log.push(`🗑️ Table ${table} vidée`);
        }
      }
    }

    // Import data table by table
    for (const table of orderedTables) {
      const rows = importData[table];
      if (!rows || rows.length === 0) continue;

      // Remove timestamps for clean upsert
      const cleanRows = rows.map((row: Record<string, unknown>) => {
        const clean = { ...row };
        delete clean.created_at;
        delete clean.updated_at;
        return clean;
      });

      const { error } = await adminClient.from(table).upsert(cleanRows, { onConflict: "id" });
      if (error) {
        log.push(`❌ Erreur import ${table}: ${error.message}`);
      } else {
        log.push(`✅ ${table}: ${cleanRows.length} enregistrements importés`);
      }
    }

    // Import storage files
    if (storage_files && storage_files.length > 0) {
      let fileCount = 0;
      let fileErrors = 0;

      for (const file of storage_files) {
        try {
          // Download from source URL
          const response = await fetch(file.url);
          if (!response.ok) {
            fileErrors++;
            continue;
          }

          const blob = await response.blob();
          const arrayBuffer = await blob.arrayBuffer();
          const uint8 = new Uint8Array(arrayBuffer);

          // Upload to storage
          const { error: uploadErr } = await adminClient.storage
            .from("images")
            .upload(file.path, uint8, {
              contentType: blob.type || "application/octet-stream",
              upsert: true,
            });

          if (uploadErr) {
            fileErrors++;
          } else {
            fileCount++;
          }
        } catch {
          fileErrors++;
        }
      }

      log.push(`📁 Fichiers: ${fileCount} importés, ${fileErrors} erreurs`);
    }

    return new Response(JSON.stringify({ success: true, log }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
