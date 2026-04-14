import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { name, theme, era, details } = await req.json();
    if (!name) throw new Error("Le nom de l'univers est requis");

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const prompt = `Tu es un créateur d'univers de fantasy/science-fiction expert. Génère un univers complet et détaillé en français avec les informations suivantes.

Nom de l'univers: ${name}
Thème: ${theme || "Fantasy sombre"}
Ère: ${era || "Ère Ancienne"}
Détails supplémentaires: ${details || "Aucun"}

Génère un JSON valide avec EXACTEMENT cette structure (sans commentaires, sans markdown):
{
  "universe": {
    "name": "${name}",
    "description": "Description détaillée de l'univers (3-5 phrases)",
    "era": "${era || "Ère Ancienne"}"
  },
  "characters": [
    {
      "name": "Nom du personnage",
      "title": "Titre/surnom",
      "backstory": "Histoire détaillée (3-5 phrases)",
      "stats": { "force": 5, "agilite": 5, "intelligence": 5, "magie": 5, "charisme": 5 },
      "race_name": "Nom de la race du personnage",
      "faction_name": "Nom de la faction du personnage"
    }
  ],
  "races": [
    {
      "name": "Nom de la race",
      "description": "Description détaillée (2-3 phrases)",
      "traits": ["Trait 1", "Trait 2", "Trait 3"]
    }
  ],
  "factions": [
    {
      "name": "Nom de la faction",
      "description": "Description détaillée (2-3 phrases)",
      "member_count": 150,
      "motto": "Devise de la faction"
    }
  ],
  "timeline_events": [
    {
      "year": -1000,
      "era": "Nom de l'ère",
      "title": "Titre de l'événement",
      "description": "Description détaillée"
    }
  ],
  "locations": [
    {
      "name": "Nom du lieu",
      "description": "Description détaillée (2-3 phrases)",
      "type": "Type (Citadelle, Forêt, Souterrain, etc.)"
    }
  ],
  "creatures": [
    {
      "name": "Nom de la créature",
      "description": "Description détaillée (2-3 phrases)",
      "danger_level": 3,
      "habitat": "Habitat naturel",
      "abilities": ["Capacité 1", "Capacité 2", "Capacité 3"]
    }
  ]
}

IMPORTANT:
- Génère exactement 4-6 personnages importants
- Génère exactement 3-4 races
- Génère exactement 3-4 factions
- Génère exactement 5-8 événements chronologiques ordonnés
- Génère exactement 4-6 lieux
- Génère exactement 4-6 créatures
- Les stats des personnages sont entre 1 et 10
- Le danger_level des créatures est entre 1 et 5
- Chaque personnage doit référencer une race et une faction existantes par leur nom
- Les événements chronologiques doivent être ordonnés par année
- Tout doit être cohérent et interconnecté
- Réponds UNIQUEMENT avec le JSON, sans texte autour`;

    const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.8,
      }),
    });

    if (!aiRes.ok) {
      const errText = await aiRes.text();
      throw new Error(`AI API error: ${aiRes.status} - ${errText}`);
    }

    const aiData = await aiRes.json();
    let content = aiData.choices?.[0]?.message?.content;
    if (!content) throw new Error("Pas de réponse de l'IA");

    // Clean markdown fences if present
    content = content.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
    
    const generated = JSON.parse(content);

    // Now save everything to Supabase
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const sb = createClient(supabaseUrl, supabaseKey);

    // 1. Create universe
    const { data: uniData, error: uniErr } = await sb
      .from("universes")
      .insert({
        name: generated.universe.name,
        description: generated.universe.description,
        era: generated.universe.era,
      })
      .select()
      .single();
    if (uniErr) throw uniErr;
    const universeId = uniData.id;

    // 2. Create races
    const racesInsert = generated.races.map((r: any) => ({
      name: r.name,
      description: r.description,
      traits: r.traits,
      universe_id: universeId,
    }));
    const { data: racesData, error: racesErr } = await sb
      .from("races")
      .insert(racesInsert)
      .select();
    if (racesErr) throw racesErr;

    // 3. Create factions
    const factionsInsert = generated.factions.map((f: any) => ({
      name: f.name,
      description: f.description,
      member_count: f.member_count,
      motto: f.motto,
      universe_id: universeId,
    }));
    const { data: factionsData, error: factionsErr } = await sb
      .from("factions")
      .insert(factionsInsert)
      .select();
    if (factionsErr) throw factionsErr;

    // Build name->id maps
    const raceMap: Record<string, string> = {};
    for (const r of racesData!) raceMap[r.name.toLowerCase()] = r.id;
    const factionMap: Record<string, string> = {};
    for (const f of factionsData!) factionMap[f.name.toLowerCase()] = f.id;

    // 4. Create characters with race/faction links
    for (const c of generated.characters) {
      const raceId = raceMap[c.race_name?.toLowerCase()] || null;
      const factionId = factionMap[c.faction_name?.toLowerCase()] || null;
      
      const { data: charData, error: charErr } = await sb
        .from("characters")
        .insert({
          name: c.name,
          title: c.title,
          backstory: c.backstory,
          stats: c.stats,
          universe_id: universeId,
          race_id: raceId,
          faction_id: factionId,
        })
        .select()
        .single();
      if (charErr) throw charErr;

      // Also create many-to-many links
      if (raceId) {
        await sb.from("character_races").insert({ character_id: charData.id, race_id: raceId });
      }
      if (factionId) {
        await sb.from("character_factions").insert({ character_id: charData.id, faction_id: factionId });
      }
    }

    // 5. Create timeline events
    const eventsInsert = generated.timeline_events.map((e: any) => ({
      year: e.year,
      era: e.era,
      title: e.title,
      description: e.description,
      universe_id: universeId,
    }));
    await sb.from("timeline_events").insert(eventsInsert);

    // 6. Create locations
    const locsInsert = generated.locations.map((l: any) => ({
      name: l.name,
      description: l.description,
      type: l.type,
      universe_id: universeId,
    }));
    await sb.from("locations").insert(locsInsert);

    // 7. Create creatures
    const creaturesInsert = generated.creatures.map((cr: any) => ({
      name: cr.name,
      description: cr.description,
      danger_level: Math.min(5, Math.max(1, cr.danger_level)),
      habitat: cr.habitat,
      abilities: cr.abilities,
      universe_id: universeId,
    }));
    await sb.from("creatures").insert(creaturesInsert);

    return new Response(JSON.stringify({
      success: true,
      universe_id: universeId,
      summary: {
        characters: generated.characters.length,
        races: generated.races.length,
        factions: generated.factions.length,
        events: generated.timeline_events.length,
        locations: generated.locations.length,
        creatures: generated.creatures.length,
      },
    }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
